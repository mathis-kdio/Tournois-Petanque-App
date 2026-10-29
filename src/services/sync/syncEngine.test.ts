/**
 * Tests du moteur de synchronisation.
 *
 * Stratégie : mocker getDrizzleDb(), supabaseClient et les tables Drizzle.
 * Les tests couvrent :
 *  - push : outbox → upsert → synced = true ; verrou mutex ;
 *  - pull : LWW (ligne distante plus récente écrase, ligne locale synced=true
 *    écrasée, ligne locale synced=false conservée) ;
 *  - tombstones : conversion en tombstone locale (update, pas de delete
 *    physique) si ligne locale sync, conservation si non sync ;
 *  - pull : échec de fetch → rien n'est appliqué, curseur non avancé ;
 *  - updateClockOffset : rpc('now') scalaire → offset stocké ;
 *  - purge des tombstones locales : delete physique des soft-deletes de
 *    plus de 30 jours déjà syncées, à la fin de chaque cycle complet ;
 *  - verrou (mutex) : pas de cycle concurrent.
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

// ─── Import après les mocks ──────────────────────────────────────────────────

import {
  pull,
  purgeLocalTombstones,
  push,
  syncCycle,
  updateClockOffset,
} from './syncEngine';

const mockUpsert = jest.fn();
const mockSelectRemote = jest.fn();
const mockRpc = jest.fn();
const mockInsertValues = jest.fn().mockResolvedValue(undefined);

const mockSelectIn = jest.fn();

jest.mock('@/utils/supabase', () => ({
  supabaseClient: {
    from: jest.fn(() => ({
      upsert: mockUpsert,
      select: (...args: any[]) => {
        // select('id, server_updated_at') suivi de .in(...) = relecture post-upsert ;
        // select('*') suivi de .gt(...) = pull paginé.
        if (args[0] === 'id, server_updated_at') {
          return { in: (...inArgs: any[]) => mockSelectIn(...inArgs) };
        }
        return mockSelectRemote(...args);
      },
      gt: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    })),
    // Wrapper paresseux : la factory jest.mock s'exécute avant
    // l'initialisation des consts mock* ci-dessus.
    rpc: (...args: any[]) => mockRpc(...args),
  },
}));

// Mock des tables Drizzle — objets factices avec les colonnes utilisées
jest.mock('@/db/schema', () => {
  const ft = (name: string) => ({
    id: `${name}.id`,
    synced: `${name}.synced`,
    updatedAt: `${name}.updatedAt`,
    deleted: `${name}.deleted`,
  });
  return {
    joueurs: ft('joueurs'),
    joueursSuggestion: ft('joueurs_suggestion'),
    listesJoueurs: ft('listes_joueurs'),
    terrains: ft('terrains'),
    tournoi: ft('tournoi'),
    joueursListes: ft('joueurs_listes'),
    equipe: ft('equipe'),
    equipesJoueurs: ft('equipes_joueurs'),
    match: ft('match'),
    syncState: { userId: 'syncState.userId' },
  };
});

// Mock de getDrizzleDb — mockDb.select retourne une chaîne fluent
// On utilise un callback pour personnaliser le résultat de .where() selon le contexte
const mockSelectWhereFn = jest.fn();
const mockRun = jest.fn();
const mockDb = {
  select: jest.fn(() => ({
    from: jest.fn(() => ({
      where: mockSelectWhereFn,
    })),
  })),
  insert: jest.fn((_table?: any) => ({
    values: mockInsertValues,
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn().mockResolvedValue({ changes: 1 }),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  })),
  // Le pull délimite ses écritures + le curseur par BEGIN/COMMIT
  // (une seule transaction SQLite).
  run: mockRun.mockResolvedValue(undefined),
};
jest.mock('@/db/useDatabaseMigrations', () => ({
  getDrizzleDb: () => mockDb,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const USER_ID = 'test-user-id';

function makeRow(overrides: Record<string, any> = {}) {
  return {
    id: 'row-1',
    synced: false,
    deleted: false,
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

function setupUpsertSuccess() {
  mockUpsert.mockResolvedValue({ data: null, error: null });
  // Relecture post-upsert : toutes les lignes ont un server_updated_at récent
  // (le trigger serveur a accepté l'écriture).
  mockSelectIn.mockImplementation(async (col: string, ids: string[]) => ({
    data: ids.map((id) => ({
      id,
      server_updated_at: new Date('2026-06-01T00:00:00Z').toISOString(),
    })),
    error: null,
  }));
}

function setupSelectRemoteAlwaysEmpty() {
  mockSelectRemote.mockReturnValue({
    gt: jest.fn().mockReturnValue({
      order: jest.fn().mockReturnValue({
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  });
}

const mockGtRemote = jest.fn();

function setupSelectRemoteWithRows(rowsByCall: any[][]) {
  let call = 0;
  mockGtRemote.mockReturnValue({
    order: jest.fn().mockReturnValue({
      range: jest.fn().mockImplementation(async () => {
        const rows = rowsByCall[call] ?? [];
        call++;
        return { data: rows, error: null };
      }),
    }),
  });
  mockSelectRemote.mockReturnValue({
    gt: mockGtRemote,
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('syncEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupUpsertSuccess();
    setupSelectRemoteAlwaysEmpty();
    mockRun.mockResolvedValue(undefined);
    mockInsertValues.mockResolvedValue(undefined);
  });

  describe('push', () => {
    it('pousse les lignes synced=false et les marque synced=true', async () => {
      // Le push boucle sur 9 tables. Pour la première table avec des lignes,
      // on retourne 2 lignes. Les autres retournent [].
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = mockSelectWhereFn.mock.calls.length - 1;
        // Premier appel = première table (joueurs_suggestion) → 2 lignes
        if (idx === 0) return [makeRow({ id: 'a' }), makeRow({ id: 'b' })];
        return [];
      });

      const result = await push({ userId: USER_ID });

      expect(result.pushed).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('ne pousse rien si outbox vide', async () => {
      mockSelectWhereFn.mockResolvedValue([]);

      const result = await push({ userId: USER_ID });

      expect(result.pushed).toBe(0);
      expect(mockUpsert).not.toHaveBeenCalled();
    });

    it('retourne une erreur si upsert échoue après max retries', async () => {
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = mockSelectWhereFn.mock.calls.length - 1;
        if (idx === 0) return [makeRow({ id: 'a' })];
        return [];
      });
      mockUpsert.mockRejectedValue(new Error('Network error'));

      const result = await push({ userId: USER_ID, maxRetries: 2 });

      expect(result.pushed).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Network error');
    });

    it("ne marque PAS synced=true si le serveur a ignoré l'écriture (LWW, server_updated_at non avancé)", async () => {
      // Ligne locale récente (2026-01-01) mais le serveur renvoie un
      // server_updated_at ancien : le trigger LWW a ignoré l'upsert
      // (RETURN NULL, pas d'erreur) — la ligne doit rester synced=false.
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = mockSelectWhereFn.mock.calls.length - 1;
        if (idx === 0) return [makeRow({ id: 'a' })];
        return [];
      });
      mockSelectIn.mockResolvedValue({
        data: [
          {
            id: 'a',
            server_updated_at: new Date('2025-01-01T00:00:00Z').toISOString(),
          },
        ],
        error: null,
      });

      const result = await push({ userId: USER_ID });

      expect(result.pushed).toBe(0);
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    it("retourne 'Sync already running' si une sync est en cours", async () => {
      // La synchro en cours bloque sur le select de sync_state (gate).
      let resolveGate!: (rows: any[]) => void;
      const gate = new Promise<any[]>((resolve) => {
        resolveGate = resolve;
      });
      mockSelectWhereFn.mockImplementation(async () => gate);

      const cyclePromise = syncCycle({ userId: USER_ID });
      // Laisser le cycle démarrer et bloquer sur la gate.
      await Promise.resolve();

      const pushResult = await push({ userId: USER_ID });

      expect(pushResult.pushed).toBe(0);
      expect(pushResult.errors).toEqual(['Sync already running']);

      resolveGate([]);
      await cyclePromise;
    });
  });

  describe('pull', () => {
    it('force un pull complet (curseur remis à 0) si lastPulledAt a plus de 30 jours', async () => {
      // 1er appel = sync_state → curseur vieux de 40 jours (les tombstones
      // de cette période ont été purgées côté serveur : pull complet sinon
      // les lignes supprimées ailleurs ressusciteraient).
      const oldCursor = Date.now() - 40 * 24 * 60 * 60 * 1_000;
      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0)
          return [{ userId: USER_ID, lastPulledAt: oldCursor, clockOffset: 0 }];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Test',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T00:00:01.000Z',
      };
      setupSelectRemoteWithRows([[remoteRow]]);

      await pull({ userId: USER_ID });

      // Le filtre .gt('server_updated_at', ...) doit partir de l'epoch 0
      // (pull complet) et non de l'ancien curseur.
      expect(mockGtRemote).toHaveBeenCalledWith(
        'server_updated_at',
        new Date(0).toISOString(),
      );
    });

    it('insère une ligne distante absente localement', async () => {
      // pull boucle sur 9 tables (PULL_ORDER = reverse de PUSH_ORDER).
      // Le 1er appel à mockSelectWhereFn = sync_state → []
      // Les appels suivants = local table lookups → [] (ligne absente)

      mockSelectWhereFn.mockResolvedValue([]);

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Test',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T00:00:01.000Z',
      };

      // Pour la première table de PULL_ORDER (match), retourner 1 ligne distante
      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(1);
      expect(mockDb.insert).toHaveBeenCalled();
      // Écritures + curseur commités dans une seule transaction, avec les
      // FK désactivées autour (PRAGMA OFF, BEGIN, COMMIT, PRAGMA ON).
      expect(mockRun).toHaveBeenCalledTimes(4);
      // Curseur avec recul de sécurité (PULL_CURSOR_LAG_MS = 5 s) :
      // lastPulledAt = max(server_updated_at) - 5 s.
      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: USER_ID,
          lastPulledAt: Date.parse('2026-01-01T00:00:01.000Z') - 5_000,
        }),
      );
    });

    it('écrase une ligne locale synced=true avec une ligne distante plus récente', async () => {
      const localRow = makeRow({
        id: 'remote-1',
        synced: true,
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      });

      // 1er appel = sync_state → []
      // 2e appel = local table lookup → [localRow]
      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) return []; // sync_state
        if (idx === 1) return [localRow]; // local row exists
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Updated',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-02T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-02T00:00:01.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(1);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('corrige le clockOffset : serveur en avance ne fait pas gagner une vieille écriture distante', async () => {
      // Serveur à 12:00:10, client à 12:00:00 → clockOffset = +10 000 ms.
      // Écriture distante à 12:00:05 serveur = 11:59:55 équivalent local.
      // Écriture locale à 12:00:03 local.
      // LWW correct : locale gagne (12:00:03 > 11:59:55 équivalent).
      // Avec le bug (+ clockOffset), la distante aurait gagné (12:00:15 > 12:00:03).
      const localRow = makeRow({
        id: 'remote-1',
        synced: false,
        updatedAt: new Date('2026-01-01T12:00:03.000Z'),
      });

      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) {
          // sync_state avec clockOffset = +10 000 ms
          return [{ userId: USER_ID, lastPulledAt: 0, clockOffset: 10_000 }];
        }
        if (idx === 1) return [localRow];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Remote',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-01T12:00:05.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T12:00:06.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      // L'écriture locale (12:00:03) est plus récente que la distante corrigée
      // (12:00:05 - 10s = 11:59:55) → pas d'écrasement.
      expect(result.pulled).toBe(0);
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('le clockOffset ne fait pas perdre une écriture distante réellement plus récente', async () => {
      // Serveur à 12:00:10, client à 12:00:00 → clockOffset = +10 000 ms.
      // Écriture distante à 12:00:08 serveur = 11:59:58 équivalent local.
      // Écriture locale à 12:00:03 local → distante gagne (11:59:58 < 12:00:03 ?
      // non : 12:00:08 - 10s = 11:59:58 < 12:00:03 → locale gagne, OK).
      // Prenons une distante clairement plus récente :
      // distante à 12:00:20 serveur = 12:00:10 équivalent local > 12:00:03 local.
      const localRow = makeRow({
        id: 'remote-1',
        synced: false,
        updatedAt: new Date('2026-01-01T12:00:03.000Z'),
      });

      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) {
          return [{ userId: USER_ID, lastPulledAt: 0, clockOffset: 10_000 }];
        }
        if (idx === 1) return [localRow];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Remote newer',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-01T12:00:20.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T12:00:21.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      // 12:00:20 - 10s = 12:00:10 > 12:00:03 → la distante gagne.
      expect(result.pulled).toBe(1);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('conserve une ligne locale synced=false (non sync gagne)', async () => {
      const localRow = makeRow({
        id: 'remote-1',
        synced: false,
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      });

      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) return []; // sync_state
        if (idx === 1) return [localRow];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Remote',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T00:00:01.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(0);
      // update ne doit pas être appelé pour écraser la ligne locale.
      // Le curseur (sync_state absent, 1er select → []) passe par un insert.
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('convertit en tombstone locale une ligne syncée face à une tombstone distante', async () => {
      const localRow = makeRow({
        id: 'remote-1',
        synced: true,
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      });

      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) return []; // sync_state
        if (idx === 1) return [localRow];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Deleted',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-02T00:00:00.000Z',
        deleted: true,
        deleted_at: '2026-01-02T00:00:01.000Z',
        server_updated_at: '2026-01-02T00:00:02.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(1);
      // Pas de delete physique dans le pull : conversion en tombstone
      // locale (deleted = true, synced = true) — la purge 30 jours fera
      // le reste, les enfants éventuels gardent une FK valide.
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
    });

    it('conserve une ligne locale non sync face à une tombstone distante', async () => {
      const localRow = makeRow({
        id: 'remote-1',
        synced: false,
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      });

      let callCount = 0;
      mockSelectWhereFn.mockImplementation(async function () {
        const idx = callCount++;
        if (idx === 0) return []; // sync_state
        if (idx === 1) return [localRow];
        return [];
      });

      const remoteRow = {
        id: 'remote-1',
        joueur_id: 1,
        name: 'Deleted',
        type: null,
        equipe: null,
        is_checked: false,
        user_id: USER_ID,
        updated_at: '2026-01-02T00:00:00.000Z',
        deleted: true,
        deleted_at: '2026-01-02T00:00:01.000Z',
        server_updated_at: '2026-01-02T00:00:02.000Z',
      };

      setupSelectRemoteWithRows([[remoteRow]]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(0);
      expect(mockDb.delete).not.toHaveBeenCalled();
    });

    it("applique les inserts parents d'abord (FK locales satisfaites)", async () => {
      // Fetch en PULL_ORDER (match d'abord) ; l'application doit se faire
      // en PUSH_ORDER : le tournoi (parent) doit être inséré avant le
      // match (enfant qui le référence par FK locale).
      mockSelectWhereFn.mockResolvedValue([]);

      const tournoiRow = {
        id: 'tournoi-1',
        name: 'T',
        nb_tours: 1,
        nb_matchs: 1,
        nb_pt_victoire: 13,
        speciaux_incompatibles: false,
        memes_equipes: false,
        memes_adversaires: 1,
        type_equipes: 'doublette',
        type_tournoi: 'championnat',
        avec_terrains: false,
        mode: 'avecEquipes',
        est_tournoi_actuel: true,
        create_at: '2026-01-01T00:00:00.000Z',
        user_id: USER_ID,
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T00:00:01.000Z',
      };
      const matchRow = {
        id: 'match-1',
        match_id: 1,
        tournoi_id: 'tournoi-1',
        tour_id: 1,
        tour_name: null,
        equipe1_id: 'eq-1',
        equipe2_id: 'eq-2',
        score1: null,
        score2: null,
        terrain_id: null,
        user_id: USER_ID,
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted: false,
        deleted_at: null,
        server_updated_at: '2026-01-01T00:00:01.000Z',
      };

      // PULL_ORDER : match (appel 0) puis tournoi (appel 4).
      const empty: any[] = [];
      setupSelectRemoteWithRows([
        [matchRow],
        empty,
        empty,
        empty,
        [tournoiRow],
        empty,
        empty,
        empty,
        empty,
      ]);

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(2);
      // 2 inserts de données + 1 insert du curseur (sync_state absent).
      expect(mockDb.insert).toHaveBeenCalledTimes(3);
      // Parent inséré avant enfant, même si le fetch l'a lu après.
      expect(mockDb.insert.mock.calls[0][0].id).toBe('tournoi.id');
      expect(mockDb.insert.mock.calls[1][0].id).toBe('match.id');
    });

    it("n'applique rien et n'avance pas le curseur si le fetch échoue", async () => {
      // Tout ou rien : erreur réseau au fetch → aucune écriture
      // locale, pas de commit de curseur, retentente au prochain cycle.
      mockSelectWhereFn.mockResolvedValue([]);

      mockSelectRemote.mockReturnValue({
        gt: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Network error' },
            }),
          }),
        }),
      });

      const result = await pull({ userId: USER_ID });

      expect(result.pulled).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Network error');
      expect(mockRun).not.toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });

  describe('updateClockOffset', () => {
    it("appelle rpc('now') et stocke l'offset dans sync_state", async () => {
      mockSelectWhereFn.mockResolvedValue([]); // sync_state absent → insert

      mockRpc.mockResolvedValue({
        data: '2026-10-14T10:00:00.000Z',
        error: null,
      });

      await updateClockOffset(USER_ID);

      expect(mockRpc).toHaveBeenCalledWith('now');
      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: USER_ID,
          clockOffset: expect.any(Number),
        }),
      );
    });

    it('ne casse pas si la RPC échoue', async () => {
      mockSelectWhereFn.mockResolvedValue([]);

      mockRpc.mockRejectedValue(new Error('PGRST202')); // fonction inexistante

      await expect(updateClockOffset(USER_ID)).resolves.toBeUndefined();
      expect(mockInsertValues).not.toHaveBeenCalled();
    });
  });

  describe('purgeLocalTombstones', () => {
    it('supprime physiquement les tombstones éligibles (sync + > 30 jours)', async () => {
      // 1re table de PULL_ORDER (match) → 2 tombstones éligibles,
      // les 8 tables suivantes → aucune.
      mockSelectWhereFn
        .mockResolvedValueOnce([{ id: 'ts-1' }, { id: 'ts-2' }])
        .mockResolvedValue([]);

      const purged = await purgeLocalTombstones();

      expect(purged).toBe(2);
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
    });

    it('ne supprime rien si aucune tombstone éligible', async () => {
      mockSelectWhereFn.mockResolvedValue([]);

      const purged = await purgeLocalTombstones();

      expect(purged).toBe(0);
      expect(mockDb.delete).not.toHaveBeenCalled();
    });

    it("interroge les 9 tables dans l'ordre enfants d'abord (PULL_ORDER)", async () => {
      mockSelectWhereFn.mockResolvedValue([]);

      await purgeLocalTombstones();

      expect(mockSelectWhereFn).toHaveBeenCalledTimes(9);
    });

    it('est appelée à la fin de chaque cycle complet', async () => {
      // Ordre des selects dans syncCycle : 1 (sync_state, pull)
      // + 9 (outbox, push) + 9 (purge). La 11e requête = purge de `match`.
      let call = 0;
      mockSelectWhereFn.mockImplementation(async () => {
        call++;
        if (call === 11) return [{ id: 'old-tombstone' }];
        return [];
      });
      setupSelectRemoteAlwaysEmpty();

      const result = await syncCycle({ userId: USER_ID });

      expect(result.errors).toHaveLength(0);
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
    });

    it('un échec de purge ne fait pas échouer le cycle', async () => {
      let call = 0;
      mockSelectWhereFn.mockImplementation(async () => {
        call++;
        if (call === 11) throw new Error('purge boom');
        return [];
      });
      setupSelectRemoteAlwaysEmpty();

      const result = await syncCycle({ userId: USER_ID });

      expect(result.errors).toHaveLength(0);
    });
  });

  describe('syncCycle (mutex)', () => {
    it('retourne immédiatement si un cycle est déjà en cours', async () => {
      mockSelectWhereFn.mockResolvedValue([]);

      const p1 = syncCycle({ userId: USER_ID });
      const p2 = syncCycle({ userId: USER_ID });

      const [r1, r2] = await Promise.all([p1, p2]);

      const blocked = [r1, r2].find((r) =>
        r.errors.includes('Sync already running'),
      );
      expect(blocked).toBeDefined();
    });
  });
});

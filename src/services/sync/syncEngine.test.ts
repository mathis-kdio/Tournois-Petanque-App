/**
 * Tests du moteur de synchronisation.
 *
 * Stratégie : mocker getDrizzleDb(), supabaseClient et les tables Drizzle.
 * Les tests couvrent :
 *  - push : outbox → upsert → synced = true ; verrou mutex ;
 *  - pull : LWW (ligne distante plus récente écrase, ligne locale synced=true
 *    écrasée, ligne locale synced=false conservée) ;
 *  - tombstones : delete local physique si sync, conserver si non sync ;
 *  - pull : échec de fetch → rien n'est appliqué, curseur non avancé ;
 *  - updateClockOffset : rpc('now') scalaire → offset stocké ;
 *  - verrou (mutex) : pas de cycle concurrent.
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

// ─── Import après les mocks ──────────────────────────────────────────────────

import { pull, push, syncCycle, updateClockOffset } from './syncEngine';

const mockUpsert = jest.fn();
const mockSelectRemote = jest.fn();
const mockRpc = jest.fn();
const mockInsertValues = jest.fn().mockResolvedValue(undefined);

jest.mock('@/utils/supabase', () => ({
  supabaseClient: {
    from: jest.fn(() => ({
      upsert: mockUpsert,
      select: mockSelectRemote,
      gt: jest.fn().mockReturnThis(),
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
  insert: jest.fn(() => ({
    values: mockInsertValues,
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn().mockResolvedValue(undefined),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  })),
  // Le pull délimite ses écritures + le curseur par BEGIN/COMMIT
  // (une seule transaction SQLite, §3.3.4).
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
}

function setupSelectRemoteAlwaysEmpty() {
  mockSelectRemote.mockReturnValue({
    gt: jest.fn().mockReturnValue({
      range: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  });
}

function setupSelectRemoteWithRows(rowsByCall: any[][]) {
  let call = 0;
  mockSelectRemote.mockReturnValue({
    gt: jest.fn().mockReturnValue({
      range: jest.fn().mockImplementation(async () => {
        const rows = rowsByCall[call] ?? [];
        call++;
        return { data: rows, error: null };
      }),
    }),
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
      // Écritures + curseur commités dans une seule transaction (BEGIN + COMMIT)
      expect(mockRun).toHaveBeenCalledTimes(2);
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

    it('supprime physiquement une ligne locale syncée quand tombstone distante', async () => {
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
      expect(mockDb.delete).toHaveBeenCalled();
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

    it("n'applique rien et n'avance pas le curseur si le fetch échoue", async () => {
      // Tout ou rien (§3.3.4) : erreur réseau au fetch → aucune écriture
      // locale, pas de commit de curseur, retentente au prochain cycle.
      mockSelectWhereFn.mockResolvedValue([]);

      mockSelectRemote.mockReturnValue({
        gt: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Network error' },
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

/**
 * Tests du cycle de vie du compte.
 *
 * Stratégie : mocker getDrizzleDb(), supabaseClient, les tables Drizzle et
 * AsyncStorage. Les tests couvrent :
 *  - prepareLoginSync : réouverture même compte (aucune purge), changement de
 *    compte (purge des lignes syncées), premier login, choix requis ;
 *  - checkLogout : outbox vide / non vide ;
 *  - adoptReplace : purge totale + pull ;
 *  - logoutAndPurge : purge + signOut ;
 *  - deleteAccountAndPurge : RPC + purge + signOut, échec RPC ;
 *  - journal des purges (purgeLog).
 */

// ─── Import après les mocks ──────────────────────────────────────────────────

import { addPurgeLogEntry, getPurgeLog } from './purgeLog';
import {
  adoptReplace,
  checkLogout,
  deleteAccountAndPurge,
  forceLogoutAndPurge,
  logoutAndPurge,
  prepareLoginSync,
} from './syncAccount';

const mockUpsert = jest.fn();
const mockSelectRemoteLimit = jest.fn();
const mockSelectRemoteRange = jest.fn();
const mockRpc = jest.fn();
const mockSignOut = jest.fn();

// Store AsyncStorage in-memory : le journal des purges doit réellement
// persister entre les appels pour être testé.
const asyncStorageStore = new Map<string, string>();
const mockGetItem = jest.fn((key: string) =>
  Promise.resolve(asyncStorageStore.get(key) ?? null),
);
const mockSetItem = jest.fn((key: string, value: string) => {
  asyncStorageStore.set(key, value);
  return Promise.resolve();
});
const mockRemoveItem = jest.fn((key: string) => {
  asyncStorageStore.delete(key);
  return Promise.resolve();
});

jest.mock('@/utils/supabase', () => ({
  supabaseClient: {
    from: jest.fn(() => ({
      upsert: mockUpsert,
      // remoteAccountHasData : select('id').limit(1)
      // pull : select('*').gt(...).order(...).range(...)
      select: jest.fn(() => ({
        limit: (...args: any[]) => mockSelectRemoteLimit(...args),
        gt: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: (...args: any[]) => mockSelectRemoteRange(...args),
          }),
        }),
      })),
    })),
    // Wrapper paresseux : la factory jest.mock s'exécute avant
    // l'initialisation des consts mock* ci-dessus.
    rpc: (...args: any[]) => mockRpc(...args),
    auth: {
      signOut: (...args: any[]) => mockSignOut(...args),
    },
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (key: any) => mockGetItem(key),
    setItem: (key: any, value: any) => mockSetItem(key, value),
    removeItem: (key: any) => mockRemoveItem(key),
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
    preparationTournoi: ft('preparation_tournoi'),
    joueursPreparationTournois: ft('joueurs_preparation_tournois'),
    terrainsPreparationTournois: ft('terrains_preparation_tournois'),
  };
});

// Mock de getDrizzleDb — select local (sync_state, counts, outbox push)
const mockSelectWhereFn = jest.fn();
const mockRun = jest.fn();
const mockDb = {
  select: jest.fn(() => ({
    from: jest.fn(() => ({
      where: mockSelectWhereFn,
    })),
  })),
  insert: jest.fn(() => ({
    values: jest.fn().mockResolvedValue(undefined),
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn().mockResolvedValue(undefined),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  })),
  // Purges : BEGIN/COMMIT explicites (cf. syncEngine pull).
  run: mockRun.mockResolvedValue(undefined),
};
jest.mock('@/db/useDatabaseMigrations', () => ({
  getDrizzleDb: () => mockDb,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const USER_ID = 'test-user-id';
const OTHER_USER_ID = 'other-user-id';

function setupRemoteEmpty() {
  mockSelectRemoteLimit.mockResolvedValue({ data: [], error: null });
  mockSelectRemoteRange.mockResolvedValue({ data: [], error: null });
}

function setupUpsertSuccess() {
  mockUpsert.mockResolvedValue({ data: null, error: null });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('syncAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupRemoteEmpty();
    setupUpsertSuccess();
    mockRun.mockResolvedValue(undefined);
    asyncStorageStore.clear();
    mockRpc.mockResolvedValue({ data: null, error: null });
    mockSignOut.mockResolvedValue(undefined);
  });

  describe('prepareLoginSync', () => {
    it('réouverture avec la même session : aucune purge, pas de choix', async () => {
      asyncStorageStore.set('localDataOwnerKey', USER_ID); // même compte

      const plan = await prepareLoginSync(USER_ID);

      expect(plan.isNewLogin).toBe(false);
      expect(plan.needsChoice).toBe(false);
      // Aucune purge des lignes syncées, aucun accès réseau.
      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(mockSelectRemoteLimit).not.toHaveBeenCalled();
    });

    it('changement de compte : purge des lignes syncées + choix requis si conflit', async () => {
      asyncStorageStore.set('localDataOwnerKey', OTHER_USER_ID); // autre compte
      // 3 lignes non syncées par table → conflit potentiel
      mockSelectWhereFn.mockResolvedValue([{ count: 1 }]);
      // Le compte distant a déjà des données
      mockSelectRemoteLimit.mockResolvedValue({
        data: [{ id: 'remote-row' }],
        error: null,
      });

      const plan = await prepareLoginSync(USER_ID);

      expect(plan.isNewLogin).toBe(true);
      expect(plan.unsyncedCount).toBe(9); // 9 tables × 1
      expect(plan.remoteHasData).toBe(true);
      expect(plan.needsChoice).toBe(true);
      // Purge des lignes syncées (9 tables), journal écrit.
      expect(mockDb.delete).toHaveBeenCalledTimes(9);
      // Le propriétaire n'est PAS encore enregistré (attente du choix) :
      // le flag adoptionPending est posé pour forcer le dialogue au prochain
      // lancement si l'app est fermée avant la décision.
      expect(mockSetItem).not.toHaveBeenCalledWith(
        'localDataOwnerKey',
        USER_ID,
      );
      expect(mockSetItem).toHaveBeenCalledWith('adoptionPendingKey', '1');
    });

    it('adoption en attente (app fermée avant le choix) : re-présente le dialogue', async () => {
      // Le propriétaire n'a pas été enregistré, mais le flag pending est posé.
      asyncStorageStore.set('adoptionPendingKey', '1');
      mockSelectWhereFn.mockResolvedValue([{ count: 1 }]);
      mockSelectRemoteLimit.mockResolvedValue({
        data: [{ id: 'remote-row' }],
        error: null,
      });

      const plan = await prepareLoginSync(USER_ID);

      // isNewLogin forcé par le flag pending, même sans previousOwner.
      expect(plan.isNewLogin).toBe(true);
      expect(plan.needsChoice).toBe(true);
    });

    it('premier login sans écritures hors ligne : pas de choix', async () => {
      // appareil vierge — store vide
      mockSelectWhereFn.mockResolvedValue([{ count: 0 }]);
      mockSelectRemoteLimit.mockResolvedValue({
        data: [{ id: 'remote-row' }],
        error: null,
      });

      const plan = await prepareLoginSync(USER_ID);

      expect(plan.isNewLogin).toBe(true);
      expect(plan.unsyncedCount).toBe(0);
      expect(plan.remoteHasData).toBe(true);
      expect(plan.needsChoice).toBe(false); // rien à fusionner → pull direct
      // Pas de previous owner → pas de purge des lignes syncées
      expect(mockDb.delete).not.toHaveBeenCalled();
      // Pas de conflit → propriétaire enregistré immédiatement.
      expect(mockSetItem).toHaveBeenCalledWith('localDataOwnerKey', USER_ID);
    });

    it('hors ligne : remoteHasData à false → pas de choix (fusion par défaut)', async () => {
      // store vide (premier login)
      mockSelectWhereFn.mockResolvedValue([{ count: 2 }]);
      mockSelectRemoteLimit.mockRejectedValue(new Error('Network error'));

      const plan = await prepareLoginSync(USER_ID);

      expect(plan.remoteHasData).toBe(false);
      expect(plan.needsChoice).toBe(false);
      expect(plan.isNewLogin).toBe(true);
    });

    it('changement de compte avec écritures hors ligne : choix requis même si le compte distant semble vide', async () => {
      // Les écritures hors ligne datent du compte précédent : elles ne
      // doivent pas être poussées vers le nouveau compte sans confirmation,
      // même si le compte distant paraît vide (ou vérification impossible).
      asyncStorageStore.set('localDataOwnerKey', OTHER_USER_ID);
      mockSelectWhereFn.mockResolvedValue([{ count: 2 }]);
      setupRemoteEmpty();

      const plan = await prepareLoginSync(USER_ID);

      expect(plan.isNewLogin).toBe(true);
      expect(plan.remoteHasData).toBe(false);
      expect(plan.unsyncedCount).toBe(18); // 9 tables × 2
      expect(plan.needsChoice).toBe(true);
    });
  });

  describe('checkLogout', () => {
    it('autorise le logout si outbox vide', async () => {
      mockSelectWhereFn.mockResolvedValue([{ count: 0 }]);

      const check = await checkLogout();

      expect(check.canLogout).toBe(true);
      expect(check.unsyncedCount).toBe(0);
    });

    it('bloque le logout si des lignes ne sont pas synchronisées', async () => {
      mockSelectWhereFn.mockResolvedValue([{ count: 4 }]);

      const check = await checkLogout();

      expect(check.canLogout).toBe(false);
      expect(check.unsyncedCount).toBe(36); // 9 tables × 4
    });
  });

  describe('adoptReplace', () => {
    it('purge toutes les tables (sync + transitoires) + sync_state, puis pull', async () => {
      // 9 sync + 3 preparation + sync_state = 13 deletes, plus le BEGIN/COMMIT
      const result = await adoptReplace(USER_ID);

      // 12 tables + sync_state
      expect(mockDb.delete).toHaveBeenCalledTimes(13);
      // Purge dans une transaction
      expect(mockRun).toHaveBeenCalled();
      // Pull exécuté (select distant paginé)
      expect(mockSelectRemoteRange).toHaveBeenCalled();
      expect(result.errors).toHaveLength(0);
      // Propriétaire effacé (purgeLocalData) puis réenregistré (adoptReplace),
      // flag adoption pending cleared, purge journalisée.
      expect(mockRemoveItem).toHaveBeenCalledWith('localDataOwnerKey');
      expect(mockSetItem).toHaveBeenCalledWith('localDataOwnerKey', USER_ID);
      expect(mockRemoveItem).toHaveBeenCalledWith('adoptionPendingKey');
      expect(mockSetItem).toHaveBeenCalledWith(
        'syncPurgeLogKey',
        expect.stringContaining('login_replace_purge'),
      );
    });
  });

  describe('logoutAndPurge', () => {
    it('purge les données locales puis signOut si outbox vide', async () => {
      // Outbox vide : countUnsynced retourne 0 pour les 9 tables.
      mockSelectWhereFn.mockResolvedValue([{ count: 0 }]);

      await logoutAndPurge(USER_ID);

      expect(mockDb.delete).toHaveBeenCalledTimes(13);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        'syncPurgeLogKey',
        expect.stringContaining('logout_purge'),
      );
    });

    it('refuse la purge si des lignes sont encore non synchronisées (TOCTOU)', async () => {
      // Une écriture UI est arrivée entre checkLogout() et logoutAndPurge().
      mockSelectWhereFn.mockResolvedValue([{ count: 4 }]);

      await expect(logoutAndPurge(USER_ID)).rejects.toThrow(
        'Logout bloqué : 36 ligne(s) non synchronisée(s).',
      );

      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });
  });

  describe('forceLogoutAndPurge', () => {
    it('purge les données locales sans vérifier l\'outbox, puis signOut', async () => {
      // Outbox NON vide : la purge forcée passe quand même (choix explicite).
      mockSelectWhereFn.mockResolvedValue([{ count: 4 }]);

      await forceLogoutAndPurge(USER_ID);

      expect(mockDb.delete).toHaveBeenCalledTimes(13);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        'syncPurgeLogKey',
        expect.stringContaining('logout_forced_purge'),
      );
    });
  });

  describe('deleteAccountAndPurge', () => {
    it('supprime le compte via RPC, purge localement puis signOut', async () => {
      // Outbox vide : la suppression est autorisée.
      mockSelectWhereFn.mockResolvedValue([{ count: 0 }]);

      await deleteAccountAndPurge(USER_ID);

      expect(mockRpc).toHaveBeenCalledWith('delete_own_account');
      expect(mockDb.delete).toHaveBeenCalledTimes(13);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        'syncPurgeLogKey',
        expect.stringContaining('account_deleted_purge'),
      );
    });

    it('bloque la suppression si des lignes ne sont pas synchronisées', async () => {
      // Outbox non vide : on ne supprime ni le compte distant ni les données
      // locales sans avertissement.
      mockSelectWhereFn.mockResolvedValue([{ count: 2 }]);

      await expect(deleteAccountAndPurge(USER_ID)).rejects.toThrow(
        'Suppression bloquée : 18 ligne(s) non synchronisée(s).',
      );

      expect(mockRpc).not.toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('ne purge rien si la RPC échoue', async () => {
      mockSelectWhereFn.mockResolvedValue([{ count: 0 }]);
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'PGRST202' },
      });

      // L'erreur PostgrestError n'est pas une Error JS — vérifier la valeur
      await expect(deleteAccountAndPurge(USER_ID)).rejects.toEqual({
        message: 'PGRST202',
      });

      expect(mockDb.delete).not.toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });
  });

  describe('purgeLog', () => {
    it('journalise et relit les purges (le plus récent en tête)', async () => {
      await addPurgeLogEntry({ action: 'logout_purge', userId: USER_ID });
      await addPurgeLogEntry({
        action: 'account_deleted_purge',
        userId: USER_ID,
      });

      const log = await getPurgeLog();

      expect(log).toHaveLength(2);
      expect(log[0].action).toBe('account_deleted_purge');
      expect(log[0].date).toEqual(expect.any(String));
      expect(log[1].action).toBe('logout_purge');
    });
  });
});

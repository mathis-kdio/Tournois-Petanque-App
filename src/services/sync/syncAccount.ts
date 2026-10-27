/**
 * Cycle de vie du compte.
 *
 *  - Login : adoption des données locales — purge des lignes syncées
 *    du compte précédent, choix « fusionner / remplacer » si l'appareil a des
 *    écritures hors ligne ET que le compte distant a déjà des données ;
 *  - Logout : purge locale conditionnelle — bloqué si l'outbox n'est
 *    pas vide, sinon purge totale + signOut ;
 *  - Suppression du compte : purge RGPD côté Supabase via la RPC
 *    `delete_own_account` (migration 0003, ON DELETE CASCADE sur user_id),
 *    puis purge locale.
 *
 * Le « propriétaire » des données locales (dernier compte connecté) est suivi
 * dans AsyncStorage : c'est ce qui distingue un login (changement de compte,
 * adoption nécessaire) d'une simple réouverture de l'app avec la même session
 * (les lignes syncées ne doivent surtout pas être purgées).
 *
 * Module sans dépendance React — testable avec des mocks.
 */

import {
  joueursPreparationTournois,
  preparationTournoi,
  syncState,
  terrainsPreparationTournois,
} from '@/db/schema';
import { LOCAL_DATA_OWNER_KEY } from '@/utils/async-storage/key';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { runInBulkTransaction } from '@/db/sync/localTransaction';
import { supabaseClient } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import {
  addPurgeLogEntry,
  type PurgeAction,
  type PurgeLogEntry,
} from './purgeLog';
import { countUnsynced, pull, syncCycle, TABLES_BY_NAME } from './syncEngine';
import { SYNC_MAPPERS } from './syncMappers';
import { PULL_ORDER, PUSH_ORDER, type SyncTableName } from './syncTables';

export type { PurgeAction, PurgeLogEntry };

// ─── Propriétaire des données locales ────────────────────────────────────────

/** Dernier compte connecté sur cet appareil (null = données vierges/anonymes). */
export async function getLocalDataOwner(): Promise<string | null> {
  const owner = await AsyncStorage.getItem(LOCAL_DATA_OWNER_KEY);
  return owner ?? null;
}

async function setLocalDataOwner(userId: string | null): Promise<void> {
  if (userId) {
    await AsyncStorage.setItem(LOCAL_DATA_OWNER_KEY, userId);
  } else {
    await AsyncStorage.removeItem(LOCAL_DATA_OWNER_KEY);
  }
}

// ─── Purges locales ──────────────────────────────────────────────────────────

/**
 * Purge les lignes locales déjà synchronisées : elles proviennent
 * nécessairement du compte précédent (le logout purge tout, sinon).
 * Le pull du nouveau compte restitue les siennes si besoin.
 *
 * Enfants d'abord (PULL_ORDER) : les FK locales voient les enfants
 * disparaître avant leurs parents. Les FK sont en outre désactivées le
 * temps de la purge : un parent sync peut avoir des enfants non sync
 * (conservés — l'écriture locale gagne) qui le référencent.
 */
async function purgeSyncedRows(): Promise<void> {
  const db = getDrizzleDb();
  await runInBulkTransaction(db, async () => {
    for (const tableName of PULL_ORDER) {
      const table = TABLES_BY_NAME[tableName];
      await db.delete(table).where(eq(table.synced, true));
    }
  });
}

/**
 * Purge totale des données locales : toutes les tables —
 * synchronisées et transitoires (preparation_*) — plus sync_state.
 * Purge atomique (une seule transaction SQLite), puis journal.
 *
 * FK désactivées le temps de la purge : les tables transitoires
 * référencent les lignes syncées et peuvent être supprimées après elles.
 */
export async function purgeLocalData(
  action: PurgeAction,
  userId: string | null,
): Promise<void> {
  const db = getDrizzleDb();
  // Enfants d'abord (FK), comme PULL_ORDER, puis les tables transitoires.
  const tables = [
    ...PULL_ORDER.map((name: SyncTableName) => TABLES_BY_NAME[name]),
    joueursPreparationTournois,
    terrainsPreparationTournois,
    preparationTournoi,
  ];

  await runInBulkTransaction(db, async () => {
    for (const table of tables) {
      await db.delete(table);
    }
    await db.delete(syncState);
  });

  await setLocalDataOwner(null);
  await addPurgeLogEntry({ action, userId });
}

// ─── Login : adoption des données locales ────────────────────────────

export interface LoginSyncPlan {
  /** Compte propriétaire des données locales avant ce login (null = vierge). */
  previousOwner: string | null;
  /** Vrai si c'est un vrai login (changement/first compte), pas une réouverture. */
  isNewLogin: boolean;
  /** Lignes en attente de push (écritures hors ligne). */
  unsyncedCount: number;
  /** Le compte distant contient déjà des données. */
  remoteHasData: boolean;
  /** Choix utilisateur requis : « fusionner » ou « remplacer ». */
  needsChoice: boolean;
}

/**
 * Prépare la synchro de login. À appeler AVANT tout cycle pull/push :
 *  1. si les données locales appartiennent à un autre compte → purge des
 *     lignes syncées (elles seront restituées par le pull) ;
 *  2. enregistre le nouveau propriétaire ;
 *  3. si l'appareil a des écritures hors ligne ET que le compte distant a
 *     déjà des données → un choix utilisateur est requis.
 */
export async function prepareLoginSync(userId: string): Promise<LoginSyncPlan> {
  const previousOwner = await getLocalDataOwner();
  const isNewLogin = previousOwner !== userId;

  if (isNewLogin && previousOwner !== null) {
    await purgeSyncedRows();
    await addPurgeLogEntry({ action: 'login_previous_account_purged', userId });
  }

  if (isNewLogin) {
    await setLocalDataOwner(userId);
  }

  if (!isNewLogin) {
    // Réouverture avec la même session : rien à adopter, cycle normal.
    return {
      previousOwner,
      isNewLogin: false,
      unsyncedCount: 0,
      remoteHasData: false,
      needsChoice: false,
    };
  }

  const unsyncedCount = await countUnsynced();
  const remoteHasData = await remoteAccountHasData();

  return {
    previousOwner,
    isNewLogin: true,
    unsyncedCount,
    remoteHasData,
    needsChoice: unsyncedCount > 0 && remoteHasData,
  };
}

/**
 * Le compte distant a-t-il déjà des données ?
 * Hors ligne / en erreur → false : on ne propose pas le choix, le
 * comportement par défaut (« fusionner », conservateur) s'applique.
 */
async function remoteAccountHasData(): Promise<boolean> {
  for (const tableName of PUSH_ORDER) {
    try {
      const { data, error } = await supabaseClient
        .from(SYNC_MAPPERS[tableName].pgTable)
        .select('id')
        .limit(1);

      if (error) throw error;
      if ((data ?? []).length > 0) return true;
    } catch {
      // Table illisible (hors ligne) → table suivante.
    }
  }
  return false;
}

/** Choix « conserver les données locales et fusionner » : cycle complet. */
export async function adoptMerge(userId: string) {
  return syncCycle({ userId });
}

/** Choix « remplacer par les données du compte » : purge puis pull complet. */
export async function adoptReplace(userId: string) {
  await purgeLocalData('login_replace_purge', userId);
  return pull({ userId });
}

// ─── Logout : purge locale conditionnelle ─────────────────────────────

export interface LogoutCheck {
  /** Vrai si l'outbox est vide — le logout peut purger sans perte. */
  canLogout: boolean;
  /** Nombre de lignes non synchronisées. */
  unsyncedCount: number;
}

/** Vérifie si le logout est sûr (outbox vide). */
export async function checkLogout(): Promise<LogoutCheck> {
  const unsyncedCount = await countUnsynced();
  return { canLogout: unsyncedCount === 0, unsyncedCount };
}

/** Déconnexion sûre : purge locale (journalisée) puis signOut. */
export async function logoutAndPurge(userId: string): Promise<void> {
  await purgeLocalData('logout_purge', userId);
  await supabaseClient.auth.signOut();
}

// ─── Suppression du compte : purge Supabase RGPD ──────────────────────

/**
 * Supprime le compte côté Supabase via la RPC `delete_own_account`
 * (SECURITY DEFINER, migration 0003) : le ON DELETE CASCADE sur
 * `user_id REFERENCES auth.users(id)` purge toutes les tables du compte.
 * Puis purge locale (comme logout) et déconnexion.
 */
export async function deleteAccountAndPurge(userId: string): Promise<void> {
  const { error } = await supabaseClient.rpc('delete_own_account');
  if (error) throw error;
  await purgeLocalData('account_deleted_purge', userId);
  await supabaseClient.auth.signOut();
}

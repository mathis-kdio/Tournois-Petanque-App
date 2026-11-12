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
import {
  ADOPTION_PENDING_KEY,
  LOCAL_DATA_OWNER_KEY,
} from '@/utils/async-storage/key';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { runInBulkTransaction } from '@/db/sync/localTransaction';
import { supabaseClient } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import { addPurgeLogEntry, type PurgeAction } from './purgeLog';
import { countUnsynced, pull, syncCycle } from './syncEngine';
import {
  PULL_ORDER,
  PUSH_ORDER,
  SYNC_TABLES,
  type SyncTableName,
} from './syncTables';

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

/**
 * Vrai si une adoption est en attente de choix utilisateur (persistant).
 * Si l'app est fermée avant le choix, le prochain lancement doit
 * re-proposer le dialogue au lieu de pousser les données de l'ancien
 * compte vers le nouveau.
 */
export async function isAdoptionPending(): Promise<boolean> {
  return (await AsyncStorage.getItem(ADOPTION_PENDING_KEY)) === '1';
}

async function setAdoptionPending(pending: boolean): Promise<void> {
  if (pending) {
    await AsyncStorage.setItem(ADOPTION_PENDING_KEY, '1');
  } else {
    await AsyncStorage.removeItem(ADOPTION_PENDING_KEY);
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
      const table = SYNC_TABLES[tableName].table;
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
    ...PULL_ORDER.map((name: SyncTableName) => SYNC_TABLES[name].table),
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
  await setAdoptionPending(false);
  await addPurgeLogEntry({ action, userId });
}

// ─── Login : adoption des données locales ────────────────────────────

export interface LoginSyncPlan {
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
 *  3. si l'appareil a des écritures hors ligne ET (que le compte distant a
 *     déjà des données OU que ces écritures ont été créées sous le compte
 *     précédent) → un choix utilisateur est requis. Sans cette seconde
 *     condition, un changement de compte transférerait silencieusement les
 *     écritures locales du compte précédent vers le nouveau (y compris si
 *     la vérification du compte distant échoue, hors ligne).
 */
export async function prepareLoginSync(userId: string): Promise<LoginSyncPlan> {
  const previousOwner = await getLocalDataOwner();
  // Adoption en attente d'un choix précédent (app fermée avant la décision) :
  // le propriétaire n'a PAS été enregistré, on force la re-présentation du
  // dialogue au lieu de pousser les données de l'ancien compte vers le nouveau.
  const adoptionPending = await isAdoptionPending();
  const isNewLogin = previousOwner !== userId || adoptionPending;

  if (isNewLogin && previousOwner !== null && !adoptionPending) {
    await purgeSyncedRows();
    await addPurgeLogEntry({ action: 'login_previous_account_purged', userId });
  }

  if (!isNewLogin) {
    // Réouverture avec la même session : rien à adopter, cycle normal.
    return {
      isNewLogin: false,
      unsyncedCount: 0,
      remoteHasData: false,
      needsChoice: false,
    };
  }

  // Le propriétaire n'est enregistré qu'APRÈS le choix de l'utilisateur
  // (adoptMerge / adoptReplace). Persistant : si l'app est fermée avant le
  // choix, le flag ADOPTION_PENDING_KEY force la re-présentation du dialogue
  // au prochain lancement, et les données de l'ancien compte ne fuient pas.

  const unsyncedCount = await countUnsynced();
  const remoteHasData = await remoteAccountHasData();

  const needsChoice =
    unsyncedCount > 0 && (remoteHasData || previousOwner !== null);

  if (needsChoice) {
    // Marquer l'adoption comme en attente AVANT de présenter le dialogue.
    await setAdoptionPending(true);
  } else {
    // Pas de conflit : enregistrer le propriétaire directement.
    await setLocalDataOwner(userId);
  }

  return {
    isNewLogin: true,
    unsyncedCount,
    remoteHasData,
    // Conflit si le compte distant a déjà des données ; ou si les écritures
    // hors ligne datent du compte précédent (elles ne doivent pas être
    // poussées vers le nouveau compte sans confirmation, même si le compte
    // distant paraît vide ou si la vérification a échoué hors ligne).
    needsChoice,
  };
}

/**
 * Le compte distant a-t-il déjà des données ?
 * Les 9 tables sont interrogées en parallèle (une requête `limit(1)` chacune)
 * : en séquentiel, un compte vide coûterait 9 allers-réseau au login.
 * Hors ligne / en erreur sur une table → false pour cette table ; le
 * comportement par défaut (« fusionner », conservateur) s'applique si tout
 * échoue.
 */
async function remoteAccountHasData(): Promise<boolean> {
  const results = await Promise.all(
    PUSH_ORDER.map(async (tableName) => {
      try {
        const { data, error } = await supabaseClient
          .from(SYNC_TABLES[tableName].pgTable)
          .select('id')
          .limit(1);

        if (error) throw error;
        return (data ?? []).length > 0;
      } catch {
        // Table illisible (hors ligne) → false pour cette table.
        return false;
      }
    }),
  );
  return results.some(Boolean);
}

/** Choix « conserver les données locales et fusionner » : cycle complet. */
export async function adoptMerge(userId: string) {
  await setAdoptionPending(false);
  await setLocalDataOwner(userId);
  return syncCycle({ userId });
}

/** Choix « remplacer par les données du compte » : purge puis pull complet. */
export async function adoptReplace(userId: string) {
  await setAdoptionPending(false);
  await purgeLocalData('login_replace_purge', userId);
  await setLocalDataOwner(userId);
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

/**
 * Déconnexion sûre : purge locale (journalisée) puis signOut.
 *
 * Re-vérifie l'outbox juste avant la purge (TOCTOU) : entre le checkLogout()
 * de l'UI et cet appel, une écriture UI a pu arriver (debounce 2 s). Sans
 * cette re-vérification, la purge supprimerait des données non synchronisées.
 * Lève une erreur si l'outbox n'est pas vide.
 */
export async function logoutAndPurge(userId: string): Promise<void> {
  const unsyncedCount = await countUnsynced();
  if (unsyncedCount > 0) {
    throw new Error(
      `Logout bloqué : ${unsyncedCount} ligne(s) non synchronisée(s).`,
    );
  }
  await purgeLocalData('logout_purge', userId);
  await supabaseClient.auth.signOut();
}

/**
 * Déconnexion forcée : purge locale SANS vérifier l'outbox, puis signOut.
 *
 * À n'utiliser que sur confirmation explicite de l'utilisateur
 * (« se déconnecter quand même et perdre ces données ») : les lignes non
 * synchronisées sont alors définitivement perdues, c'est le choix assumé.
 */
export async function forceLogoutAndPurge(userId: string): Promise<void> {
  await purgeLocalData('logout_forced_purge', userId);
  await supabaseClient.auth.signOut();
}

// ─── Suppression du compte : purge Supabase RGPD ──────────────────────

/**
 * Supprime le compte côté Supabase via la RPC `delete_own_account`
 * (SECURITY DEFINER, migration 0003) : le ON DELETE CASCADE sur
 * `user_id REFERENCES auth.users(id)` purge toutes les tables du compte.
 * Puis purge locale (comme logout) et déconnexion.
 *
 * Re-vérifie l'outbox avant la RPC (comme logoutAndPurge) : sans cela, des
 * écritures locales non synchronisées seraient purgées localement en même
 * temps que le compte distant, sans avertissement. Lève une erreur si
 * l'outbox n'est pas vide.
 */
export async function deleteAccountAndPurge(userId: string): Promise<void> {
  const unsyncedCount = await countUnsynced();
  if (unsyncedCount > 0) {
    throw new Error(
      `Suppression bloquée : ${unsyncedCount} ligne(s) non synchronisée(s).`,
    );
  }
  const { error } = await supabaseClient.rpc('delete_own_account');
  if (error) throw error;
  await purgeLocalData('account_deleted_purge', userId);
  await supabaseClient.auth.signOut();
}

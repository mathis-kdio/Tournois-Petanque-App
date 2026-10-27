/**
 * Journal des purges locales.
 *
 * Chaque purge (changement de compte, remplacement au login, logout,
 * suppression de compte) est consignée dans AsyncStorage — utile pour
 * diagnostiquer une perte de données signalée par un utilisateur.
 */

import { SYNC_PURGE_LOG_KEY } from '@/utils/async-storage/key';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PurgeAction =
  /** Lignes syncées du compte précédent purgées au login. */
  | 'login_previous_account_purged'
  /** Purge locale avant pull complet — choix « remplacer ». */
  | 'login_replace_purge'
  /** Purge locale au logout, outbox vide. */
  | 'logout_purge'
  /** Purge locale après suppression du compte. */
  | 'account_deleted_purge';

export interface PurgeLogEntry {
  /** Date ISO de la purge. */
  date: string;
  action: PurgeAction;
  /** Compte concerné au moment de la purge (null après effacement du propriétaire). */
  userId: string | null;
}

/** Nombre maximal d'entrées conservées. */
const MAX_ENTRIES = 100;

/** Ajoute une entrée au journal (le plus récent en tête). */
export async function addPurgeLogEntry(
  entry: Omit<PurgeLogEntry, 'date'>,
): Promise<void> {
  try {
    const log = await getPurgeLog();
    log.unshift({ ...entry, date: new Date().toISOString() });
    await AsyncStorage.setItem(
      SYNC_PURGE_LOG_KEY,
      JSON.stringify(log.slice(0, MAX_ENTRIES)),
    );
  } catch (err) {
    // Le journal ne doit jamais faire échouer une purge.
    console.warn(
      `[sync] journal des purges: écriture impossible (${String(err)})`,
    );
  }
}

/** Lit le journal des purges (le plus récent en tête). */
export async function getPurgeLog(): Promise<PurgeLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(SYNC_PURGE_LOG_KEY);
    return raw ? (JSON.parse(raw) as PurgeLogEntry[]) : [];
  } catch {
    return [];
  }
}

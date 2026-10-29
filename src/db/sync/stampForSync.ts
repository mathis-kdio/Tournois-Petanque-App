/**
 * Helper commun pour horoder et marquer les lignes comme « à synchroniser ».
 *
 * À chaque insert / update, les repositories appellent `stampForSync()` pour :
 *  - forcer `updatedAt = new Date()` (horloge LWW, stockée en epoch ms via `timestamp_ms`) ;
 *  - marquer `synced = false` (pattern outbox : la ligne devra être poussée).
 *
 * Le `delete()` devient un soft-delete (`deleted = true`) et passe aussi par
 * ce helper.
 *
 * Chaque appel notifie le bus d'écritures (`writeBus`) pour déclencher le push
 * debouncé côté syncTrigger.
 */

import { notifySyncWrite } from './writeBus';

/** Valeurs de stamp (sans notifier) — à utiliser en masse, puis notifier une fois. */
function stampValues(): { updatedAt: Date; synced: boolean } {
  return {
    updatedAt: new Date(),
    synced: false,
  };
}

/**
 * Objet partiel à fusionner dans un `insert().values(...)` ou `update().set(...)`.
 *
 * `updatedAt` est un `Date` car les colonnes du schema utilisent `timestamp_ms`
 * (Drizzle infère alors le type JS comme `Date`, pas `number`).
 */
export function stampForSync(): { updatedAt: Date; synced: boolean } {
  notifySyncWrite();
  return stampValues();
}

/**
 * Objet partiel pour un soft-delete (tombstone).
 */
export function stampForDelete(): {
  updatedAt: Date;
  synced: boolean;
  deleted: boolean;
} {
  notifySyncWrite();
  return {
    ...stampValues(),
    deleted: true,
  };
}

/**
 * Stamp sans notification pour les inserts en masse : notifier UNE SEULE fois
 * après l'insert (ex. `stampForSyncBulk(n)`), sinon N lignes = N notifications.
 */
export function stampForSyncBulk(
  count: number,
): { updatedAt: Date; synced: boolean }[] {
  if (count > 0) notifySyncWrite();
  return Array.from({ length: count }, () => stampValues());
}

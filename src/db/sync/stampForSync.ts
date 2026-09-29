/**
 * Helper commun pour horoder et marquer les lignes comme « à synchroniser ».
 *
 * À chaque insert / update, les repositories appellent `stampForSync()` pour :
 *  - forcer `updatedAt = new Date()` (horloge LWW, stockée en epoch ms via `timestamp_ms`) ;
 *  - marquer `synced = false` (pattern outbox : la ligne devra être poussée).
 *
 * Le `delete()` devient un soft-delete (`deleted = true`) et passe aussi par
 * ce helper.
 */

/**
 * Objet partiel à fusionner dans un `insert().values(...)` ou `update().set(...)`.
 *
 * `updatedAt` est un `Date` car les colonnes du schema utilisent `timestamp_ms`
 * (Drizzle infère alors le type JS comme `Date`, pas `number`).
 */
export function stampForSync(): { updatedAt: Date; synced: boolean } {
  return {
    updatedAt: new Date(),
    synced: false,
  };
}

/**
 * Objet partiel pour un soft-delete (tombstone).
 */
export function stampForDelete(): {
  updatedAt: Date;
  synced: boolean;
  deleted: boolean;
} {
  return {
    updatedAt: new Date(),
    synced: false,
    deleted: true,
  };
}

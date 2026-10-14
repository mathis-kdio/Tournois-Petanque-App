/**
 * Bus d'événements « écriture locale » (architecture §3.4).
 *
 * `stampForSync()` / `stampForDelete()` notifient chaque écriture des
 * repositories ; le hook `useSyncTrigger` s'abonne pour déclencher le push
 * debouncé. Le bus est volontairement découplé de React : les repositories
 * n'importent aucun hook, le trigger n'importe aucun repository.
 *
 * Les écritures internes à la synchro (pull, marquage synced = true) ne
 * passent pas par ce bus — pas de boucle de rétroaction.
 */

export type SyncWriteListener = () => void;

const listeners = new Set<SyncWriteListener>();

/** À appeler après chaque écriture locale issue de l'UI. */
export function notifySyncWrite(): void {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Abonne un listener. Retourne la fonction de désabonnement
 * (à utiliser en cleanup d'effet React).
 */
export function onSyncWrite(listener: SyncWriteListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

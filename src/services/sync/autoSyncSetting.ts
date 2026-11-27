/**
 * Réglage « synchronisation automatique ».
 *
 * La synchro automatique (cycles déclenchés à l'ouverture de l'app, au
 * retour réseau, à la mise en avant ou après chaque écriture) est une
 * fonctionnalité Premium : elle n'est active que si l'utilisateur a un
 * abonnement premium actif ET que le réglage local est activé (activé par
 * défaut, aucune valeur stockée = true).
 *
 * Le pull-to-refresh manuel et le bouton « forcer la synchronisation » ne
 * passent pas par isAutoSyncActive() : ils restent des actions manuelles.
 */

import { getIsPremium } from '@/services/purchases/premiumStore';
import { AUTO_SYNC_ENABLED_KEY } from '@/utils/async-storage/key';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Valeur du réglage local (true par défaut si jamais enregistré). */
export async function getAutoSyncEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return raw === null ? true : raw === 'true';
}

/** Persiste le choix de l'utilisateur (bouton « synchronisation automatique »). */
export async function setAutoSyncEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(AUTO_SYNC_ENABLED_KEY, String(enabled));
}

/**
 * Toute synchronisation (automatique ou manuelle : pull-to-refresh,
 * « forcer la synchronisation ») est réservée à un utilisateur premium.
 */
export function isSyncAllowed(): boolean {
  return getIsPremium();
}

/** Résultat du gardien : autorise l'action de synchro ou exige le premium. */
export type SyncGateResult = 'allowed' | 'premium_required';

/**
 * Point d'entrée unique de la règle « synchro réservée au premium ».
 * Les composants/hooks appellent ça et ne décident que de la réaction
 * (paywall, toast, cadenas) — jamais de la règle elle-même.
 */
export function checkSyncGate(): SyncGateResult {
  return isSyncAllowed() ? 'allowed' : 'premium_required';
}

/**
 * La synchro automatique ne tourne en plus que si le réglage local est
 * activé. Un utilisateur non premium a toujours false, quelle que soit la
 * valeur stockée.
 */
export async function isAutoSyncActive(): Promise<boolean> {
  if (!isSyncAllowed()) return false;
  return getAutoSyncEnabled();
}

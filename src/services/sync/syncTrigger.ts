/**
 * Déclencheurs de synchronisation (architecture §3.4).
 *
 * Hook React à monter à la racine (composant `SyncTrigger`, placé dans
 * `_layout.tsx` après `DatabaseInitializer` — la base doit être prête) :
 *  - Ouverture de l'app (session existante) → cycle complet pull() + push() ;
 *  - Chaque écriture (repositories → stampForSync → writeBus) → push()
 *    debouncé (2 s), uniquement si en ligne ;
 *  - Retour du réseau (NetInfo) → cycle complet ;
 *  - Mise en avant de l'app (AppState → active) → cycle si > 5 min.
 *
 * Un verrou (mutex) dans syncEngine empêche deux opérations concurrentes.
 * Les écritures UI ne sont jamais bloquées (SQLite local d'abord, toujours).
 */

import { useAuth } from '@/components/supabase/SessionProvider';
import { onSyncWrite } from '@/db/sync/writeBus';
import {
  isSyncRunning,
  push,
  syncCycle,
  updateClockOffset,
} from '@/services/sync/syncEngine';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 2_000;
const STALE_THRESHOLD_MS = 5 * 60 * 1_000; // 5 minutes
const PUSH_RETRY_MS = 1_000; // retry si un cycle tourne au moment du push
const PUSH_RETRY_MAX = 10;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Déclenche automatiquement les cycles de sync.
 * Retourne `triggerPush` pour forcer un push debouncé manuellement.
 */
export function useSyncTrigger() {
  const { user } = useAuth();
  const userId = user?.id;

  const lastSyncRef = useRef<number>(0);
  const isOnlineRef = useRef<boolean>(true);
  const triggerPushRef = useRef<() => void>(() => {});

  const runCycle = useCallback(
    async (reason: string) => {
      if (!userId) return;

      console.log(`[sync] cycle triggered: ${reason}`);
      const result = await syncCycle({ userId });
      lastSyncRef.current = Date.now();

      if (result.errors.length > 0) {
        console.warn(`[sync] errors:`, result.errors);
      } else {
        await updateClockOffset(userId);
      }
    },
    [userId],
  );

  const runPush = useCallback(
    async (reason: string) => {
      if (!userId) return;

      console.log(`[sync] push triggered: ${reason}`);
      const result = await push({ userId });

      if (result.errors.length > 0) {
        console.warn(`[sync] push errors:`, result.errors);
      }
    },
    [userId],
  );

  // ─── 1. Ouverture de l'app + debounce push ──────────────────────────────────
  // Le timer de debounce vit dans la portée de l'effet : la cleanup ferme
  // dessus directement au lieu de lire un ref mutable, ce qui garantit que
  // le bon timer est annulé même si triggerPush a été appelé entre-temps.
  useEffect(() => {
    if (!userId) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    runCycle('app_open');

    const fire = (retriesLeft: number) => {
      // Un cycle est en cours → réessayer un peu plus tard plutôt que
      // d'abandonner (sinon l'écriture resterait en outbox jusqu'au
      // prochain déclencheur).
      if (isSyncRunning()) {
        if (retriesLeft > 0) {
          timer = setTimeout(() => fire(retriesLeft - 1), PUSH_RETRY_MS);
        }
        return;
      }

      // Push uniquement si en ligne (§3.4) ; hors ligne, l'outbox
      // conserve la ligne jusqu'au cycle de retour réseau.
      if (!isOnlineRef.current) return;

      runPush('write_debounce');
    };

    triggerPushRef.current = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fire(PUSH_RETRY_MAX);
      }, DEBOUNCE_MS);
    };

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [userId, runCycle, runPush]);

  const triggerPush = useCallback(() => triggerPushRef.current(), []);

  // ─── 2. Écriture locale (repositories → stampForSync → writeBus) ──────────
  useEffect(() => {
    if (!userId) return;
    return onSyncWrite(() => triggerPush());
  }, [userId, triggerPush]);

  // ─── 3. NetInfo : connectivité + cycle complet au retour du réseau ─────────
  useEffect(() => {
    if (!userId) return;

    // État initial — l'addEventListener ne notifie pas au montage.
    let cancelled = false;
    NetInfo.fetch().then((state) => {
      if (cancelled) return;
      isOnlineRef.current =
        state.isConnected === true && state.isInternetReachable !== false;
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online =
        state.isConnected === true && state.isInternetReachable !== false;
      const wasOnline = isOnlineRef.current;
      isOnlineRef.current = online;

      if (online && !wasOnline) {
        runCycle('network_restored');
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [userId, runCycle]);

  // ─── 4. Mise en avant de l'app (AppState → active) ────────────────────────
  useEffect(() => {
    if (!userId) return;

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState !== 'active') return;

        const elapsed = Date.now() - lastSyncRef.current;
        if (elapsed > STALE_THRESHOLD_MS) {
          runCycle('app_active_stale');
        }
      },
    );

    return () => subscription.remove();
  }, [userId, runCycle]);

  return { triggerPush };
}

// ─── Composant racine ─────────────────────────────────────────────────────────

/**
 * Monte les déclencheurs de sync à la racine de l'app.
 * À placer dans `_layout.tsx`, à l'intérieur d'`AuthProvider` (pour useAuth)
 * et de `DatabaseInitializer` (les écritures supposent la base prête).
 * Ne rend rien.
 */
export function SyncTrigger(): null {
  useSyncTrigger();
  return null;
}

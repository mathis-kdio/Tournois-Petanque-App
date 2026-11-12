/**
 * Déclencheurs de synchronisation.
 *
 * Hook React à monter à la racine (composant `SyncTrigger`, placé dans
 * `_layout.tsx` après `DatabaseInitializer` — la base doit être prête) :
 *  - Ouverture de l'app / login → adoption puis cycle complet
 *    pull() + push() ; au login sur un nouvel appareil ou un changement de
 *    compte, écran « Récupération de vos données… » pendant le premier pull ;
 *  - Chaque écriture (repositories → stampForSync → writeBus) → push()
 *    debouncé (2 s), uniquement si en ligne ;
 *  - Retour du réseau (NetInfo) → cycle complet ;
 *  - Mise en avant de l'app (AppState → active) → cycle si > 5 min ;
 *  - Pull-to-refresh manuel (écrans de liste, via SyncRefreshContext) →
 *    cycle complet, raison « manual_refresh » ; la garde hors ligne
 *    (NetInfo + toast) est faite côté UI dans SyncRefreshControl.
 *
 * Si l'appareil a des écritures hors ligne ET que le compte distant a déjà
 * des données, un dialogue propose « fusionner » ou « remplacer »;
 * les cycles sont suspendus jusqu'au choix.
 *
 * Un verrou (mutex) dans syncEngine empêche deux opérations concurrentes.
 * Les écritures UI ne sont jamais bloquées (SQLite local d'abord, toujours).
 */

import { useAuth } from '@/components/supabase/SessionProvider';
import { onSyncWrite } from '@/db/sync/writeBus';
import { AccountDeletedDialog } from '@/services/sync/components/AccountDeletedDialog';
import { AdoptionDialog } from '@/services/sync/components/AdoptionDialog';
import { RecoveringOverlay } from '@/services/sync/components/RecoveringOverlay';
import type { AdoptionPrompt } from '@/services/sync/components/types';
import {
  isSyncRunning,
  push,
  syncCycle,
  updateClockOffset,
} from '@/services/sync/syncEngine';
import {
  adoptMerge,
  adoptReplace,
  forceLogoutAndPurge,
  prepareLoginSync,
  type LoginSyncPlan,
} from '@/services/sync/syncAccount';
import NetInfo from '@react-native-community/netinfo';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 2_000;
const STALE_THRESHOLD_MS = 5 * 60 * 1_000; // 5 minutes
const PUSH_RETRY_MS = 1_000; // retry si un cycle tourne au moment du push
const PUSH_RETRY_MAX = 10;

// ─── Contexte pull-to-refresh ────────────────────────────────────────────────

export interface SyncRefreshContextValue {
  /** Lance un cycle complet (pull + push) à la demande de l'utilisateur. */
  refresh: () => Promise<void>;
  /** Un cycle de synchro est en cours (automatique ou manuel). */
  isSyncing: boolean;
}

const SyncRefreshContext = createContext<SyncRefreshContextValue | null>(null);

/**
 * Accès au pull-to-refresh manuel depuis les écrans de liste.
 * Hors provider (tests), retourne des no-op.
 */
export function useSyncRefresh(): SyncRefreshContextValue {
  return (
    use(SyncRefreshContext) ?? {
      refresh: async () => {},
      isSyncing: false,
    }
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Déclenche automatiquement les cycles de sync et pilote l'adoption au login.
 * Retourne `triggerPush` pour forcer un push debouncé manuellement, l'état
 * d'adoption (dialogue de choix) et l'état « récupération des données ».
 */
export function useSyncTrigger() {
  const { user } = useAuth();
  const userId = user?.id;

  const lastSyncRef = useRef<number>(0);
  const isOnlineRef = useRef<boolean>(true);
  const triggerPushRef = useRef<() => void>(() => {});
  const adoptionPromptRef = useRef<AdoptionPrompt | null>(null);

  const [adoptionPrompt, setAdoptionPrompt] = useState<AdoptionPrompt | null>(
    null,
  );
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveredCount, setRecoveredCount] = useState(0);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // eslint-disable-next-line react-doctor/react-compiler-no-manual-memoization
  const runCycle = useCallback(
    async (reason: string) => {
      if (!userId) return;
      // Adoption en attente de choix → suspendre les cycles automatiques
      // (le choix de l'utilisateur déclenchera la synchro adaptée).
      if (adoptionPromptRef.current) return;

      console.log(`[sync] cycle triggered: ${reason}`);
      setIsSyncing(true);
      setRecoveredCount(0);
      await syncCycle({
        userId,
        onProgress: (n) => setRecoveredCount(n),
      })
        .then(async (result) => {
          if (result.accountDeleted) {
            // Le compte a été supprimé depuis un autre appareil : les données
            // locales ne pourront jamais être synchronisées. Purge forcée et
            // dialogue explicatif (une seule fois).
            setAccountDeleted(true);
            try {
              await forceLogoutAndPurge(userId);
            } catch (err) {
              console.warn(
                '[sync] purge après suppression distante du compte:',
                err,
              );
            }
            return;
          }

          if (result.errors.length > 0) {
            // Cycle partiel : on ne marque pas le sync comme à jour, pour que le
            // prochain AppState → active (ou retour réseau) relance un cycle
            // complet au lieu d'attendre le seuil de 5 min.
            console.warn(`[sync] errors:`, result.errors);
          } else {
            lastSyncRef.current = Date.now();
            await updateClockOffset(userId);
          }
        })
        .finally(() => setIsSyncing(false));
    },
    [userId],
  );

  // eslint-disable-next-line react-doctor/react-compiler-no-manual-memoization
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

  // ─── 1. Ouverture de l'app / login : adoption puis cycle ────────────────────
  // Le timer de debounce vit dans la portée de l'effet : la cleanup ferme
  // dessus directement au lieu de lire un ref mutable, ce qui garantit que
  // le bon timer est annulé même si triggerPush a été appelé entre-temps.
  useEffect(() => {
    if (!userId) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    (async () => {
      let plan: LoginSyncPlan | null = null;
      try {
        // Adoption AVANT tout cycle : purge des lignes syncées du compte
        // précédent, éventuel choix « fusionner / remplacer ».
        plan = await prepareLoginSync(userId);
      } catch (err) {
        console.warn('[sync] sync de login échouée:', err);
      }

      if (cancelled) return;
      if (plan === null) {
        setIsRecovering(false);
        return;
      }

      if (plan.needsChoice) {
        const prompt = { userId, plan };
        adoptionPromptRef.current = prompt;
        setAdoptionPrompt(prompt);
      } else {
        // Login sur un nouvel appareil / changement de compte avec données
        // distantes → premier pull potentiellement long : écran dédié.
        if (plan.isNewLogin && plan.remoteHasData) {
          setIsRecovering(true);
        }

        try {
          await runCycle('app_open');
        } catch (err) {
          console.warn('[sync] sync de login échouée:', err);
        }
      }
      if (!cancelled) setIsRecovering(false);
    })();

    triggerPushRef.current = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        firePush(PUSH_RETRY_MAX);
      }, DEBOUNCE_MS);
    };

    const firePush = (retriesLeft: number) => {
      // Adoption en attente de choix (« fusionner » / « remplacer ») :
      // ne rien pousser tant que la décision n'est pas prise — sinon des
      // données locales seraient envoyées au nouveau compte avant que
      // l'utilisateur ait choisi « remplacer ».
      if (adoptionPromptRef.current) return;

      // Un cycle est en cours → réessayer un peu plus tard plutôt que
      // d'abandonner (sinon l'écriture resterait en outbox jusqu'au
      // prochain déclencheur).
      if (isSyncRunning()) {
        if (retriesLeft > 0) {
          timer = setTimeout(() => firePush(retriesLeft - 1), PUSH_RETRY_MS);
        }
        return;
      }

      // Push uniquement si en ligne; hors ligne, l'outbox
      // conserve la ligne jusqu'au cycle de retour réseau.
      if (!isOnlineRef.current) return;

      runPush('write_debounce');
    };

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [userId, runCycle, runPush]);

  // eslint-disable-next-line react-doctor/react-compiler-no-manual-memoization
  const triggerPush = useCallback(() => triggerPushRef.current(), []);

  /** Applique le choix d'adoption et relance la synchro. */
  const confirmAdoption = async (choice: 'merge' | 'replace') => {
    const prompt = adoptionPromptRef.current;
    if (!prompt) return;

    adoptionPromptRef.current = null;
    setAdoptionPrompt(null);
    setIsRecovering(true);

    try {
      if (choice === 'merge') {
        await adoptMerge(prompt.userId);
      } else {
        await adoptReplace(prompt.userId);
      }
    } catch (err) {
      console.warn('[sync] adoption échouée:', err);
    }
    setIsRecovering(false);
  };

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

  /** Pull-to-refresh manuel : cycle complet à la demande d'un écran de liste. */
  const refresh = () => runCycle('manual_refresh');

  return {
    triggerPush,
    refresh,
    isSyncing,
    adoptionPrompt,
    confirmAdoption,
    isRecovering,
    recoveredCount,
    accountDeleted,
  };
}

// ─── Composant racine ─────────────────────────────────────────────────────────

/**
 * Monte les déclencheurs de sync à la racine de l'app.
 * À placer dans `_layout.tsx`, à l'intérieur d'`AuthProvider` (pour useAuth)
 * et de `DatabaseInitializer` (les écritures supposent la base prête).
 * Englobe les écrans (`children`) dans le `SyncRefreshContext.Provider`
 * pour leur exposer le pull-to-refresh manuel (raison « manual_refresh »).
 *
 * Rend les composants d'UI extraits dans `./components/` (RecoveringOverlay,
 * AccountDeletedDialog, AdoptionDialog), plus les écrans (`children`) dans
 * le `SyncRefreshContext.Provider` pour le pull-to-refresh manuel.
 */
export function SyncTrigger({ children }: { children?: ReactNode }) {
  const {
    refresh,
    isSyncing,
    adoptionPrompt,
    confirmAdoption,
    isRecovering,
    recoveredCount,
    accountDeleted,
  } = useSyncTrigger();

  return (
    // value inline volontaire : SyncTrigger ne re-render que sur ses propres
    // setState de synchro (isSyncing, adoption…), impact négligeable ; un
    // useMemo serait de toute façon mémoïsé par React Compiler (faux positif).
    // eslint-disable-next-line react-doctor/jsx-no-constructed-context-values
    <SyncRefreshContext.Provider value={{ refresh, isSyncing }}>
      <RecoveringOverlay
        isRecovering={isRecovering}
        recoveredCount={recoveredCount}
      />
      <AccountDeletedDialog isOpen={accountDeleted} />
      <AdoptionDialog prompt={adoptionPrompt} onConfirm={confirmAdoption} />
      {children}
    </SyncRefreshContext.Provider>
  );
}

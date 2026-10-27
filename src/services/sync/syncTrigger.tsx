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
 *  - Mise en avant de l'app (AppState → active) → cycle si > 5 min.
 *
 * Si l'appareil a des écritures hors ligne ET que le compte distant a déjà
 * des données, un dialogue propose « fusionner » ou « remplacer »;
 * les cycles sont suspendus jusqu'au choix.
 *
 * Un verrou (mutex) dans syncEngine empêche deux opérations concurrentes.
 * Les écritures UI ne sont jamais bloquées (SQLite local d'abord, toujours).
 */

import { useAuth } from '@/components/supabase/SessionProvider';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { onSyncWrite } from '@/db/sync/writeBus';
import {
  isSyncRunning,
  push,
  syncCycle,
  updateClockOffset,
} from '@/services/sync/syncEngine';
import {
  adoptMerge,
  adoptReplace,
  prepareLoginSync,
  type LoginSyncPlan,
} from '@/services/sync/syncAccount';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus } from 'react-native';

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 2_000;
const STALE_THRESHOLD_MS = 5 * 60 * 1_000; // 5 minutes
const PUSH_RETRY_MS = 1_000; // retry si un cycle tourne au moment du push
const PUSH_RETRY_MAX = 10;

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdoptionPrompt {
  userId: string;
  plan: LoginSyncPlan;
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
  const triggerPushRef = useRef<() => void>(() => { });
  const adoptionPromptRef = useRef<AdoptionPrompt | null>(null);

  const [adoptionPrompt, setAdoptionPrompt] = useState<AdoptionPrompt | null>(
    null,
  );
  const [isRecovering, setIsRecovering] = useState(false);

  const runCycle = useCallback(
    async (reason: string) => {
      if (!userId) return;
      // Adoption en attente de choix → suspendre les cycles automatiques
      // (le choix de l'utilisateur déclenchera la synchro adaptée).
      if (adoptionPromptRef.current) return;

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

  const triggerPush = useCallback(() => triggerPushRef.current(), []);

  /** Applique le choix d'adoption et relance la synchro. */
  const confirmAdoption = useCallback(async (choice: 'merge' | 'replace') => {
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
  }, []);

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

  return { triggerPush, adoptionPrompt, confirmAdoption, isRecovering };
}

// ─── Composant racine ─────────────────────────────────────────────────────────

/**
 * Monte les déclencheurs de sync à la racine de l'app.
 * À placer dans `_layout.tsx`, à l'intérieur d'`AuthProvider` (pour useAuth)
 * et de `DatabaseInitializer` (les écritures supposent la base prête).
 *
 * Rend :
 *  - l'écran « Récupération de vos données… » pendant le premier pull
 *    d'un login;
 *  - le dialogue d'adoption « fusionner / remplacer ».
 */
export function SyncTrigger() {
  const { t } = useTranslation();
  const { adoptionPrompt, confirmAdoption, isRecovering } = useSyncTrigger();

  return (
    <>
      {isRecovering && (
        <Center
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999,
          }}
        >
          <VStack space="md" style={{ paddingHorizontal: 32 }}>
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white text-center">
              {t('recuperation_donnees')}
            </Text>
          </VStack>
        </Center>
      )}

      <AlertDialog
        isOpen={adoptionPrompt !== null}
        onClose={() => {
          // Le choix est obligatoire : la synchro est suspendue jusqu'à lui.
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text-modal">
              {t('adoption_titre')}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t('adoption_texte')}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <VStack space="sm" style={{ width: '100%' }}>
              <Button onPress={() => confirmAdoption('merge')}>
                <ButtonText>{t('adoption_fusionner')}</ButtonText>
              </Button>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => confirmAdoption('replace')}
              >
                <ButtonText className="color-custom-text-modal">
                  {t('adoption_remplacer')}
                </ButtonText>
              </Button>
            </VStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

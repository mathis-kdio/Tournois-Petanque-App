import { useAuth } from '@/components/supabase/SessionProvider';
import { syncCycle } from '@/services/sync/syncEngine';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

/**
 * Synchronisation forcée manuelle (bouton « forcer la synchro » et
 * « réessayer » du dialogue de logout bloqué) : un cycle complet, puis une
 * alerte succès/échec. Retourne les erreurs du cycle (vide = succès).
 */
export function useForceSync() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return async (): Promise<string[]> => {
    if (!user) return [];
    try {
      const result = await syncCycle({ userId: user.id });
      if (result.errors.length === 0) {
        Alert.alert(t('sync_reussie'));
      } else {
        Alert.alert(t('sync_echouee', { erreur: result.errors.join('\n') }));
      }
      return result.errors;
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
      return [err instanceof Error ? err.message : String(err)];
    }
  };
}

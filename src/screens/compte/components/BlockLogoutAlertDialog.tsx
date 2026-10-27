import { useAuth } from '@/components/supabase/SessionProvider';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { checkLogout, logoutAndPurge } from '@/services/sync/syncAccount';
import { syncCycle } from '@/services/sync/syncEngine';
import { useRouter } from 'node_modules/expo-router/build';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

export interface Props {
  logoutBlockedOpen: boolean;
  setLogoutBlockedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlockLogoutAlertDialog: React.FC<Props> = ({
  logoutBlockedOpen,
  setLogoutBlockedOpen,
  setActionLoading,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const deconnexionForcer = async () => {
    if (!user) return;
    setLogoutBlockedOpen(false);
    setActionLoading(true);
    try {
      await logoutAndPurge(user.id);
      router.navigate('.');
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
    }
    setActionLoading(false);
  };

  const reessayerSync = async () => {
    if (!user) return;
    setLogoutBlockedOpen(false);
    setActionLoading(true);
    let syncErrors: string[];
    let canLogout: boolean;
    try {
      // Synchro forcée, même hors ligne.
      const result = await syncCycle({ userId: user.id });
      const check = await checkLogout();
      syncErrors = result.errors;
      canLogout = check.canLogout;
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
      setActionLoading(false);
      return;
    }

    if (syncErrors.length === 0 && canLogout) {
      try {
        await logoutAndPurge(user.id);
        router.navigate('.');
      } catch (err) {
        Alert.alert(
          t('erreur_inattendue', {
            erreur: err instanceof Error ? err.message : String(err),
          }),
        );
      }
    } else {
      Alert.alert(t('sync_echouee', { erreur: syncErrors.join('\n') }));
    }
    setActionLoading(false);
  };

  return (
    <AlertDialog
      isOpen={logoutBlockedOpen}
      onClose={() => setLogoutBlockedOpen(false)}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('logout_non_sync_titre')}
          </Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400" />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>{t('logout_non_sync_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <VStack space="sm" style={{ width: '100%' }}>
            <Button onPress={reessayerSync}>
              <ButtonText>{t('logout_reessayer_sync')}</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="negative"
              onPress={deconnexionForcer}
            >
              <ButtonText className="color-custom-text-modal">
                {t('logout_forcer')}
              </ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setLogoutBlockedOpen(false)}
            >
              <ButtonText className="color-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockLogoutAlertDialog;

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
import { deleteAccountAndPurge } from '@/services/sync/syncAccount';
import { useRouter } from 'node_modules/expo-router/build';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

export interface Props {
  deleteAccountOpen: boolean;
  setDeleteAccountOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountAlertDialog: React.FC<Props> = ({
  deleteAccountOpen,
  setDeleteAccountOpen,
  setActionLoading,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const supprimerCompte = async () => {
    if (!user) return;
    setDeleteAccountOpen(false);
    setActionLoading(true);
    try {
      await deleteAccountAndPurge(user.id);
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

  return (
    <AlertDialog
      isOpen={deleteAccountOpen}
      onClose={() => setDeleteAccountOpen(false)}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('supprimer_compte_modal_titre')}
          </Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400" />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>{t('supprimer_compte_modal_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => setDeleteAccountOpen(false)}
          >
            <ButtonText className="color-custom-text-modal">
              {t('annuler')}
            </ButtonText>
          </Button>
          <Button action="negative" onPress={supprimerCompte}>
            <ButtonText>{t('supprimer_compte')}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountAlertDialog;

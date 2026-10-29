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
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { deleteAccountAndPurge } from '@/services/sync/syncAccount';
import { syncCycle } from '@/services/sync/syncEngine';
import { supabaseClient } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

  const [password, setPassword] = useState('');
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [stepUpLoading, setStepUpLoading] = useState(false);

  const close = () => {
    setDeleteAccountOpen(false);
    setPassword('');
    setPasswordIncorrect(false);
  };

  const supprimerCompte = async () => {
    if (!user?.email) return;
    setPasswordIncorrect(false);
    setStepUpLoading(true);
    try {
      // Step-up AAL2 : la RPC delete_own_account exige un JWT récent de
      // niveau aal2 — on re-valide le mot de passe (signInWithPassword
      // renouvelle la session à AAL2) avant tout appel.
      const { error: reauthError } =
        await supabaseClient.auth.signInWithPassword({
          email: user.email,
          password,
        });
      if (reauthError) {
        setPasswordIncorrect(true);
        setStepUpLoading(false);
        return;
      }

      close();
      setActionLoading(true);
      try {
        // La suppression vérifie l'outbox : on tente d'abord une synchro
        // forcée pour vider l'outbox, et l'erreur « non synchronisée(s) »
        // reste un blocage explicite plutôt qu'une perte silencieuse.
        await syncCycle({ userId: user.id });
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
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
      setStepUpLoading(false);
    }
  };

  return (
    <AlertDialog isOpen={deleteAccountOpen} onClose={close}>
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
          <VStack space="md">
            <Text>{t('supprimer_compte_modal_texte')}</Text>
            <FormControl isInvalid={passwordIncorrect} isRequired={true}>
              <Input className="border-custom-bg-inverse">
                <InputField
                  className="text-typography-white placeholder:text-typography-white"
                  placeholder={t('mot_de_passe')}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  value={password}
                  onChangeText={setPassword}
                />
              </Input>
              {passwordIncorrect && (
                <FormControlError>
                  <FormControlErrorText>
                    {t('identifiants_invalides')}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <Text className="text-xs text-typography-500">
              {t('supprimer_compte_reauth_texte')}
            </Text>
          </VStack>
        </AlertDialogBody>
        <AlertDialogFooter>
          <VStack space="sm" style={{ width: '100%' }}>
            <Button
              action="negative"
              onPress={supprimerCompte}
              isDisabled={stepUpLoading || password.length === 0}
            >
              <ButtonText>{t('supprimer_compte')}</ButtonText>
            </Button>
            <Button variant="outline" action="secondary" onPress={close}>
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

export default DeleteAccountAlertDialog;

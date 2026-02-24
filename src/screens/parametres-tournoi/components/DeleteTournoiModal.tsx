import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useDeleteTournoi } from '@/repositories/tournois/useDeleteTournoi';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

export interface Props {
  tournoiId: number;
  modalDeleteIsOpen: boolean;
  setModalDeleteIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteTournoiModal: React.FC<Props> = ({
  tournoiId,
  modalDeleteIsOpen,
  setModalDeleteIsOpen,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { deleteTournoi } = useDeleteTournoi();

  const supprimerTournoi = (tournoiId: number) => {
    setModalDeleteIsOpen(false);
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'index' }],
      }),
    );

    setTimeout(async () => {
      await deleteTournoi(tournoiId);
    }, 1000);
  };

  return (
    <AlertDialog
      isOpen={modalDeleteIsOpen}
      onClose={() => setModalDeleteIsOpen(false)}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('supprimer_tournoi_actuel_modal_titre')}
          </Heading>
          <AlertDialogCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>
            {t('supprimer_tournoi_actuel_modal_texte', { id: tournoiId })}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setModalDeleteIsOpen(false)}
            >
              <ButtonText className="color-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button
              action="negative"
              onPress={() => supprimerTournoi(tournoiId)}
            >
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTournoiModal;

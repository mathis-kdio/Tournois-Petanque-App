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
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalDeleteIsOpen: boolean;
  setModalDeleteIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tournoiId: number;
}

const ModalDeleteTournoi: React.FC<Props> = ({
  modalDeleteIsOpen,
  setModalDeleteIsOpen,
  tournoiId,
}) => {
  const { t } = useTranslation();

  const { deleteTournoi } = useDeleteTournoi();

  const supprimerTournoi = async (tournoiId: number) => {
    await deleteTournoi(tournoiId);
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
            {t('supprimer_tournoi_modal_titre')}
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
            {t('supprimer_tournoi_modal_texte', { id: tournoiId + 1 })}
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

export default ModalDeleteTournoi;

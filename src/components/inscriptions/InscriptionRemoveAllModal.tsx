import { Heading } from '@/components/ui/heading';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
} from '@/components/ui/alert-dialog';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalRemoveIsOpen: boolean;
  setModalRemoveIsOpen: Dispatch<SetStateAction<boolean>>;
  onDeleteAllJoueurs: () => void;
}

const InscriptionRemoveAllModal: React.FC<Props> = ({
  modalRemoveIsOpen,
  setModalRemoveIsOpen,
  onDeleteAllJoueurs,
}) => {
  const { t } = useTranslation();

  const _removeAllPlayers = () => {
    onDeleteAllJoueurs();
    setModalRemoveIsOpen(false);
  };

  return (
    <AlertDialog
      isOpen={modalRemoveIsOpen}
      onClose={() => setModalRemoveIsOpen(false)}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('supprimer_joueurs_modal_titre')}
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
          <Text>{t('supprimer_joueurs_modal_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setModalRemoveIsOpen(false)}
            >
              <ButtonText className="color-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button action="negative" onPress={() => _removeAllPlayers()}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InscriptionRemoveAllModal;

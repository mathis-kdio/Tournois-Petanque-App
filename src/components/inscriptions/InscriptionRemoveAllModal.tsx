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
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalRemoveIsOpen: boolean;
  setModalRemoveIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteAllJoueurs: () => Promise<void>;
}

const InscriptionRemoveAllModal: React.FC<Props> = ({
  modalRemoveIsOpen,
  setModalRemoveIsOpen,
  onDeleteAllJoueurs,
}) => {
  const { t } = useTranslation();

  const removeAllPlayers = async () => {
    await onDeleteAllJoueurs();
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
          <Heading className="text-custom-text-modal">
            {t('supprimer_joueurs_modal_titre')}
          </Heading>
          <AlertDialogCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-gray-600 group-[:hover]/modal-close-button:stroke-gray-300 group-active/modal-close-button:stroke-gray-100 group-focus-visible/modal-close-button:stroke-gray-100"
            />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-custom-text-modal">
            {t('supprimer_joueurs_modal_texte')}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button
              variant="outline"
              onPress={() => setModalRemoveIsOpen(false)}
            >
              <ButtonText className="text-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button variant="destructive" onPress={removeAllPlayers}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InscriptionRemoveAllModal;

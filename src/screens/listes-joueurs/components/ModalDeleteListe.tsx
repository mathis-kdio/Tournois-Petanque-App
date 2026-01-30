import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  listId: number;
  modalDeleteIsOpen: boolean;
  setModalDeleteIsOpen: (value: React.SetStateAction<boolean>) => void;
  onDelete: (id: number) => void;
}

const ModalDeleteListe: React.FC<Props> = ({
  listId,
  modalDeleteIsOpen,
  setModalDeleteIsOpen,
  onDelete,
}) => {
  const { t } = useTranslation();

  const _removeList = (listId: number) => {
    onDelete(listId);
    setModalDeleteIsOpen(false);
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
            {t('supprimer_liste_modal_titre')}
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
          <Text>{t('supprimer_liste_modal_texte', { id: listId + 1 })}</Text>
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
            <Button action="negative" onPress={() => _removeList(listId)}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDeleteListe;

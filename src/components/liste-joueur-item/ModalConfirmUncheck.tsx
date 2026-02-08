import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalConfirmUncheckIsOpen: boolean;
  setModalConfirmUncheckIsOpen: (value: React.SetStateAction<boolean>) => void;
  onCancel: (isChecked: boolean) => void;
}

const ModalConfirmUncheck: React.FC<Props> = ({
  modalConfirmUncheckIsOpen,
  setModalConfirmUncheckIsOpen,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog
      isOpen={modalConfirmUncheckIsOpen}
      onClose={() => setModalConfirmUncheckIsOpen(false)}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('confirmer_uncheck_modal_titre')}
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
          <Text>{t('confirmer_uncheck_modal_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setModalConfirmUncheckIsOpen(false)}
            >
              <ButtonText className="color-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button action="negative" onPress={() => onCancel(false)}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalConfirmUncheck;

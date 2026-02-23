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
import { useJoueursSuggestion } from '@/repositories/joueursSuggestion/useJoueursSuggestion';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  id: number;
  modalRemoveIsOpen: boolean;
  setModalRemoveIsOpen: (value: React.SetStateAction<boolean>) => void;
}

const RemoveSuggereAlertDialog: React.FC<Props> = ({
  id,
  modalRemoveIsOpen,
  setModalRemoveIsOpen,
}) => {
  const { t } = useTranslation();

  const { cacherSuggestion } = useJoueursSuggestion();

  const removeSuggere = async () => {
    await cacherSuggestion(id);
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
            {t('supprimer_joueur_suggestions_modal_titre')}
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
          <Text>{t('supprimer_joueur_suggestions_modal_texte')}</Text>
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
            <Button action="negative" onPress={removeSuggere}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveSuggereAlertDialog;

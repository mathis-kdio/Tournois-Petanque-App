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
  joueurId: number;
  modalRemoveIsOpen: boolean;
  setModalRemoveIsOpen: (value: React.SetStateAction<boolean>) => void;
  supprimerJoueurSuggere: (joueurId: number) => void;
}

const RemoveSuggereAlertDialog: React.FC<Props> = ({
  joueurId,
  modalRemoveIsOpen,
  setModalRemoveIsOpen,
  supprimerJoueurSuggere,
}) => {
  const { t } = useTranslation();

  const removeSuggere = () => {
    //TODO Créer une table pour enrigistrer occurence des joueurs suggérés. La table doit être alimenté à chaque ajout de joueur
    supprimerJoueurSuggere(joueurId);
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

import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCloseButton,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export interface Props {
  alertOpen: boolean;
  setAlertOpen: (value: React.SetStateAction<boolean>) => void;
}

const ClearDataAlertDialog: React.FC<Props> = ({ alertOpen, setAlertOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clearData = () => {
    setAlertOpen(false);
    const actionRemoveAllPlayersAvecNoms = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['avecNoms'],
    };
    dispatch(actionRemoveAllPlayersAvecNoms);
    const actionRemoveAllPlayersSansNoms = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['sansNoms'],
    };
    dispatch(actionRemoveAllPlayersSansNoms);
    const actionRemoveAllPlayersAvecEquipes = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['avecEquipes'],
    };
    dispatch(actionRemoveAllPlayersAvecEquipes);
    const actionRemoveAllPlayersHistorique = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['historique'],
    };
    dispatch(actionRemoveAllPlayersHistorique);
    const actionRemoveAllPlayersSauvegarde = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['sauvegarde'],
    };
    dispatch(actionRemoveAllPlayersSauvegarde);
    const actionRemoveAllSavedList = { type: 'REMOVE_ALL_SAVED_LIST' };
    dispatch(actionRemoveAllSavedList);
    const actionRemoveAllTournaments = { type: 'SUPPR_ALL_TOURNOIS' };
    dispatch(actionRemoveAllTournaments);
    const actionRemoveAllMatchs = { type: 'REMOVE_ALL_MATCHS' };
    dispatch(actionRemoveAllMatchs);
    const actionRemoveAllTerrains = { type: 'REMOVE_ALL_TERRAINS' };
    dispatch(actionRemoveAllTerrains);
    const actionRemoveAllOptions = { type: 'SUPPR_ALL_OPTIONS' };
    dispatch(actionRemoveAllOptions);
  };

  return (
    <AlertDialog isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('supprimer_donnees_modal_titre')}
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
          <Text>{t('supprimer_donnees_modal_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setAlertOpen(false)}
            >
              <ButtonText className="color-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button action="negative" onPress={() => clearData()}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearDataAlertDialog;

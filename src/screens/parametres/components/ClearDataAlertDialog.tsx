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
import { useTranslation } from 'react-i18next';
import { clearData } from '../hooks/clear-data-actions';

export interface Props {
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClearDataAlertDialog: React.FC<Props> = ({ alertOpen, setAlertOpen }) => {
  const { t } = useTranslation();

  const handleClearData = async () => {
    setAlertOpen(false);
    await clearData();
  };

  return (
    <AlertDialog isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="text-custom-text-modal">
            {t('supprimer_donnees_modal_titre')}
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
            {t('supprimer_donnees_modal_texte')}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup flexDirection="row">
            <Button variant="outline" onPress={() => setAlertOpen(false)}>
              <ButtonText className="text-custom-text-modal">
                {t('annuler')}
              </ButtonText>
            </Button>
            <Button variant="destructive" onPress={handleClearData}>
              <ButtonText>{t('oui')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearDataAlertDialog;

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
}

export function AccountDeletedDialog({ isOpen }: Props) {
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={isOpen} onClose={() => {}}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('compte_supprime_ailleurs_titre')}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>{t('compte_supprime_ailleurs_texte')}</Text>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
}

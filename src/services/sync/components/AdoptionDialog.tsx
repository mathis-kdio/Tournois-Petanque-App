import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { AdoptionPrompt } from '@/services/sync/components/types';
import { useTranslation } from 'react-i18next';

interface Props {
  prompt: AdoptionPrompt | null;
  onConfirm: (choice: 'merge' | 'replace') => void;
}

export function AdoptionDialog({ prompt, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      isOpen={prompt !== null}
      onClose={() => {
        // Le choix est obligatoire : la synchro est suspendue jusqu'à lui.
      }}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="color-custom-text-modal">
            {t('adoption_titre')}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>{t('adoption_texte')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <VStack space="sm" className="w-full">
            <Button onPress={() => onConfirm('merge')}>
              <ButtonText>{t('adoption_fusionner')}</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => onConfirm('replace')}
            >
              <ButtonText className="color-custom-text-modal">
                {t('adoption_remplacer')}
              </ButtonText>
            </Button>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

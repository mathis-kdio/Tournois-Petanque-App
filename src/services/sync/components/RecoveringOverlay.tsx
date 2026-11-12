import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

const PROGRESS_DISPLAY_THRESHOLD = 50;

interface Props {
  isRecovering: boolean;
  recoveredCount: number;
}

export function RecoveringOverlay({ isRecovering, recoveredCount }: Props) {
  const { t } = useTranslation();

  if (!isRecovering) return null;

  return (
    <Center className="absolute inset-0 z-[999] bg-black/70">
      <VStack space="md" className="px-8">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-center">
          {recoveredCount > PROGRESS_DISPLAY_THRESHOLD
            ? t('recuperation_donnees_progression', {
                count: recoveredCount,
              })
            : t('recuperation_donnees')}
        </Text>
      </VStack>
    </Center>
  );
}

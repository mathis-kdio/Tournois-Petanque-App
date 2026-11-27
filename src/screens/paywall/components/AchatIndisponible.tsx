import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';

const AchatIndisponible = () => {
  const { t } = useTranslation();

  return (
    <VStack className="flex-1 justify-center items-center px-10 bg-custom-background">
      <Text className="text-typography-white text-lg text-center">
        {t('achat_indisponible')}
      </Text>
    </VStack>
  );
};

export default AchatIndisponible;

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';

const Avantages = () => {
  const { t } = useTranslation();

  const avantages = [
    t('premium_sans_pub'),
    t('premium_sync_multi'),
    t('premium_nouvelles_fonctions'),
    t('premium_soutien'),
  ];

  return (
    <VStack space="sm">
      {avantages.map((a) => (
        <Text key={a} className="text-typography-white">
          {'• '}
          {a}
        </Text>
      ))}
    </VStack>
  );
};

export default Avantages;

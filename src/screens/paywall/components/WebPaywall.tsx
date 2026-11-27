import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AchatIndisponible from './AchatIndisponible';
import Avantages from '@/components/abonnement/Avantages';

const WebPaywall = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const paywallUrl = process.env.EXPO_PUBLIC_REVENUECAT_WEB_PAYWALL_URL;

  if (!paywallUrl) {
    return <AchatIndisponible />;
  }

  const ouvrirPaywallWeb = () => {
    window.location.assign(paywallUrl);
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <VStack className="flex-1 px-10 justify-between py-10">
        <VStack space="lg">
          <Text className="text-typography-white text-2xl text-center font-bold">
            {t('passer_premium')}
          </Text>
          <Text className="text-typography-white text-md text-center">
            {t('paywall_web_note')}
          </Text>
          <Text className="text-typography-white text-md font-bold mt-4">
            {t('avantages_premium')}
          </Text>
          <Avantages />
        </VStack>
        <VStack space="xl" className="mt-8">
          <Button action="primary" onPress={ouvrirPaywallWeb}>
            <ButtonText>{t('voir_offres_payer')}</ButtonText>
          </Button>
          <Button onPress={() => router.back()}>
            <ButtonText>{t('annuler')}</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default WebPaywall;

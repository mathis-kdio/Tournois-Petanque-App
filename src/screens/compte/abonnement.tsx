import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { LoaderIcon, StarIcon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { usePremium } from '@/services/purchases/premiumStore';
import { restorePurchases } from '@/services/purchases/revenuecat';
import { useRouter } from 'expo-router';
import { Alert, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const openStoreSubscriptions = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('https://apps.apple.com/account/subscriptions');
  } else if (Platform.OS === 'android') {
    Linking.openURL('https://play.google.com/store/account/subscriptions');
  }
};

const Abonnement = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPremium, isLoading, refresh } = usePremium();

  const restaurer = async () => {
    try {
      await restorePurchases();
      await refresh();
    } catch (e) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: e instanceof Error ? e.message : String(e),
        }),
      );
    }
  };

  const avantages = [
    t('premium_sans_pub'),
    t('premium_sync_multi'),
    t('premium_nouvelles_fonctions'),
    t('premium_soutien'),
  ];

  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('abonnement_titre')} />
      <VStack className="flex-1 px-10 justify-between" space="xl">
        <Text className="text-typography-white text-md text-center">
          {isLoading
            ? '…'
            : isPremium
              ? t('abonnement_premium_actif')
              : t('aucun_abonnement')}
        </Text>
        <Button onPress={restaurer}>
          <ButtonIcon as={LoaderIcon} />
          <ButtonText className="ml-2">{t('restaurer_achats')}</ButtonText>
        </Button>
        <Divider />
        <Text className="text-typography-white text-md font-bold">
          {t('avantages_premium')}
        </Text>
        <VStack space="sm">
          {avantages.map((a) => (
            <Text key={a} className="text-typography-white">
              {'• '}
              {a}
            </Text>
          ))}
        </VStack>
        {isPremium ? (
          <Button onPress={openStoreSubscriptions}>
            <ButtonIcon as={StarIcon} />
            <ButtonText className="ml-2">{t('gerer_abonnement')}</ButtonText>
          </Button>
        ) : (
          <Button action="primary" onPress={() => router.push('/paywall')}>
            <ButtonIcon as={StarIcon} />
            <ButtonText className="ml-2">{t('passer_premium')}</ButtonText>
          </Button>
        )}
      </VStack>
    </ScrollView>
  );
};

export default Abonnement;

import { VStack } from '@/components/ui/vstack';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  AdsConsent,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';

const AdMobInscriptionsBanner = () => {
  const [nonPersonalizedAdsOnly, setNonPersonalizedAdsOnly] = useState(false);

  useEffect(() => {
    fetchConsent();
  }, []);

  const fetchConsent = async () => {
    const { createAPersonalisedAdsProfile, selectPersonalisedAds } =
      await AdsConsent.getUserChoices();

    if (
      selectPersonalisedAds === false ||
      createAPersonalisedAdsProfile === false
    ) {
      setNonPersonalizedAdsOnly(true);
    }
  };

  let size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER;

  let unitId = undefined;
  if (__DEV__) {
    unitId = TestIds.BANNER;
  } else if (Platform.OS === 'android') {
    unitId = 'ca-app-pub-4863676282747598/3937725790';
  } else if (Platform.OS === 'ios') {
    unitId = 'ca-app-pub-4863676282747598/3784972118';
  } else {
    console.log('Plateforme non prise en charge pour admob banner');
  }
  if (!unitId) return;
  return (
    <VStack className="items-center">
      <BannerAd
        unitId={unitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: nonPersonalizedAdsOnly,
        }}
      />
    </VStack>
  );
};

export default AdMobInscriptionsBanner;

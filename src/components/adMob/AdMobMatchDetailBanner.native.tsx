import { VStack } from '@/components/ui/vstack';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  AdsConsent,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';

const AdMobMatchDetailBanner = () => {
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

  let size = BannerAdSize.MEDIUM_RECTANGLE;

  let unitId = undefined;
  if (__DEV__) {
    unitId = TestIds.BANNER;
  } else if (Platform.OS === 'android') {
    unitId = 'ca-app-pub-4863676282747598/2664443353';
  } else if (Platform.OS === 'ios') {
    unitId = 'ca-app-pub-4863676282747598/4853329289';
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

export default AdMobMatchDetailBanner;

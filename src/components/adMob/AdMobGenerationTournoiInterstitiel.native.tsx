import {
  InterstitialAd,
  TestIds,
  AdsConsent,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import * as Sentry from '@sentry/react-native';

export const _adMobGenerationTournoiInterstitiel = async () => {
  let nonPersonalizedAdsOnly = false;
  let unitId = '';

  const { createAPersonalisedAdsProfile, selectPersonalisedAds } =
    await AdsConsent.getUserChoices();

  if (
    selectPersonalisedAds === false ||
    createAPersonalisedAdsProfile === false
  ) {
    nonPersonalizedAdsOnly = true;
  }

  if (__DEV__) {
    unitId = TestIds.INTERSTITIAL;
  } else if (Platform.OS === 'android') {
    unitId = 'ca-app-pub-4863676282747598/6377550900';
  } else if (Platform.OS === 'ios') {
    unitId = 'ca-app-pub-4863676282747598/2014213186';
  } else {
    console.log('Plateforme non prise en charge pour admob banner');
    return;
  }

  const interstitialAd = InterstitialAd.createForAdRequest(unitId, {
    requestNonPersonalizedAdsOnly: nonPersonalizedAdsOnly,
  });
  interstitialAd.addAdEventListener(AdEventType.LOADED, () =>
    EventRegister.emit('interstitialAdEvent', {
      adClosed: false,
      adLoaded: true,
    }),
  );
  interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
    EventRegister.emit('interstitialAdEvent', {
      adClosed: true,
      adLoaded: false,
    });
    Sentry.captureMessage(error.message);
  });
  interstitialAd.addAdEventListener(AdEventType.CLOSED, () =>
    EventRegister.emit('interstitialAdEvent', {
      adClosed: true,
      adLoaded: false,
    }),
  );
  interstitialAd.load();
  return interstitialAd;
};

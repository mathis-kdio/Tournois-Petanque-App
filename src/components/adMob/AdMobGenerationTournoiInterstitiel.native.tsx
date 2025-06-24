import {
  InterstitialAd,
  TestIds,
  AdsConsent,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const getUnitId = (): string => {
  if (__DEV__) {
    return TestIds.INTERSTITIAL;
  }
  switch (Platform.OS) {
    case 'android':
      return 'ca-app-pub-4863676282747598/6377550900';
    case 'ios':
      return 'ca-app-pub-4863676282747598/2014213186';
    default:
      console.warn('Plateforme non prise en charge pour admob interstitial');
      return '';
  }
};

let interstitialAd: InterstitialAd | null = null;
let isLoaded = false;
const loadedListeners: (() => void)[] = [];
const errorListeners: ((error: Error) => void)[] = [];
const closedListeners: (() => void)[] = [];

let timeoutId: number | null = null;

export const initInterstitial = async () => {
  let requestNonPersonalizedAdsOnly = false;

  const { createAPersonalisedAdsProfile, selectPersonalisedAds } =
    await AdsConsent.getUserChoices();

  if (
    selectPersonalisedAds === false ||
    createAPersonalisedAdsProfile === false
  ) {
    requestNonPersonalizedAdsOnly = true;
  }

  interstitialAd = InterstitialAd.createForAdRequest(getUnitId(), {
    requestNonPersonalizedAdsOnly,
  });

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    clearTimeout(timeoutId!);
    isLoaded = true;
    loadedListeners.forEach((cb) => cb());
  });

  interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
    clearTimeout(timeoutId!);
    isLoaded = false;
    errorListeners.forEach((cb) => cb(error));
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    interstitialAd?.load();
    closedListeners.forEach((cb) => cb());
  });

  timeoutId = setTimeout(() => {
    const err = new Error('Timeout : interstitial ad non chargée à temps');
    errorListeners.forEach((cb) => cb(err));
  }, 5000);

  interstitialAd.load();
};

export const showInterstitialAd = () => {
  if (isLoaded && interstitialAd) {
    interstitialAd.show();
  } else {
    console.warn('Interstitial not loaded yet');
  }
};

export const onAdLoaded = (callback: () => void) => {
  loadedListeners.push(callback);
};

export const onAdError = (callback: (error: Error) => void) => {
  errorListeners.push(callback);
};

export const onAdClosed = (callback: () => void) => {
  closedListeners.push(callback);
};

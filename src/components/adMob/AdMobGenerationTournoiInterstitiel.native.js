import { InterstitialAd, TestIds, AdsConsent } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

export const _adMobGenerationTournoiInterstitiel = async () => {
  this.nonPersonalizedAdsOnly= false;
  this.unitId = "";
  this.interstitial;

  const {
    createAPersonalisedAdsProfile,
    selectPersonalisedAds,
  } = await AdsConsent.getUserChoices();

  if (selectPersonalisedAds === false || createAPersonalisedAdsProfile == false) {
    this.nonPersonalizedAdsOnly = true;
  }

  if (__DEV__) {
    this.unitId = TestIds.INTERSTITIAL;
  } else if (Platform.OS === 'android') {
    this.unitId = "ca-app-pub-4863676282747598/6377550900";
  } else if (Platform.OS === 'ios') {
    this.unitId = "ca-app-pub-4863676282747598/2014213186";
  } else {
    console.log("Plateforme non prise en charge pour admob banner");
    return;
  }

  return InterstitialAd.createForAdRequest(this.unitId, {requestNonPersonalizedAdsOnly: this.nonPersonalizedAdsOnly});
}
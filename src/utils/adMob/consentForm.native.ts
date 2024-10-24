import { AppStateStatus } from 'react-native';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';

export const _adsConsentForm = async (appState: AppStateStatus) => {
  if (appState === 'active') {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    if (
      consentInfo.isConsentFormAvailable &&
      [AdsConsentStatus.UNKNOWN, AdsConsentStatus.REQUIRED].includes(
        consentInfo.status,
      )
    ) {
      const res = await AdsConsent.showForm();
      if (res.status === AdsConsentStatus.OBTAINED) {
        const adapterStatuses = await mobileAds().initialize();
        console.log(adapterStatuses);
      }
    }
  }
};

export const _adsConsentShowForm = async () => {
  const consentInfo = await AdsConsent.requestInfoUpdate();
  if (consentInfo.isConsentFormAvailable) {
    const status = await AdsConsent.showForm();
    console.log(status);
  }
};

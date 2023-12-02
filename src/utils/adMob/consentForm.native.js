import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';

export const _adsConsentForm = (appState) => {
  if (appState == "active") {
    AdsConsent.requestInfoUpdate().then(async consentInfo => {
      if (consentInfo.isConsentFormAvailable && (consentInfo.status === AdsConsentStatus.UNKNOWN || consentInfo.status === AdsConsentStatus.REQUIRED)) {
        if (appState == "active") {
          AdsConsent.showForm().then(async res => {
            if (res.status === AdsConsentStatus.OBTAINED) {
              mobileAds().initialize().then(async adapterStatuses => {console.log(adapterStatuses)});
            }
          });
        }
      }
    });
  }
}

export const _adsConsentShowForm = () => {
  AdsConsent.requestInfoUpdate().then(async consentInfo => {
    if (consentInfo.isConsentFormAvailable) {
      AdsConsent.showForm().then(async status => {console.log(status)});
    }
  });
}
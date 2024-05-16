import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { _adsConsentForm } from '../adMob/consentForm'

export const _requestTrackingPermissions = (appState) => {
  requestTrackingPermissionsAsync().then(status => {
    if (status === 'granted') {
      _adsConsentForm(appState);
    }
  });
}
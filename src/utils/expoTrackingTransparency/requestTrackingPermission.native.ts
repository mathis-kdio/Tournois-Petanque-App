import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { _adsConsentForm } from '../adMob/consentForm'

export const _requestTrackingPermissions = (appState) => {
  requestTrackingPermissionsAsync().then(permissionResponse => {
    if (permissionResponse.status === 'granted') {
      _adsConsentForm(appState);
    }
  });
}
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { AppStateStatus } from 'react-native';
import { _adsConsentForm } from '../adMob/consentForm';

export const _requestTrackingPermissions = (appState: AppStateStatus) => {
  requestTrackingPermissionsAsync().then((permissionResponse) => {
    if (permissionResponse.status === 'granted') {
      _adsConsentForm(appState);
    }
  });
};

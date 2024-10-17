import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { _adsConsentForm } from '../adMob/consentForm';
import { AppStateStatus } from 'react-native';

export const _requestTrackingPermissions = (appState: AppStateStatus) => {
  requestTrackingPermissionsAsync().then((permissionResponse) => {
    if (permissionResponse.status === 'granted') {
      _adsConsentForm(appState);
    }
  });
};

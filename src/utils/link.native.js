import * as Linking from 'expo-linking'
import { Platform } from 'react-native';

export const _openPlateformLink = (androidLink, iosLink) => {
  Platform.OS === 'android' ? _openURL(androidLink) : _openURL(iosLink);
}

export const _openURL = (url) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    }}
  )
}
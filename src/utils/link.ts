import { Linking } from 'react-native';

export const _openPlateformLink = (androidLink, iosLink) => {
  _openURL("https://tournoispetanqueapp.fr/");
}

export const _openURL = (url) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    }}
  )
}
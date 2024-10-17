import { Linking } from 'react-native';

export const _openPlateformLink = (androidLink: string, iosLink: string) => {
  _openURL('https://tournoispetanqueapp.fr/');
};

export const _openURL = (url: string) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    }
  });
};

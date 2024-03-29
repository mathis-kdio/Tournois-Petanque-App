import i18n from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from "react-i18next";
import francais from '@assets/languages/fr.json';
import english from '@assets/languages/en.json';
import polonais from '@assets/languages/pl.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'fr-FR',
    compatibilityJSON: 'v3',
    lng: Localization.locale,
    resources: {
      'fr-FR': francais,
      'en-US': english,
      'en-GB': english,
      'pl-PL': polonais,
      ns: ['translation'],
      supportedLngs: [
        {
          code: 'fr-FR',
          locale: 'Français - France'
        },
        {
          code: 'en-US',
          locale: 'Anglais - Etats-Unis'
        },
        {
          code: 'en-GB',
          locale: 'Anglais - Royaume-Uni'
        },
        {
          code: 'pl-PL',
          locale: 'Polonais - Pologne'
        }
      ],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false // not needed for react
      }
    }
  })
export default i18n;
import i18n from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from 'react-i18next';
import francais from '@assets/languages/fr.json';
import changelogFR from '@assets/ChangelogData.json';
import english from '@assets/languages/en.json';
import changelogEN from '@assets/ChangelogData_en.json';
import polonais from '@assets/languages/pl.json';
import changelogPL from '@assets/ChangelogData_pl.json';
import neerlandais from '@assets/languages/nl.json';
import changelogNL from '@assets/ChangelogData_nl.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'fr-FR',
    compatibilityJSON: 'v3',
    lng: Localization.getLocales()[0]['languageTag'],
    resources: {
      'fr-FR': {
        'common': francais.translation,
        'changelog': changelogFR
      },
      'en-US': {
        'common': english.translation,
        'changelog': changelogEN
      },
      'en-GB': {
        'common': english.translation,
        'changelog': changelogEN
      },
      'pl-PL': {
        'common': polonais.translation,
        'changelog': changelogPL
      },
      'nl-NL': {
        'common': neerlandais.translation,
        'changelog': changelogNL
      },
      ns: ['common', 'changelog'],
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
      defaultNS: 'common',
      interpolation: {
        escapeValue: false // not needed for react
      }
    }
  })
export default i18n;
import changelogFR from '@assets/ChangelogData.json';
import changelogDA from '@assets/ChangelogData_da.json';
import changelogDE from '@assets/ChangelogData_de.json';
import changelogEN from '@assets/ChangelogData_en.json';
import changelogES from '@assets/ChangelogData_es.json';
import changelogNL from '@assets/ChangelogData_nl.json';
import changelogPL from '@assets/ChangelogData_pl.json';
import danois from '@assets/languages/da.json';
import allemand from '@assets/languages/de.json';
import anglais from '@assets/languages/en.json';
import espagnol from '@assets/languages/es.json';
import francais from '@assets/languages/fr.json';
import neerlandais from '@assets/languages/nl.json';
import polonais from '@assets/languages/pl.json';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'fr-FR',
    compatibilityJSON: 'v3',
    lng: Localization.getLocales()[0]['languageTag'],
    resources: {
      'fr-FR': {
        common: francais.translation,
        changelog: changelogFR,
      },
      'en-US': {
        common: anglais.translation,
        changelog: changelogEN,
      },
      'en-GB': {
        common: anglais.translation,
        changelog: changelogEN,
      },
      'pl-PL': {
        common: polonais.translation,
        changelog: changelogPL,
      },
      'nl-NL': {
        common: neerlandais.translation,
        changelog: changelogNL,
      },
      'de-DE': {
        common: allemand.translation,
        changelog: changelogDE,
      },
      'dk-DK': {
        common: danois.translation,
        changelog: changelogDA,
      },
      'es-ES': {
        common: espagnol.translation,
        changelog: changelogES,
      },
      ns: ['common', 'changelog'],
      supportedLngs: [
        {
          code: 'fr-FR',
          locale: 'Français - France',
        },
        {
          code: 'en-US',
          locale: 'Anglais - Etats-Unis',
        },
        {
          code: 'en-GB',
          locale: 'Anglais - Royaume-Uni',
        },
        {
          code: 'pl-PL',
          locale: 'Polonais - Pologne',
        },
        {
          code: 'nl-NL',
          locale: 'Neerlandais - Pays-Bas',
        },
        {
          code: 'de-DE',
          locale: 'Allemand - Allemagne',
        },
        {
          code: 'dk-DK',
          locale: 'Danois - Danemark',
        },
        {
          code: 'es-ES',
          locale: 'Espagnol - Espagne',
        },
      ],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false, // not needed for react
      },
    },
  });
export default i18n;

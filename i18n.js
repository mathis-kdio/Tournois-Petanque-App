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
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next) // passes i18next down to react-i18next
  .init({
    fallbackLng: 'fr-FR',
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
    },
    ns: ['common', 'changelog'],
    supportedLngs: [
      'fr-FR',
      'en-US',
      'en-GB',
      'pl-PL',
      'nl-NL',
      'de-DE',
      'dk-DK',
      'es-ES',
    ],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react
    },
  });
export default i18next;

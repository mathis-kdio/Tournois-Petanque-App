import { ConfigContext, ExpoConfig } from '@expo/config';

const version = '2.3.0';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Tournois Pétanque App',
  slug: 'PetanqueGCU',
  version: version,
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'tournois-petanque-app',
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0594ae',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/a9524187-3720-46fc-8d6e-6e9e7211bda7',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'TournoisPetanqueApp',
    buildNumber: '2.1.2',
    supportsTablet: true,
    userInterfaceStyle: 'light',
    infoPlist: {
      LSApplicationQueriesSchemes: ['mailto', 'mailto'],
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['0A2A.1', '3B52.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
          NSPrivacyAccessedAPITypeReasons: ['E174.1', '85F4.1'],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.MK.PetanqueGCU',
    permissions: ['com.google.android.gms.permission.AD_ID'],
    userInterfaceStyle: 'light',
  },
  web: {
    favicon: './src/assets/favicon.png',
    bundler: 'metro',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  plugins: [
    ['expo-localization'],
    [
      'expo-build-properties',
      {
        android: {
          extraProguardRules:
            '-keep class com.google.android.gms.internal.consent_sdk.** { *; }',
        },
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'tournois-petanque-gcu',
        organization: 'tournois-petanque-app',
      },
    ],
    ['./plugins-build/withDisableForcedDarkModeAndroid.js'],
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: 'ca-app-pub-4863676282747598~6547631167',
        iosAppId: 'ca-app-pub-4863676282747598~9377577122',
        userTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads to you.',
        delayAppMeasurementInit: true,
        skAdNetworkItems: [
          'cstr6suwn9.skadnetwork',
          '4fzdc2evr5.skadnetwork',
          '4pfyvq9l8r.skadnetwork',
          '2fnua5tdw4.skadnetwork',
          'ydx93a7ass.skadnetwork',
          '5a6flpkh64.skadnetwork',
          'p78axxw29g.skadnetwork',
          'v72qych5uu.skadnetwork',
          'ludvb6z3bs.skadnetwork',
          'cp8zw746q7.skadnetwork',
          '3sh42y64q3.skadnetwork',
          'c6k4g5qg8m.skadnetwork',
          's39g8k73mm.skadnetwork',
          '3qy4746246.skadnetwork',
          'f38h382jlk.skadnetwork',
          'hs6bdukanm.skadnetwork',
          'v4nxqhlyqp.skadnetwork',
          'wzmmz9fp6w.skadnetwork',
          'yclnxrl5pm.skadnetwork',
          't38b2kh725.skadnetwork',
          '7ug5zh24hu.skadnetwork',
          'gta9lk7p23.skadnetwork',
          'vutu7akeur.skadnetwork',
          'y5ghdn5j9k.skadnetwork',
          'n6fk4nfna4.skadnetwork',
          'v9wttpbfk9.skadnetwork',
          'n38lu8286q.skadnetwork',
          '47vhws6wlr.skadnetwork',
          'kbd757ywx3.skadnetwork',
          '9t245vhmpl.skadnetwork',
          'eh6m2bh4zr.skadnetwork',
          'a2p9lx4jpn.skadnetwork',
          '22mmun2rn5.skadnetwork',
          '4468km3ulz.skadnetwork',
          '2u9pt9hc89.skadnetwork',
          '8s468mfl3y.skadnetwork',
          'klf5c3l5u5.skadnetwork',
          'ppxm28t8ap.skadnetwork',
          'ecpz2srf59.skadnetwork',
          'uw77j35x4d.skadnetwork',
          'pwa73g5rt2.skadnetwork',
          'mlmmfzh3r3.skadnetwork',
          '578prtvx9j.skadnetwork',
          '4dzt52r2t5.skadnetwork',
          'e5fvkxwrpn.skadnetwork',
          '8c4e2ghe7u.skadnetwork',
          'zq492l623r.skadnetwork',
          '3rd42ekr43.skadnetwork',
          '3qcr597p9d.skadnetwork',
        ],
      },
    ],
    'expo-router',
  ],
  extra: {
    eas: {
      projectId: 'a9524187-3720-46fc-8d6e-6e9e7211bda7',
    },
    appVersion: version,
  },
});

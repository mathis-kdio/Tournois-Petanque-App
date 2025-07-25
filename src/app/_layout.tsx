import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/navigation/gesture-handler'; //https://reactnavigation.org/docs/stack-navigator/
import 'expo-dev-client';
import { Provider } from 'react-redux';
import Store from '@store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import i18n from '../../i18n';
import '../../global.css';
import '@expo/metro-runtime'; //Fast-refresh web
import { AuthProvider } from '@/components/supabase/SessionProvider';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { isRunningInExpoGo } from 'expo';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SELECTED_LANGUAGE_KEY } from '@/utils/async-storage/key';
import {
  ThemeProvider,
  useTheme,
} from '@/components/ui/theme-provider/ThemeProvider';
import { getTheme, getThemeColor } from '@/utils/theme/theme';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { cssInterop } from 'nativewind';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

cssInterop(FontAwesome5, { className: 'style' });
cssInterop(MaterialCommunityIcons, { className: 'style' });

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
  enabled: !__DEV__,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 0.3,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [navigationIntegration, Sentry.mobileReplayIntegration()],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  attachStacktrace: true,
});

const GluestackWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { globalTheme, style } = getTheme(theme);
  return (
    <GluestackUIProvider theme={globalTheme} mode={style}>
      {children}
    </GluestackUIProvider>
  );
};

const StatusBarWrapper = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);
  if (Platform.OS === 'android') {
    setBackgroundColorAsync(color);
  }
  return <StatusBar backgroundColor={color} />;
};

export default function RootLayout() {
  let persistor = persistStore(Store);

  const ref = useNavigationContainerRef();
  React.useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  React.useEffect(() => {
    const fetchLanguage = async () => {
      const selectedLanguage = await AsyncStorage.getItem(
        SELECTED_LANGUAGE_KEY,
      );
      if (selectedLanguage) {
        i18n.changeLanguage(selectedLanguage);
      }
    };
    fetchLanguage();
  }, []);

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <GluestackWrapper>
              <I18nextProvider i18n={i18n} defaultNS={'common'}>
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBarWrapper />
              </I18nextProvider>
            </GluestackWrapper>
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

Sentry.wrap(RootLayout, {
  touchEventBoundaryProps: { labelName: 'accessibilityLabel' },
});

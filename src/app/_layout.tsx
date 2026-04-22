import { AuthProvider } from '@/components/supabase/SessionProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import {
  ThemeProvider,
  useTheme,
} from '@/components/ui/theme-provider/ThemeProvider';
import { DatabaseInitializer } from '@/db/DatabaseInitializer';
import '@/navigation/gesture-handler'; //https://reactnavigation.org/docs/stack-navigator/
import { SELECTED_LANGUAGE_KEY } from '@/utils/async-storage/key';
import { getTheme } from '@/utils/theme/theme';
import '@expo/metro-runtime'; //Fast-refresh web
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import Store from '@store/configureStore';
import { isRunningInExpoGo } from 'expo';
import 'expo-dev-client';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { cssInterop } from 'nativewind';
import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import '../../global.css';
import i18n from '../../i18n';

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
  enableLogs: true,
});

const GluestackWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const { globalTheme, style } = getTheme(theme);
  return (
    <GluestackUIProvider theme={globalTheme} mode={style}>
      {children}
    </GluestackUIProvider>
  );
};

export default function RootLayout() {
  let persistor = persistStore(Store);

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
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

  useEffect(() => {
    const unlockScreenOerientation = async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.unlockAsync();
      }
    }
    unlockScreenOerientation();
  }, []);

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <GluestackWrapper>
              <DatabaseInitializer>
                <I18nextProvider i18n={i18n} defaultNS={'common'}>
                  <Stack screenOptions={{ headerShown: false }} />
                </I18nextProvider>
              </DatabaseInitializer>
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

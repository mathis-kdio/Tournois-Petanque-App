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
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  attachStacktrace: true,
});

export default function RootLayout() {
  let persistor = persistStore(Store);

  const ref = useNavigationContainerRef();
  React.useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <GluestackUIProvider mode="light">
            <I18nextProvider i18n={i18n} defaultNS={'common'}>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="light" backgroundColor="#0594ae" />
            </I18nextProvider>
          </GluestackUIProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

Sentry.wrap(RootLayout, {
  touchEventBoundaryProps: { labelName: 'accessibilityLabel' },
});

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/navigation/gesture-handler'; //https://reactnavigation.org/docs/stack-navigator/
import 'expo-dev-client';
import React from 'react';
import Navigation from '@navigation/Navigation';
import { Provider } from 'react-redux';
import Store from '@store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import i18n from './i18n';
import './global.css';
import '@expo/metro-runtime'; //Fast-refresh web
import { AuthProvider } from '@/components/supabase/SessionProvider';

const reactNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
  enabled: !__DEV__,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 0.3,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [reactNavigationIntegration, Sentry.mobileReplayIntegration()],
  attachStacktrace: true,
});

class App extends React.Component {
  navigationRef = createNavigationContainerRef<any>(); //TODO tmp changer any
  render() {
    let persistor = persistStore(Store);
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <AuthProvider>
            <GluestackUIProvider mode="light">
              <NavigationContainer
                ref={this.navigationRef}
                onReady={() =>
                  reactNavigationIntegration.registerNavigationContainer(
                    this.navigationRef,
                  )
                }
              >
                <I18nextProvider i18n={i18n} defaultNS={'common'}>
                  <Navigation />
                  <StatusBar style="light" backgroundColor="#0594ae" />
                </I18nextProvider>
              </NavigationContainer>
            </GluestackUIProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default Sentry.wrap(App, {
  touchEventBoundaryProps: { labelName: 'accessibilityLabel' },
});

import 'react-native-gesture-handler'; //https://reactnavigation.org/docs/stack-navigator/
import 'expo-dev-client';
import React from 'react';
import Navigation from '@navigation/Navigation';
import { Provider } from 'react-redux';
import Store from '@store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import i18n from './i18n';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import "@expo/metro-runtime"; //Fast-refresh web
import SessionProvider from '@/components/supabase/SessionProvider';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
Sentry.init({
  dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
  enabled: !__DEV__,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 0.3,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
  attachStacktrace: true,
});

class App extends React.Component {
  navigationRef = createNavigationContainerRef<any>(); //TODO tmp changer any
  render() {
    let persistor = persistStore(Store);
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <SessionProvider>
            <GluestackUIProvider config={config}>
              <NavigationContainer onReady={() => routingInstrumentation.registerNavigationContainer(this.navigationRef)}>
                <I18nextProvider i18n={i18n} defaultNS={'common'}>
                  <Navigation/>
                  <StatusBar style="light" backgroundColor="#0594ae"/>
                </I18nextProvider>
              </NavigationContainer>
            </GluestackUIProvider>
          </SessionProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default Sentry.wrap(App, {touchEventBoundaryProps: { labelName: "accessibilityLabel" }});
import 'expo-dev-client';
import React from 'react';
import Navigation from '@navigation/Navigation';
import { Provider } from 'react-redux';
import Store from '@store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from "react-i18next";
import * as Sentry from '@sentry/react-native';
import i18n from "./i18n";
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from './config/gluestack-ui.config';
import { Platform } from 'react-native';
import "@expo/metro-runtime"; //Fast-refresh web

let routingInstrumentation = undefined;
if (Platform.OS == "android" || Platform.OS == "ios") {
  routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
  Sentry.init({
    dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
    enableInExpoDevelopment: false,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 0.3,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation,
      }),
    ],
    attachStacktrace: true,
  });
}

function onNavigationContainerReady(navigation) {
  if (Platform.OS == "android" || Platform.OS == "ios") {
    routingInstrumentation.registerNavigationContainer(navigation);
  }
}

class App extends React.Component {
  navigation = React.createRef();
  render() {
    let persistor = persistStore(Store);
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <GluestackUIProvider config={config}>
            <NavigationContainer ref={this.navigation} onReady={() => onNavigationContainerReady(this.navigation)}>
              <I18nextProvider i18n={i18n} defaultNS={'translation'}>
                <Navigation/>
                <StatusBar style="light" backgroundColor="#0594ae"/>
              </I18nextProvider>
            </NavigationContainer>
          </GluestackUIProvider>
        </PersistGate>
      </Provider>
    )
  }
}

let main = App;
if (Platform.OS == "android" || Platform.OS == "ios") {
  main = Sentry.wrap(App, {touchEventBoundaryProps: { labelName: "accessibilityLabel" }});
}
export default main;
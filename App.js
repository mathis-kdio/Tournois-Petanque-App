// App.js

import 'expo-dev-client'
import React from 'react'
import Navigation from './navigation/Navigation'
import { Provider } from 'react-redux';
import Store from './store/configureStore'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from 'sentry-expo';

const routingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation();

Sentry.init({
  dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
  enableInExpoDevelopment: false,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

class App extends React.Component {
  navigation = React.createRef();
  render() {
    let persistor = persistStore(Store)
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer ref={this.navigation} onReady={() => {routingInstrumentation.registerNavigationContainer(this.navigation);}}>
            <Navigation />
            <StatusBar style="light" backgroundColor="#ffda00"/>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    )
  }
}

export default Sentry.Native.wrap(App);
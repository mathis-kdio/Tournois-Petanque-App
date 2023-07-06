import 'expo-dev-client';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux';
import Store from './src/store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from "react-i18next";
import * as Sentry from 'sentry-expo';
import i18n from "./i18n";

const routingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation();

Sentry.init({
  dsn: 'https://ca59ddcb4fb74f3bb4f82a10a1378747@o1284678.ingest.sentry.io/6495554',
  enableInExpoDevelopment: false,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 0.3,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
  attachStacktrace: true,
});

class App extends React.Component {
  navigation = React.createRef();
  render() {
    const theme = extendTheme({
      components: {
        Checkbox: {
          baseStyle: {
            _text: {
              color:"white"
            },
            bg: "cyan.600",
            borderColor: "white",
            _checked: {
              borderColor: "white",
              bg: "cyan.600",
              _pressed: {
                borderColor: "white",
                bg: "cyan.600"
              }
            },
            _pressed:{
              borderColor: "white"
            }
          },
          sizes: {
            md: { _text: { fontSize: 'md' } }
          },
        },
        Input: {
          baseStyle: {
            color: "white",
            borderColor: "white",
            _focus: {
              borderColor: "white"
            }
          }
        },
        Select: {
          baseStyle: {
            _customDropdownIconProps: {
              color: "white"
            }
          }
        }
      }
    });
    let persistor = persistStore(Store);
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <NativeBaseProvider theme={theme}>
            <NavigationContainer ref={this.navigation} onReady={() => {routingInstrumentation.registerNavigationContainer(this.navigation);}}>
              <I18nextProvider i18n={i18n} defaultNS={'translation'}>
                <Navigation/>
                <StatusBar style="light" backgroundColor="#ffda00"/>
              </I18nextProvider>
            </NavigationContainer>
          </NativeBaseProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default Sentry.Native.wrap(App);
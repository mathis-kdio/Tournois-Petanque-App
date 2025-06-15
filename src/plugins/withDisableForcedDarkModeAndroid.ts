// disable forced dark mode to prevent weird color changes on
// certain android devices (Xiaomi MIUI and others enforcing dark mode with view analyzing)
import { AndroidConfig, withAndroidStyles, ConfigPlugin } from '@expo/config-plugins';

const withDisableForcedDarkModeAndroid: ConfigPlugin = config => {
  return withAndroidStyles(config, androidStylesConfig => {
    const styles = androidStylesConfig.modResults;
    androidStylesConfig.modResults = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeGroup(),
      name: `android:forceDarkAllowed`,
      value: 'false',
    });
    return androidStylesConfig;
  });
};

export default withDisableForcedDarkModeAndroid;

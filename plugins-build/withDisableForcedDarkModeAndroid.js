"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// disable forced dark mode to prevent weird color changes on
// certain android devices (Xiaomi MIUI and others enforcing dark mode with view analyzing)
const config_plugins_1 = require("@expo/config-plugins");
const withDisableForcedDarkModeAndroid = (config) => {
    return (0, config_plugins_1.withAndroidStyles)(config, (androidStylesConfig) => {
        const styles = androidStylesConfig.modResults;
        androidStylesConfig.modResults = config_plugins_1.AndroidConfig.Styles.assignStylesValue(styles, {
            add: true,
            parent: config_plugins_1.AndroidConfig.Styles.getAppThemeGroup(),
            name: `android:forceDarkAllowed`,
            value: 'false',
        });
        return androidStylesConfig;
    });
};
exports.default = withDisableForcedDarkModeAndroid;

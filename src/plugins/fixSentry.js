const { withAppBuildGradle, withPlugins } = require("@expo/config-plugins");

const sentryFix = `project.ext.sentryCli=[collectModulesScript: new File(["node", "--print", "require.resolve('@sentry/react-native/package.json')"].execute().text.trim(), "../dist/js/tools/collectModules.js")]`;

function withSentryMonorepoFix(config) {
  return withAppBuildGradle(config, config => {
    config.modResults.contents = `
        ${sentryFix}
        ${config.modResults.contents}
    `;
    return config;
  });
}

module.exports = config => withPlugins(config, [withSentryMonorepoFix]);
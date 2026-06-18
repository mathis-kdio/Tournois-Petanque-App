const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const { default: reactDoctor } = require('eslint-plugin-react-doctor');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  reactDoctor.configs['react-native'],
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'node_modules/*',
      'src-tauri/*',
      'src/components/ui/*',
      'plugins/*',
    ],
  },
]);

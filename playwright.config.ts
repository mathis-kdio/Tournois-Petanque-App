import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour la version web (Expo / react-native-web).
 *
 * Le serveur de dev Expo est démarré automatiquement par Playwright via
 * `webServer`. En local, on réutilise un serveur déjà lancé s'il existe ;
 * en CI, on en démarre un nouveau.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier où se trouvent les tests E2E.
  testDir: './tests/e2e',

  // Les tests E2E sont plus lents que les tests unitaires : on augmente le
  // timeout par défaut (30s) car le bundling Metro peut prendre du temps.
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  // Pas de tests en parallèle : un seul serveur Metro, un seul bundling.
  fullyParallel: false,
  workers: 1,

  // Échec rapide en local (on s'arrête au 1er échec), tout exécuter en CI.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // Rapports : HTML en local, ligne + JSON en CI.
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  // Dossier de sortie des artefacts (captures, traces, vidéos).
  outputDir: 'test-results/output',

  use: {
    // URL de base : le serveur web Expo (port 8081 par défaut).
    baseURL: 'http://localhost:8081',

    // Force la locale du navigateur en français.
    // expo-localization (web) lit `navigator.languages` / `navigator.language`
    // pour initialiser i18next ; sans cela, l'app s'affiche en anglais (en-US).
    // L'option `locale` émule ces deux valeurs + l'en-tête Accept-Language.
    locale: 'fr-FR',

    // Captures d'écran et trace uniquement en cas d'échec.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Navigation plus tolérante : Metro peut mettre du temps à servir le
    // premier bundle.
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Démarre automatiquement le serveur web Expo si nécessaire.
  webServer: {
    command: 'npx expo start --web --port 8081',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000, // 3 min : le 1er bundling Metro peut être long.
    stdout: 'pipe',
    stderr: 'pipe',
  },
});

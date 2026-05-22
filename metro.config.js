const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Nécessaire pour expo-sqlite
config.resolver.assetExts.push('wasm');
config.server.enhanceMiddleware = (_metroMiddleware, _metroServer) => {
  return (_req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return _metroMiddleware(_req, res, next);
  };
};

// Nécessaire pour Drizzle
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });

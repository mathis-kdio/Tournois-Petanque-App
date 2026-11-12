/**
 * Génération d'UUID v7 côté client.
 *
 * UUID v7 = timestamp Unix (ms, 48 bits) + version (4 bits) + random (12 bits)
 *           + variant (2 bits) + random (62 bits).
 *
 * Avantages : triable (adapté aux index), globalement unique sans coordination,
 * compatible React Native / Hermes / Web grâce à `crypto.getRandomValues`.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc9562#name-uuid-version-7
 */

/**
 * Retourne 16 octets aléatoires via l'API Web Crypto.
 * Fonctionne sur React Native (Hermes), expo-web et navigateurs.
 */
function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  // React Native / Hermes expose `crypto.getRandomValues` globalement
  // (polyfillé par expo ou react-native-get-random-values).
  // Sur web, l'API Web Crypto native est utilisée.
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto?.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  // Fallback : Math.random (moins sécurisé, mais suffisant pour des UUIDs
  // de collision-avoidance hors ligne).
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

/**
 * Génère un UUID v7 sous forme de chaîne canonique
 * `xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx`.
 */
export function uuidv7(): string {
  const timestampMs = Date.now();

  // 48 bits de timestamp (big-endian) dans les octets 0-5
  const bytes = getRandomBytes(16);
  bytes[0] = (timestampMs / 2 ** 40) & 0xff;
  bytes[1] = (timestampMs / 2 ** 32) & 0xff;
  bytes[2] = (timestampMs / 2 ** 24) & 0xff;
  bytes[3] = (timestampMs / 2 ** 16) & 0xff;
  bytes[4] = (timestampMs / 2 ** 8) & 0xff;
  bytes[5] = timestampMs & 0xff;

  // Version 7 dans les 4 bits de poids fort de l'octet 6
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 10xx dans les 2 bits de poids fort de l'octet 8
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Format canonique 8-4-4-4-12
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

/**
 * Tests du réglage « synchronisation automatique ».
 *
 * Couvre : valeur par défaut (true), persistance du choix, et la règle
 * métier — la synchro auto n'est active que pour un utilisateur premium
 * (getIsPremium) ayant laissé le réglage activé.
 */

import { AUTO_SYNC_ENABLED_KEY } from '@/utils/async-storage/key';
import {
  checkSyncGate,
  getAutoSyncEnabled,
  isAutoSyncActive,
  isSyncAllowed,
  setAutoSyncEnabled,
} from './autoSyncSetting';

const asyncStorageStore = new Map<string, string>();
const mockGetItem = jest.fn((key: string) =>
  Promise.resolve(asyncStorageStore.get(key) ?? null),
);
const mockSetItem = jest.fn((key: string, value: string) => {
  asyncStorageStore.set(key, value);
  return Promise.resolve();
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (key: any) => mockGetItem(key),
    setItem: (key: any, value: any) => mockSetItem(key, value),
  },
}));

const mockGetIsPremium = jest.fn((): boolean => false);

jest.mock('@/services/purchases/premiumStore', () => ({
  getIsPremium: () => mockGetIsPremium(),
}));

describe('autoSyncSetting', () => {
  beforeEach(() => {
    asyncStorageStore.clear();
    jest.clearAllMocks();
  });

  it('valeur par défaut : activée si jamais enregistrée', async () => {
    await expect(getAutoSyncEnabled()).resolves.toBe(true);
  });

  it('persiste le choix de l’utilisateur', async () => {
    await setAutoSyncEnabled(false);
    expect(asyncStorageStore.get(AUTO_SYNC_ENABLED_KEY)).toBe('false');
    await expect(getAutoSyncEnabled()).resolves.toBe(false);

    await setAutoSyncEnabled(true);
    await expect(getAutoSyncEnabled()).resolves.toBe(true);
  });

  it('premium + réglage activé → synchro auto active', async () => {
    mockGetIsPremium.mockReturnValue(true);
    await expect(isAutoSyncActive()).resolves.toBe(true);
  });

  it('premium + réglage désactivé → synchro auto inactive', async () => {
    mockGetIsPremium.mockReturnValue(true);
    await setAutoSyncEnabled(false);
    await expect(isAutoSyncActive()).resolves.toBe(false);
  });

  it('non premium → synchro auto inactive même si le réglage est activé', async () => {
    mockGetIsPremium.mockReturnValue(false);
    await expect(isAutoSyncActive()).resolves.toBe(false);

    await setAutoSyncEnabled(true);
    await expect(isAutoSyncActive()).resolves.toBe(false);
  });

  it('checkSyncGate : allowed si premium, premium_required sinon', () => {
    mockGetIsPremium.mockReturnValue(true);
    expect(checkSyncGate()).toBe('allowed');

    mockGetIsPremium.mockReturnValue(false);
    expect(checkSyncGate()).toBe('premium_required');
  });

  it('isSyncAllowed reflète uniquement le statut premium', async () => {
    mockGetIsPremium.mockReturnValue(true);
    expect(isSyncAllowed()).toBe(true);

    mockGetIsPremium.mockReturnValue(false);
    expect(isSyncAllowed()).toBe(false);

    // Le réglage auto ne change rien : le refresh manuel reste bloqué
    // hors premium, et autorisé pour un premium même avec auto désactivé.
    await setAutoSyncEnabled(false);
    mockGetIsPremium.mockReturnValue(true);
    expect(isSyncAllowed()).toBe(true);
    mockGetIsPremium.mockReturnValue(false);
    expect(isSyncAllowed()).toBe(false);
  });
});

import { act, renderHook } from '@testing-library/react-native';

import { useSyncRefreshProps } from './useSyncRefreshProps';

import NetInfo from '@react-native-community/netinfo';

import { Platform } from 'react-native';

const mockRefresh = jest.fn();
const mockToastShow = jest.fn();

jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ show: mockToastShow }),
  Toast: ({ children }: any) => children,
  ToastTitle: ({ children }: any) => children,
}));

jest.mock('@/services/sync/syncTrigger', () => ({
  useSyncRefresh: () => ({ refresh: mockRefresh, isSyncing: false }),
}));

let mockGate: 'allowed' | 'premium_required' = 'allowed';

jest.mock('@/services/sync/autoSyncSetting', () => ({
  checkSyncGate: () => mockGate,
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { fetch: jest.fn() },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const mockNetInfoFetch = NetInfo.fetch as jest.Mock;

describe('useSyncRefreshProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRefresh.mockResolvedValue(undefined);
    mockGate = 'allowed';
    Platform.OS = 'android';
  });

  it('natif : retourne onRefresh + refreshing (pas de refreshControl)', async () => {
    const { result } = await renderHook(() => useSyncRefreshProps());

    expect(result.current).toHaveProperty('onRefresh');
    expect(result.current).toHaveProperty('refreshing');
    expect(result.current).not.toHaveProperty('refreshControl');
    expect(result.current.refreshing).toBe(false);
  });

  it('web : retourne un objet vide (pas de pull-to-refresh navigateur)', async () => {
    Platform.OS = 'web';
    const { result } = await renderHook(() => useSyncRefreshProps());

    expect(result.current).toEqual({});
  });

  it('gate premium_required : affiche le toast premium et ne lance aucun cycle', async () => {
    mockGate = 'premium_required';
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });

    const { result } = await renderHook(() => useSyncRefreshProps());
    await act(async () => {
      await result.current.onRefresh?.();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledTimes(1);
    expect(mockToastShow.mock.calls[0][0].placement).toBe('top');
  });

  it('hors ligne : affiche le toast et ne lance aucun cycle', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    const { result } = await renderHook(() => useSyncRefreshProps());

    await act(async () => {
      await result.current.onRefresh?.();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledTimes(1);
    expect(mockToastShow.mock.calls[0][0].placement).toBe('top');
  });

  it('en ligne : lance un cycle complet via refresh()', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });

    const { result } = await renderHook(() => useSyncRefreshProps());
    await act(async () => {
      await result.current.onRefresh?.();
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(mockToastShow).not.toHaveBeenCalled();
    expect(result.current.refreshing).toBe(false);
  });

  it('isInternetReachable indéterminé (null) mais connecté → traité en ligne', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: null,
    });

    const { result } = await renderHook(() => useSyncRefreshProps());
    await act(async () => {
      await result.current.onRefresh?.();
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('refreshing passe à true pendant le cycle manuel', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });
    let resolveRefresh: () => void = () => {};
    mockRefresh.mockImplementation(
      () =>
        new Promise<void>((res) => {
          resolveRefresh = res;
        }),
    );

    const { result } = await renderHook(() => useSyncRefreshProps());
    let pending: Promise<void> = Promise.resolve();

    await act(async () => {
      pending = Promise.resolve(result.current.onRefresh?.());
    });
    expect(result.current.refreshing).toBe(true);

    await act(async () => {
      resolveRefresh();
      await pending;
    });
    expect(result.current.refreshing).toBe(false);
  });
});

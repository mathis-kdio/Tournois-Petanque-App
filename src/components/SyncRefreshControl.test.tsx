import { act, render } from '@testing-library/react-native';

import SyncRefreshControl from './SyncRefreshControl';

import NetInfo from '@react-native-community/netinfo';

const mockRefresh = jest.fn();
const mockToastShow = jest.fn();
let capturedProps: any = null;

jest.mock('@/components/ui/refresh-control', () => ({
  RefreshControl: (props: any) => {
    capturedProps = props;
    return null;
  },
}));

jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ show: mockToastShow }),
  Toast: ({ children }: any) => children,
  ToastTitle: ({ children }: any) => children,
}));

jest.mock('@/services/sync/syncTrigger', () => ({
  useSyncRefresh: () => ({ refresh: mockRefresh, isSyncing: false }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { fetch: jest.fn() },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const mockNetInfoFetch = NetInfo.fetch as jest.Mock;

describe('SyncRefreshControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedProps = null;
    mockRefresh.mockResolvedValue(undefined);
  });

  it('hors ligne : affiche le toast et ne lance aucun cycle', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    await render(<SyncRefreshControl />);
    expect(capturedProps.refreshing).toBe(false);

    await act(async () => {
      await capturedProps.onRefresh();
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

    await render(<SyncRefreshControl />);
    await act(async () => {
      await capturedProps.onRefresh();
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(mockToastShow).not.toHaveBeenCalled();
    expect(capturedProps.refreshing).toBe(false);
  });

  it('isInternetReachable indéterminé (null) mais connecté → traité en ligne', async () => {
    mockNetInfoFetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: null,
    });

    await render(<SyncRefreshControl />);
    await act(async () => {
      await capturedProps.onRefresh();
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

    await render(<SyncRefreshControl />);
    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = capturedProps.onRefresh();
    });
    expect(capturedProps.refreshing).toBe(true);

    await act(async () => {
      resolveRefresh();
      await pending;
    });
    expect(capturedProps.refreshing).toBe(false);
  });
});

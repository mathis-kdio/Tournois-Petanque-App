import { fireEvent, render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import SyncRefreshButton from './SyncRefreshButton';

const mockOnRefresh = jest.fn();
const mockPush = jest.fn();

const mockIcon = { name: '' };
let mockRefreshing = false;
let mockGate: 'allowed' | 'premium_required' = 'allowed';

jest.mock('@/hooks/useManualRefresh', () => ({
  useManualRefresh: () => ({
    refreshing: mockRefreshing,
    onRefresh: mockOnRefresh,
  }),
}));

jest.mock('@/services/sync/useSyncGate', () => ({
  useSyncGate: () => ({
    gate: mockGate,
    isPremium: mockGate === 'allowed',
    isLoading: false,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock('@react-native-vector-icons/fontawesome', () => ({
  __esModule: true,
  default: (props: any) => {
    mockIcon.name = props.name;
    return null;
  },
}));

describe('SyncRefreshButton', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRefreshing = false;
    mockGate = 'allowed';
    mockIcon.name = '';
    (Platform as any).OS = 'web';
  });

  afterAll(() => {
    (Platform as any).OS = originalOS;
  });

  it('sur web, premium : rend le bouton refresh et appelle onRefresh au press', async () => {
    const { getByLabelText } = await render(<SyncRefreshButton />);

    expect(mockIcon.name).toBe('refresh');
    fireEvent.press(getByLabelText('rafraichir_donnees'));
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('sur web, gate premium_required : renvoie vers le paywall sans rafraîchir', async () => {
    mockGate = 'premium_required';
    const { getByLabelText } = await render(<SyncRefreshButton />);

    fireEvent.press(getByLabelText('rafraichir_donnees'));
    expect(mockPush).toHaveBeenCalledWith('/paywall');
    expect(mockOnRefresh).not.toHaveBeenCalled();
  });

  it('sur web : affiche le spinner pendant un cycle', async () => {
    mockRefreshing = true;
    const { getByTestId } = await render(<SyncRefreshButton />);

    expect(getByTestId('sync-refresh-spinner')).toBeTruthy();
    expect(mockIcon.name).toBe('');
  });

  it('hors web : ne rend rien', async () => {
    (Platform as any).OS = 'ios';
    const { queryByLabelText } = await render(<SyncRefreshButton />);

    expect(queryByLabelText('rafraichir_donnees')).toBeNull();
  });
});

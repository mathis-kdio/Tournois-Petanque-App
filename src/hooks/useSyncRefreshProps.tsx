import { useManualRefresh } from '@/hooks/useManualRefresh';

import { Platform } from 'react-native';

export interface SyncRefreshProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function useSyncRefreshProps(): SyncRefreshProps {
  const { refreshing, onRefresh } = useManualRefresh();

  if (Platform.OS === 'web') return {};

  return { onRefresh, refreshing };
}

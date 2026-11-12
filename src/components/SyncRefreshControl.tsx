import { RefreshControl } from '@/components/ui/refresh-control';
import { useManualRefresh } from '@/hooks/useManualRefresh';

const SyncRefreshControl = () => {
  const { refreshing, onRefresh } = useManualRefresh();

  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
};

export default SyncRefreshControl;

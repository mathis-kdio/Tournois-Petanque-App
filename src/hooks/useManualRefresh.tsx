import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { useSyncRefresh } from '@/services/sync/syncTrigger';
import NetInfo from '@react-native-community/netinfo';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useManualRefresh() {
  const { t } = useTranslation();
  const toast = useToast();
  const { refresh, isSyncing } = useSyncRefresh();
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const onRefresh = async () => {
    const { isConnected, isInternetReachable } = await NetInfo.fetch();
    const online = isConnected === true && isInternetReachable !== false;
    if (!online) {
      toast.show({
        placement: 'top',
        render: () => (
          <Toast action="warning" variant="solid">
            <ToastTitle>{t('sync_hors_ligne_toast')}</ToastTitle>
          </Toast>
        ),
      });
      return;
    }
    setManualRefreshing(true);
    await refresh().finally(() => setManualRefreshing(false));
  };

  return { refreshing: manualRefreshing || isSyncing, onRefresh };
}

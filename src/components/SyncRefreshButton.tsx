import { Pressable } from '@/components/ui/pressable';
import { useManualRefresh } from '@/hooks/useManualRefresh';
import { useSyncGate } from '@/services/sync/useSyncGate';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform } from 'react-native';

const SyncRefreshButton = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { gate } = useSyncGate();
  const { refreshing, onRefresh } = useManualRefresh();

  const handlePress = () => {
    if (gate === 'premium_required') {
      router.push('/paywall');
      return;
    }
    onRefresh();
  };

  if (Platform.OS !== 'web') return null;

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-2xl p-2"
      accessibilityRole="button"
      accessibilityLabel={t('rafraichir_donnees')}
    >
      {refreshing ? (
        <ActivityIndicator
          size="small"
          color="white"
          testID="sync-refresh-spinner"
        />
      ) : (
        <FontAwesome
          name="refresh"
          size={16}
          className="!text-custom-bg-inverse"
        />
      )}
    </Pressable>
  );
};

export default SyncRefreshButton;

import { useManualRefresh } from '@/hooks/useManualRefresh';
import { Pressable } from '@/components/ui/pressable';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { ActivityIndicator, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const SyncRefreshButton = () => {
  const { t } = useTranslation();
  const { refreshing, onRefresh } = useManualRefresh();

  if (Platform.OS !== 'web') return null;

  return (
    <Pressable
      onPress={onRefresh}
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

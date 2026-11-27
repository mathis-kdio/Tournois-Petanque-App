import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { StyledSwitch } from '@/components/ui/switch/styled-switch';
import { Text } from '@/components/ui/text';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAutoSyncEnabled } from '../hooks/useAutoSyncEnabled';

const AutoSyncToggle = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { gate, enabled, toggle } = useAutoSyncEnabled();

  const onPress = () => {
    if (gate === 'premium_required') {
      router.push('/paywall');
    }
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('sync_auto_titre')}
    >
      <HStack className="m-2 items-center justify-between">
        <HStack className="items-center">
          <FontAwesome
            name="cloud-upload"
            size={16}
            className="!text-custom-bg-inverse pr-2"
          />
          <Text className="text-typography-white text-md">
            {t('sync_auto_titre')}
          </Text>
          {gate === 'premium_required' && (
            <FontAwesome
              name="lock"
              size={14}
              className="!text-custom-bg-inverse pl-2"
            />
          )}
        </HStack>
        <StyledSwitch
          value={gate === 'allowed' && enabled}
          onValueChange={toggle}
          disabled={gate !== 'allowed'}
        />
      </HStack>
    </Pressable>
  );
};

export default AutoSyncToggle;

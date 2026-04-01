import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';

import Loading from '@/components/Loading';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import OptionsTournoi from '@/screens/options-tournoi';
import { getThemeColor } from '@/utils/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  screenStackName?: string;
};

const OptionsTournoiScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  const param = useLocalSearchParams<SearchParams>();
  const { screenStackName } = param;
  if (
    screenStackName !== 'inscriptions-avec-noms' &&
    screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
        <OptionsTournoi screenStackName={screenStackName} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OptionsTournoiScreen;

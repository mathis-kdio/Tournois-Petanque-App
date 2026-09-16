import Loading from '@/components/Loading';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import MatchDetail from '@/screens/match-detail';
import { getThemeColor } from '@/utils/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  idMatch?: string;
};

const MatchDetailScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  const param = useLocalSearchParams<SearchParams>();

  const idMatchParams = parseInt(param.idMatch ?? '');

  if (isNaN(idMatchParams)) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
        <MatchDetail idMatch={idMatchParams} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MatchDetailScreen;

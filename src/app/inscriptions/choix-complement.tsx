import Loading from '@/components/Loading';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ChoixComplement from '@/screens/complement';
import { getThemeColor } from '@/utils/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  screenStackName?: string;
};

const ChoixComplementScreen = () => {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ChoixComplement screenStackName={screenStackName} />
    </SafeAreaView>
  );
};

export default ChoixComplementScreen;

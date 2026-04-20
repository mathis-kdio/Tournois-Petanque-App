import Loading from '@/components/Loading';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ConfirmationEmail from '@/screens/confirmation-email';
import { getThemeColor } from '@/utils/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  email?: string;
};

const ConfirmationEmailScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  const { email } = useLocalSearchParams<SearchParams>();

  if (!email) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ConfirmationEmail email={email} />
    </SafeAreaView>
  );
};

export default ConfirmationEmailScreen;

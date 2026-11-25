import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Abonnement from '@/screens/abonnement/abonnement';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const AbonnementScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Abonnement />
    </SafeAreaView>
  );
};

export default AbonnementScreen;

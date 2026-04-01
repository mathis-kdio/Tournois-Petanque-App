import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Accueil from '@/screens/accueil';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccueilScreen() {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Accueil />
    </SafeAreaView>
  );
}

import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Compte from '@/screens/compte';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompteScreen() {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Compte />
    </SafeAreaView>
  );
};

import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Parametres from '@/screens/parametres';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ParametresScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Parametres />
    </SafeAreaView>
  );
};

export default ParametresScreen;

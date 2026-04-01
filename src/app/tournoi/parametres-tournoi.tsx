import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ParametresTournoi from '@/screens/parametres-tournoi';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ParametresTournoiScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ParametresTournoi />
    </SafeAreaView>
  );
};

export default ParametresTournoiScreen;

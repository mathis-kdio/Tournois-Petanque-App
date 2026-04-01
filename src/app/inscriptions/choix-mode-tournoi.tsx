import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ChoixModeTournoi from '@/screens/choix-mode-tournoi';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChoixModeTournoiScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ChoixModeTournoi />
    </SafeAreaView>
  );
};

export default ChoixModeTournoiScreen;

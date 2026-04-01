import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import JoueursTournoi from '@/screens/joueurs-tournoi';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const JoueursTournoiScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <JoueursTournoi />
    </SafeAreaView>
  );
};

export default JoueursTournoiScreen;

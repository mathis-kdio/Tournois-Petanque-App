import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ChoixTypeTournoi from '@/screens/choix-type-tournoi';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChoixTypeTournoiScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ChoixTypeTournoi />
    </SafeAreaView>
  );
};

export default ChoixTypeTournoiScreen;

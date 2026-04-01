import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ListesJoueurs from '@/screens/listes-joueurs';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListesJoueursScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ListesJoueurs />
    </SafeAreaView>
  );
};

export default ListesJoueursScreen;

import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import ListeTournois from '@/screens/liste-tournois';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListeTournoisScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ListeTournois />
    </SafeAreaView>
  );
};

export default ListeTournoisScreen;

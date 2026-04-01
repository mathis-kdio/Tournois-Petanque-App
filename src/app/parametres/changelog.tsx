import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Changelog from '@/screens/changelog';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangelogScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Changelog />
    </SafeAreaView>
  );
};

export default ChangelogScreen;

import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Securite from '@/screens/securite';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const SecuriteScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Securite />
    </SafeAreaView>
  );
};

export default SecuriteScreen;

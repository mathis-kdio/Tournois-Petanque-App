import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import InfosPerso from '@/screens/infos-perso';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const InfosPersoScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <InfosPerso />
    </SafeAreaView>
  );
};

export default InfosPersoScreen;

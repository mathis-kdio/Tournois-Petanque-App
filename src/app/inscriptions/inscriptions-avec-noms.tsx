import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import InscriptionsAvecNoms from '@/screens/inscriptions-avec-noms';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const InscriptionsAvecNomsScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <InscriptionsAvecNoms />
    </SafeAreaView>
  );
};

export default InscriptionsAvecNomsScreen;

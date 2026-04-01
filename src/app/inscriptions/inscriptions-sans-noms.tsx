import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import InscriptionsSansNoms from '@/screens/inscriptions-sans-noms';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const InscriptionsSansNomsScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <InscriptionsSansNoms />
    </SafeAreaView>
  );
};

export default InscriptionsSansNomsScreen;

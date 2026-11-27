import Paywall from '@/screens/paywall';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaywallScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={{ flex: 1, backgroundColor: color }}
    >
      <Paywall />
    </SafeAreaView>
  );
};

export default PaywallScreen;

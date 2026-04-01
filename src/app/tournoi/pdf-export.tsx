import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import PDFExport from '@/screens/pdf-export';
import { getThemeColor } from '@/utils/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const PDFExportScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <PDFExport />
    </SafeAreaView>
  );
};

export default PDFExportScreen;

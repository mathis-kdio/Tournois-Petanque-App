import PDFExport from '@/screens/pdf-export';
import { SafeAreaView } from 'react-native-safe-area-context';

const PDFExportScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PDFExport />
    </SafeAreaView>
  );
};

export default PDFExportScreen;

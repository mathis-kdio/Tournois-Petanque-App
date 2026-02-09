import { SafeAreaView } from 'react-native-safe-area-context';
import PDFExport from '@/screens/pdf-export';

const PDFExportScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PDFExport />
    </SafeAreaView>
  );
};

export default PDFExportScreen;

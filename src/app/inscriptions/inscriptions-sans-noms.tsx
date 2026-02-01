import { SafeAreaView } from 'react-native-safe-area-context';
import InscriptionsSansNoms from '@/screens/inscriptions-sans-noms';

const InscriptionsSansNomsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InscriptionsSansNoms />
    </SafeAreaView>
  );
};

export default InscriptionsSansNomsScreen;

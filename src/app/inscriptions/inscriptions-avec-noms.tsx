import { SafeAreaView } from 'react-native-safe-area-context';
import InscriptionsAvecNoms from '@/screens/inscriptions-avec-noms';

const InscriptionsAvecNomsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InscriptionsAvecNoms />
    </SafeAreaView>
  );
};

export default InscriptionsAvecNomsScreen;

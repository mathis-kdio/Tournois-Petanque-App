import { SafeAreaView } from 'react-native-safe-area-context';
import Accueil from '@/screens/accueil';

export default function AccueilScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Accueil />
    </SafeAreaView>
  );
}

import { SafeAreaView } from 'react-native-safe-area-context';
import ChoixModeTournoi from '@/screens/choix-mode-tournoi';

const ChoixModeTournoiScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChoixModeTournoi />
    </SafeAreaView>
  );
};

export default ChoixModeTournoiScreen;

import { SafeAreaView } from 'react-native-safe-area-context';
import ChoixTypeTournoi from '@/screens/choix-type-tournoi';

const ChoixTypeTournoiScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChoixTypeTournoi />
    </SafeAreaView>
  );
};

export default ChoixTypeTournoiScreen;

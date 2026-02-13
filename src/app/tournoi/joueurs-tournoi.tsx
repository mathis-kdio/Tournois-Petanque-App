import JoueursTournoi from '@/screens/joueurs-tournoi';
import { SafeAreaView } from 'react-native-safe-area-context';

const JoueursTournoiScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <JoueursTournoi />
    </SafeAreaView>
  );
};

export default JoueursTournoiScreen;

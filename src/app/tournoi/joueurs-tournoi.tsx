import { SafeAreaView } from 'react-native-safe-area-context';
import JoueursTournoi from '@/screens/joueurs-tournoi';

const JoueursTournoiScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <JoueursTournoi />
    </SafeAreaView>
  );
};

export default JoueursTournoiScreen;

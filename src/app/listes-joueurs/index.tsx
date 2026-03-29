import ListesJoueurs from '@/screens/listes-joueurs';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListesJoueursScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ListesJoueurs />
    </SafeAreaView>
  );
};

export default ListesJoueursScreen;

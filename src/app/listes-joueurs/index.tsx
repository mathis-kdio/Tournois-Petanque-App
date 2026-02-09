import { SafeAreaView } from 'react-native-safe-area-context';
import ListesJoueurs from '@/screens/listes-joueurs';

const ListesJoueursScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ListesJoueurs />
    </SafeAreaView>
  );
};

export default ListesJoueursScreen;

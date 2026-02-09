import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/Loading';
import CreateListeJoueur from '@/screens/create-liste-joueurs';

type SearchParams = {
  type?: string;
  listId?: string;
};

const CreateListeJoueurScreen = () => {
  const param = useLocalSearchParams<SearchParams>();
  const { type, listId } = param;

  const idList = parseInt(listId ?? '');
  if (
    (type !== 'create' && type !== 'edit') ||
    (type === 'edit' && isNaN(idList))
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CreateListeJoueur type={type} idList={idList} />
    </SafeAreaView>
  );
};

export default CreateListeJoueurScreen;

import Loading from '@/components/Loading';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import CreateListeJoueur from '@/screens/create-liste-joueurs';
import { getThemeColor } from '@/utils/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  type?: string;
  listId?: string;
};

const CreateListeJoueurScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  const param = useLocalSearchParams<SearchParams>();
  const { type, listId } = param;

  const idList = parseInt(listId ?? '');
  if ((type !== 'create' && type !== 'edit') || isNaN(idList)) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <CreateListeJoueur type={type} idList={idList} />
    </SafeAreaView>
  );
};

export default CreateListeJoueurScreen;

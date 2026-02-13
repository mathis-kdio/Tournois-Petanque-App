import Loading from '@/components/Loading';
import ListeTerrains from '@/screens/liste-terrains';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  screenStackName?: string;
};

const ListeTerrainsScreen = () => {
  const param = useLocalSearchParams<SearchParams>();
  const { screenStackName } = param;

  if (
    screenStackName !== 'inscriptions-avec-noms' &&
    screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ListeTerrains screenStackName={screenStackName} />
    </SafeAreaView>
  );
};

export default ListeTerrainsScreen;

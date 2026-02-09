import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/Loading';
import GenerationMatchs from '../../screens/generation-matchs';

type SearchParams = {
  screenStackName?: string;
};

const GenerationMatchsScreen = () => {
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
      <GenerationMatchs screenStackName={screenStackName} />
    </SafeAreaView>
  );
};

export default GenerationMatchsScreen;

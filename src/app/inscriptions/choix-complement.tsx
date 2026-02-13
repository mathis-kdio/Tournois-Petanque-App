import Loading from '@/components/Loading';
import ChoixComplement from '@/screens/complement';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  screenStackName?: string;
};

const ChoixComplementScreen = () => {
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
      <ChoixComplement screenStackName={screenStackName} />
    </SafeAreaView>
  );
};

export default ChoixComplementScreen;

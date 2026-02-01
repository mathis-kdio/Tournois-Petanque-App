import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Loading from '@/components/Loading';
import OptionsTournoi from '@/screens/options-tournoi';

type SearchParams = {
  screenStackName?: string;
};

const OptionsTournoiScreen = () => {
  const param = useLocalSearchParams<SearchParams>();
  const { screenStackName } = param;
  if (
    screenStackName !== 'inscriptions-avec-noms' &&
    screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <OptionsTournoi screenStackName={screenStackName} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OptionsTournoiScreen;

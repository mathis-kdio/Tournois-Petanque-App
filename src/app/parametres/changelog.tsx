import Changelog from '@/screens/changelog';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangelogScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Changelog />
    </SafeAreaView>
  );
};

export default ChangelogScreen;

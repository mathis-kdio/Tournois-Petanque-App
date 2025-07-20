import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchParams = {
  email?: string;
};

const ConfirmationEmail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { email } = useLocalSearchParams<SearchParams>();

  if (!email) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('confirmation_email')} />
        <VStack className="px-10 justify-center items-center">
          <HStack className="justify-center">
            <MaterialCommunityIcons
              name="email-check-outline"
              size={128}
              className="text-custom-bg-inverse"
            />
          </HStack>
          <Text className="text-typography-white">
            {t('confirmation_email_text_1')}
          </Text>
          <Text className="text-typography-white">{email}</Text>
          <Text className="text-typography-white">
            {t('confirmation_email_text_2')}
          </Text>
          <Button onPress={() => router.navigate('/')} className="mt-2">
            <ButtonText>{t('retour_accueil')}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmationEmail;

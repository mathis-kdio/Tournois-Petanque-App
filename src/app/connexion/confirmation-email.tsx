import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

type ConfirmationEmailRouteProp = {
  params: {
    email: string;
  };
};

const ConfirmationEmail = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const route = useRoute<ConfirmationEmailRouteProp>();

  const email = route.params.email;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('confirmation_email')} />
        <VStack className="px-10 justify-center items-center">
          <HStack className="justify-center">
            <MaterialCommunityIcons
              name="email-check-outline"
              size={128}
              color="white"
            />
          </HStack>
          <Text className="text-white">{t('confirmation_email_text_1')}</Text>
          <Text className="text-white">{email}</Text>
          <Text className="text-white">{t('confirmation_email_text_2')}</Text>
          <Button
            onPress={() => navigation.navigate('accueil')}
            className="mt-2"
          >
            <ButtonText>{t('retour_accueil')}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmationEmail;

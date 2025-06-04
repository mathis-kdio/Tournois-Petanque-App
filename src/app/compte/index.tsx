import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase';
import { useTranslation } from 'react-i18next';
import Item from '@components/Item';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { LoaderIcon, TrashIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { useRouter } from 'expo-router';

const Compte = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const deconnexion = () => {
    supabaseClient.auth.signOut();
    router.navigate('');
  };

  const supprimerCompte = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('mon_compte')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack className="border border-white rounded-lg">
            <Item
              text={t('informations_personnelles')}
              action={() => router.navigate('/compte/infos-perso')}
              icon={'info-circle'}
              type={''}
              drapeau={undefined}
            />
            <Divider />
            <Item
              text={t('securite')}
              action={() => router.navigate('/compte/securite')}
              icon={'lock'}
              type={''}
              drapeau={undefined}
            />
          </VStack>
          <VStack space="xl" className="mt-5">
            <Button onPress={() => deconnexion()}>
              <ButtonText>{t('se_deconnecter')}</ButtonText>
            </Button>
            <Button isDisabled={true} onPress={() => undefined}>
              <ButtonIcon as={LoaderIcon} />
              <ButtonText className="ml-2">
                {t('forcer_synchronisation')}
              </ButtonText>
            </Button>
            <Button
              action="negative"
              isDisabled={true}
              onPress={() => supprimerCompte()}
            >
              <ButtonIcon as={TrashIcon} />
              <ButtonText className="ml-2">{t('supprimer_compte')}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Compte;

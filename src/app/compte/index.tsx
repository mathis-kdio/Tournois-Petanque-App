import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { LoaderIcon, TrashIcon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { VStack } from '@/components/ui/vstack';
import { supabaseClient } from '@/utils/supabase';
import { getThemeColor } from '@/utils/theme/theme';
import Item from '@components/Item';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const Compte = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  const { t } = useTranslation();
  const router = useRouter();

  const deconnexion = () => {
    supabaseClient.auth.signOut();
    router.navigate('');
  };

  const supprimerCompte = () => { };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('mon_compte')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack className="border border-custom-bg-inverse rounded-lg">
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

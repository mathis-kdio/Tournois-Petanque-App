import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { FontAwesome5 } from '@expo/vector-icons';
import { _openPlateformLink, _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { _adsConsentForm } from '../utils/adMob/consentForm';
import CardButton from '@components/buttons/CardButton';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { _requestTrackingPermissions } from '../utils/expoTrackingTransparency/requestTrackingPermission';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAuth } from '@/components/supabase/SessionProvider';
import { useNavigation, useRouter } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import Constants from 'expo-constants';

const googleMarketReviews =
  'market://details?id=com.MK.PetanqueGCU&showAllReviews=true';
const appleMarketReviews =
  'itms-apps://apps.apple.com/app/petanque-gcu/id1661710973?mt=8&action=write-review';
const mail = 'mailto:tournoispetanqueapp@gmail.com';
const gcuWebsite = 'https://www.gcu.asso.fr/';
const facebook = 'https://www.facebook.com/groups/tournoispetanqueapp';
const website = 'https://tournoispetanqueapp.fr/';

const Accueil = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const { session } = useAuth();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    // GOOGLE ADMOB
    if (Platform.OS === 'android') {
      _adsConsentForm(appState);
    } else if (Platform.OS === 'ios') {
      setTimeout(async () => {
        _requestTrackingPermissions(appState);
      }, 1000);
    }

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const _showMatchs = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'tournoi' }],
      }),
    );
  };

  const _buttonShowMatchs = () => {
    if (listeMatchs) {
      if (listeMatchs.length !== 0) {
        return (
          <CardButton
            text={t('reprendre_tournoi')}
            icons={['play']}
            navigate={() => _showMatchs()}
            newBadge={false}
          />
        );
      }
    } else {
      return (
        <Box className="bg-secondary-500 flex-1 items-center rounded-3xl py-5">
          <FontAwesome5
            name="play"
            className="text-custom-text-button"
            size={24}
          />
          <Text className="color-custom-text-button">{t('aucun_tournoi')}</Text>
        </Box>
      );
    }
  };

  const boutonConnexion = () => {
    if (session) {
      return (
        <Button
          className="bg-custom-dark-blue"
          onPress={() => router.navigate('/compte')}
        >
          <ButtonText>{t('mon_compte')}</ButtonText>
        </Button>
      );
    } else {
      return (
        <Button
          className="bg-custom-dark-blue"
          onPress={() => router.navigate('/connexion')}
        >
          <ButtonText>{t('authentification')}</ButtonText>
        </Button>
      );
    }
  };

  const version = Constants.expoConfig?.extra?.appVersion;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 px-5 bg-custom-background">
        <ScrollView className="h-1">
          <VStack space="4xl">
            <VStack className="items-end">{boutonConnexion()}</VStack>
            <VStack className="items-center">
              <Image
                size="xl"
                alt="Logo de l'application"
                source={require('@assets/icon.png')}
              />
            </VStack>
            <VStack space="md">
              <HStack>{_buttonShowMatchs()}</HStack>
              <HStack>
                <CardButton
                  text={t('nouveau_tournoi')}
                  icons={['plus']}
                  navigate={() =>
                    router.navigate('/inscriptions/choix-type-tournoi')
                  }
                  newBadge={false}
                />
              </HStack>
              <HStack space="sm">
                <CardButton
                  text={t('mes_anciens_tournois')}
                  icons={['list']}
                  navigate={() => router.navigate('/liste-tournois')}
                  newBadge={false}
                />
                <CardButton
                  text={t('mes_listes_joueurs')}
                  icons={['users']}
                  navigate={() => router.navigate('/listes-joueurs')}
                  newBadge={false}
                />
              </HStack>
            </VStack>
            <VStack space="sm">
              <HStack space="sm" className="justify-center">
                <Pressable
                  onPress={() => _openURL(facebook)}
                  className="items-center bg-custom-dark-blue rounded-3xl p-3"
                >
                  <FontAwesome5
                    name="facebook"
                    className="text-custom-text-button"
                    size={20}
                  />
                  <Text className="color-custom-text-button">
                    {t('rejoindre_page_fb')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => _openURL(website)}
                  className="items-center bg-custom-dark-blue rounded-3xl p-3"
                >
                  <FontAwesome5
                    name="globe"
                    className="text-custom-text-button"
                    size={20}
                  />
                  <Text className="color-custom-text-button">
                    {t('voir_website')}
                  </Text>
                </Pressable>
              </HStack>
              <HStack space="sm" className="justify-center">
                <Pressable
                  onPress={() =>
                    _openPlateformLink(googleMarketReviews, appleMarketReviews)
                  }
                  className="flex-1 items-center bg-custom-dark-blue rounded-3xl p-2"
                >
                  <FontAwesome5
                    name="star"
                    className="text-custom-text-button"
                    size={20}
                  />
                </Pressable>
                <Pressable
                  onPress={() => _openURL(encodeURI(mail))}
                  className="flex-1 items-center bg-custom-dark-blue rounded-3xl p-2"
                >
                  <FontAwesome5
                    name="envelope"
                    className="text-custom-text-button"
                    size={20}
                  />
                </Pressable>
                <Pressable
                  onPress={() => router.navigate('/parametres')}
                  className="flex-1 items-center bg-custom-dark-blue rounded-3xl p-2"
                >
                  <FontAwesome5
                    name="wrench"
                    className="text-custom-text-button"
                    size={20}
                  />
                </Pressable>
              </HStack>
              <HStack className="justify-center">
                <Pressable
                  onPress={() => _openURL(gcuWebsite)}
                  className="items-center bg-custom-dark-blue rounded-3xl p-3"
                >
                  <Text className="color-custom-text-button text-md">
                    {t('decouvrir_gcu')}
                  </Text>
                </Pressable>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
        <VStack>
          <Text className="text-center text-typography-white text-md">
            {t('developpe_par')} Mathis Cadio
          </Text>
          <Text className="text-center text-typography-white text-md">
            {t('version')} {version}
          </Text>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default Accueil;

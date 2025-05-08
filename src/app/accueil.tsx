import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React from 'react';
import { expo } from '../../app.json';
import { FontAwesome5 } from '@expo/vector-icons';
import { _openPlateformLink, _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { _adsConsentForm } from '../utils/adMob/consentForm';
import { withTranslation } from 'react-i18next';
import CardButton from '@components/buttons/CardButton';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { _requestTrackingPermissions } from '../utils/expoTrackingTransparency/requestTrackingPermission';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { Session } from '@supabase/supabase-js';
import { withSession } from '@/components/supabase/withSession';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  session: Session | null;
}

interface State {
  appState: AppStateStatus;
}

const googleMarketReviews =
  'market://details?id=com.MK.PetanqueGCU&showAllReviews=true';
const appleMarketReviews =
  'itms-apps://apps.apple.com/app/petanque-gcu/id1661710973?mt=8&action=write-review';
const mail = 'mailto:tournoispetanqueapp@gmail.com';
const gcuWebsite = 'https://www.gcu.asso.fr/';
const facebook = 'https://www.facebook.com/groups/tournoispetanqueapp';
const website = 'https://tournoispetanqueapp.fr/';

class Accueil extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      appState: 'active',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', (nextAppState) =>
      this.setState({ appState: nextAppState }),
    );

    //GOOGLE ADMOB
    if (Platform.OS === 'android') {
      _adsConsentForm(this.state.appState);
    } else if (Platform.OS === 'ios') {
      setTimeout(async () => {
        _requestTrackingPermissions(this.state.appState);
      }, 1000);
    }
  }

  _showMatchs() {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'ListeMatchsStack' }],
    });
  }

  _navigate(name: string) {
    this.props.navigation.navigate(name);
  }

  _buttonShowMatchs() {
    const { t } = this.props;
    if (this.props.listeMatchs) {
      if (this.props.listeMatchs.length !== 0) {
        return (
          <CardButton
            text={t('reprendre_tournoi')}
            icons={['play']}
            navigate={() => this._showMatchs()}
            newBadge={false}
          />
        );
      }
    } else {
      return (
        <Box className="bg-secondary-500 flex-1 items-center rounded-3xl py-5">
          <FontAwesome5 name="play" color="white" size={24} />
          <Text className="text-white">{t('aucun_tournoi')}</Text>
        </Box>
      );
    }
  }

  boutonConnexion() {
    const { t, session } = this.props;
    if (session) {
      return (
        <Button
          onPress={() =>
            this.props.navigation.navigate('ConnexionStack', {
              screen: 'Compte',
            })
          }
        >
          <ButtonText>{t('mon_compte')}</ButtonText>
        </Button>
      );
    } else {
      return (
        <Button
          onPress={() => this.props.navigation.navigate('ConnexionStack')}
        >
          <ButtonText>{t('authentification')}</ButtonText>
        </Button>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 px-5 bg-[#0594ae]">
          <ScrollView className="h-1">
            <VStack space="4xl">
              <VStack className="items-end">{this.boutonConnexion()}</VStack>
              <VStack className="items-center">
                <Image
                  size="xl"
                  alt="Logo de l'application"
                  source={require('@assets/icon.png')}
                />
              </VStack>
              <VStack space="md">
                <HStack>{this._buttonShowMatchs()}</HStack>
                <HStack>
                  <CardButton
                    text={t('nouveau_tournoi')}
                    icons={['plus']}
                    navigate={() => this._navigate('InscriptionStack')}
                    newBadge={false}
                  />
                </HStack>
                <HStack space="sm">
                  <CardButton
                    text={t('mes_anciens_tournois')}
                    icons={['list']}
                    navigate={() => this._navigate('ListeTournois')}
                    newBadge={false}
                  />
                  <CardButton
                    text={t('mes_listes_joueurs')}
                    icons={['users']}
                    navigate={() => this._navigate('ListesJoueurs')}
                    newBadge={false}
                  />
                </HStack>
              </VStack>
              <VStack space="sm">
                <HStack space="sm" className="justify-center">
                  <Pressable
                    onPress={() => _openURL(facebook)}
                    className="items-center bg-[#1c3969] rounded-3xl p-3"
                  >
                    <FontAwesome5 name="facebook" color="white" size={20} />
                    <Text className="text-white">{t('rejoindre_page_fb')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => _openURL(website)}
                    className="items-center bg-[#1c3969] rounded-3xl p-3"
                  >
                    <FontAwesome5 name="globe" color="white" size={20} />
                    <Text className="text-white">{t('voir_website')}</Text>
                  </Pressable>
                </HStack>
                <HStack space="sm" className="justify-center">
                  <Pressable
                    onPress={() =>
                      _openPlateformLink(
                        googleMarketReviews,
                        appleMarketReviews,
                      )
                    }
                    className="flex-1 items-center bg-[#1c3969] rounded-3xl p-2"
                  >
                    <FontAwesome5 name="star" color="white" size={20} />
                  </Pressable>
                  <Pressable
                    onPress={() => _openURL(encodeURI(mail))}
                    className="flex-1 items-center bg-[#1c3969] rounded-3xl p-2"
                  >
                    <FontAwesome5 name="envelope" color="white" size={20} />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      this.props.navigation.navigate('ParametresStack')
                    }
                    className="flex-1 items-center bg-[#1c3969] rounded-3xl p-2"
                  >
                    <FontAwesome5 name="wrench" color="white" size={20} />
                  </Pressable>
                </HStack>
                <HStack className="justify-center">
                  <Pressable
                    onPress={() => _openURL(gcuWebsite)}
                    className="items-center bg-[#1c3969] rounded-3xl p-3"
                  >
                    <Text className="text-white text-md">
                      {t('decouvrir_gcu')}
                    </Text>
                  </Pressable>
                </HStack>
              </VStack>
            </VStack>
          </ScrollView>
          <VStack>
            <Text className="text-center text-white text-md">
              {t('developpe_par')} Mathis Cadio
            </Text>
            <Text className="text-center text-white text-md">
              {t('version')} {expo.version}
            </Text>
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withSession(withTranslation()(Accueil)));

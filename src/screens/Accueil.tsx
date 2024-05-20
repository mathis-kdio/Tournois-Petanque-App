import React from 'react';
import { expo } from '../../app.json';
import { FontAwesome5 } from '@expo/vector-icons';
import { _openPlateformLink, _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, HStack, VStack, Text, Pressable, Image, ScrollView, Button, ButtonText } from '@gluestack-ui/themed';
import { _adsConsentForm } from '../utils/adMob/consentForm'
import { withTranslation } from 'react-i18next';
import CardButton from '@components/buttons/CardButton';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { _requestTrackingPermissions } from '../utils/expoTrackingTransparency/requestTrackingPermission';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { supabase } from '@/utils/supabase';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  googleMarket: string;
  appleMarket: string;
  googleMarketReviews: string;
  appleMarketReviews: string;
  mail: string;
  gcuWebsite: string;
  facebook: string;
  website: string;
}

interface State {
  appState: AppStateStatus;
  session: Session;
}

class Accueil extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    props.googleMarket =         "market://details?id=com.MK.PetanqueGCU'";
    props.appleMarket =          "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973";
    props.googleMarketReviews =  "market://details?id=com.MK.PetanqueGCU&showAllReviews=true";
    props.appleMarketReviews =   "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973?mt=8&action=write-review"
    props.mail =                 "mailto:tournoispetanqueapp@gmail.com";
    props.gcuWebsite =           "https://www.gcu.asso.fr/";
    props.facebook =             "https://www.facebook.com/groups/tournoispetanqueapp";
    props.website =              "https://tournoispetanqueapp.fr/";
    this.state = {
      appState: "active"
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", nextAppState => this.setState({ appState: nextAppState }));

    //GOOGLE ADMOB
    if (Platform.OS === 'android') {
      _adsConsentForm(this.state.appState);
    } else if (Platform.OS === 'ios') {
      setTimeout(async () => {
        _requestTrackingPermissions(this.state.appState);
      }, 1000);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      this.setState({session: session});
    })
  }

  _showMatchs() {
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsStack'
      }]
    });
  }

  _navigate(name: string) {
    this.props.navigation.navigate(name);
  }

  _buttonShowMatchs() {
    const { t } = this.props;
    if (this.props.listeMatchs) {
      if (this.props.listeMatchs.length != 0) {
        return (
          <CardButton
            text={t("reprendre_tournoi")}
            icon="play"
            navigate={() => this._showMatchs()}
            newBadge={false}
          />
        ) 
      }
    }
    else {
      <Box bg='$secondary500' flex={1} alignItems='center' rounded={'$3xl'} py={"$5"}>
        <FontAwesome5 name="play" color='white' size={24}/>
        <Text color='$white'>{t("aucun_tournoi")}</Text>
      </Box>
    }
  }

  boutonConnexion() {
    const { t } = this.props;
    if (this.state.session) {
      return (
        <Button onPress={() => this.props.navigation.navigate('ConnexionStack', { screen: 'Compte' })}>
          <ButtonText>{t("mon_compte")}</ButtonText>
        </Button>
      )
    }
    else {
      return (
        <Button onPress={() => this.props.navigation.navigate('ConnexionStack')}>
          <ButtonText>{t("authentification")}</ButtonText>
        </Button>
      )
    }
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} px={'$5'} bgColor='#0594ae'>
          <ScrollView height={'$1'}>
            <VStack space='4xl'>
              <VStack alignItems='flex-end'>
                {this.boutonConnexion()}
              </VStack>              
              <VStack alignItems='center'>
                <Image
                  size='xl'
                  alt="Logo de l'application"
                  source={require('@assets/icon.png')}/>
              </VStack>
              <VStack space='md'>
                <HStack>
                  {this._buttonShowMatchs()}
                </HStack>
                <HStack>
                  <CardButton
                    text={t("nouveau_tournoi")}
                    icon="plus"
                    navigate={() => this._navigate('InscriptionStack')}
                    newBadge={false}
                  />
                </HStack>
                <HStack space='sm'>
                  <CardButton
                    text={t("mes_anciens_tournois")}
                    icon="list"
                    navigate={() => this._navigate('ListeTournois')}
                    newBadge={false}
                  />
                  <CardButton
                    text={t("mes_listes_joueurs")}
                    icon="users"
                    navigate={() => this._navigate('ListesJoueurs')}
                    newBadge={false}
                  />
                </HStack> 
              </VStack>
              <VStack space='sm'>
                <HStack space='sm' justifyContent='center'>
                  <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.props.facebook)}>
                    <FontAwesome5 name="facebook" color='white' size={20}/>
                    <Text color='$white'>{t("rejoindre_page_fb")}</Text>
                  </Pressable>
                  <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.props.website)}>
                    <FontAwesome5 name="globe" color='white' size={20}/>
                    <Text color='$white'>{t("voir_website")}</Text>
                  </Pressable>
                </HStack>
                <HStack space='sm' justifyContent='center'>
                  <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => _openPlateformLink(this.props.googleMarketReviews, this.props.appleMarketReviews)}>
                    <FontAwesome5 name="star" color='white' size={20}/>
                  </Pressable>
                  <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => _openURL(this.props.mail)}>
                    <FontAwesome5 name="envelope" color='white' size={20}/>
                  </Pressable>
                  <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => this.props.navigation.navigate('ParametresStack')}>
                    <FontAwesome5 name="wrench" color='white' size={20}/>
                  </Pressable>
                </HStack>
                <HStack justifyContent='center'>
                  <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.props.gcuWebsite)}>
                    <Text color='$white' fontSize={'$md'}>{t("decouvrir_gcu")}</Text>
                  </Pressable>
                </HStack>
              </VStack>
            </VStack>
          </ScrollView>
          <VStack>
            <Text textAlign='center' color='$white' fontSize={'$md'}>{t("developpe_par")} Mathis Cadio</Text>
            <Text textAlign='center' color='$white' fontSize={'$md'}>{t("version")} {expo.version}</Text>
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

export default connector(withTranslation()(Accueil))
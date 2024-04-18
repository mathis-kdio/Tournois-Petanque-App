import React from 'react';
import { expo } from '../../app.json';
import { connect } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import { _openPlateformLink, _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, HStack, VStack, Text, Pressable, Modal, Image, ModalHeader, ModalBody, ModalContent, ModalCloseButton, Heading, CloseIcon, ModalBackdrop, ScrollView } from '@gluestack-ui/themed';
import { _adsConsentForm } from '../utils/adMob/consentForm'
import { withTranslation } from 'react-i18next';
import CardButton from '@components/buttons/CardButton';
import { AppState, Platform } from 'react-native';
import { _requestTrackingPermissions } from '../utils/expoTrackingTransparency/requestTrackingPermission';

class Accueil extends React.Component {
  constructor(props) {
    super(props)
    this.googleMarket =         "market://details?id=com.MK.PetanqueGCU'";
    this.appleMarket =          "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973";
    this.googleMarketReviews =  "market://details?id=com.MK.PetanqueGCU&showAllReviews=true";
    this.appleMarketReviews =   "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973?mt=8&action=write-review"
    this.mail =                 "mailto:tournoispetanqueapp@gmail.com";
    this.gcuWebsite =           "https://www.gcu.asso.fr/";
    this.facebook =             "https://www.facebook.com/groups/tournoispetanqueapp";
    this.website =              "https://tournoispetanqueapp.fr/";
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
  }

  _showMatchs() {
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsStack'
      }]
    });
  }

  _navigate(name) {
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

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae' px={'$5'} justifyContent='space-between'>
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
              <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.facebook)}>
                <FontAwesome5 name="facebook" color='white' size={20}/>
                <Text color='$white'>{t("rejoindre_page_fb")}</Text>
              </Pressable>
              <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.website)}>
                <FontAwesome5 name="globe" color='white' size={20}/>
                <Text color='$white'>{t("voir_website")}</Text>
              </Pressable>
            </HStack>
            <HStack space='sm' justifyContent='center'>
              <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => _openPlateformLink(this.googleMarketReviews, this.appleMarketReviews)}>
                <FontAwesome5 name="star" color='white' size={20}/>
              </Pressable>
              <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => _openURL(this.mail)}>
                <FontAwesome5 name="envelope" color='white' size={20}/>
              </Pressable>
              <Pressable flex={1} alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$2'} onPress={() => this.props.navigation.navigate('Parametres')}>
                <FontAwesome5 name="wrench" color='white' size={20}/>
              </Pressable>
            </HStack>
            <HStack justifyContent='center'>
              <Pressable alignItems='center' bg='#1c3969' rounded={'$3xl'} p={'$3'} onPress={() => _openURL(this.gcuWebsite)}>
                <Text color='$white' fontSize={'$md'}>{t("decouvrir_gcu")}</Text>
              </Pressable>
            </HStack>
            <VStack>
              <Text textAlign='center' color='$white' fontSize={'$md'}>{t("developpe_par")} Mathis Cadio</Text>
              <Text textAlign='center' color='$white' fontSize={'$md'}>{t("version")} {expo.version}</Text>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(Accueil))
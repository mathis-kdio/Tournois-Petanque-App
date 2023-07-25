import React from 'react';
import { expo } from '../../app.json';
import { connect } from 'react-redux';
import * as NavigationBar from 'expo-navigation-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import VersionCheck from 'react-native-version-check-expo';
import { _openPlateformLink, _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, HStack, VStack, Text, Pressable, Spacer, Modal, Image } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import CardButton from 'components/buttons/CardButton';

class Accueil extends React.Component {
  constructor(props) {
    super(props)
    this.googleMarket =         "market://details?id=com.MK.PetanqueGCU'";
    this.appleMarket =          "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973";
    this.googleMarketReviews =  "market://details?id=com.MK.PetanqueGCU&showAllReviews=true";
    this.appleMarketReviews =   "itms-apps://apps.apple.com/app/petanque-gcu/id1661710973?mt=8&action=write-review"
    this.mail =                 "mailto: tournoispetanqueapp@gmail.com";
    this.gcuWebsite =           "https://www.gcu.asso.fr/";
    this.githubSponsor =        "https://github.com/sponsors/mathis-kdio";
    this.patreon =              "https://patreon.com/tournoipetanque";
    this.buymeacoffee =         "https://www.buymeacoffee.com/tournoipetanque";
    this.facebook =             "https://www.facebook.com/groups/tournoisptanqueapp";
    this.state = {
      modalDonsVisible: false,
      modalVisible: false
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#0594ae");
    }
    VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded && this.state.modalVisible != true) {
        this.setState({modalVisible: true});
      }
    })

    if (Platform.OS === 'android') {
      this._adsConsentForm();
    }
    else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(async result => {
        if (result === RESULTS.DENIED) {
          request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(async res => {
            if (res === RESULTS.GRANTED) {
              this._adsConsentForm();
            }
          });
        }
        else if (result === RESULTS.GRANTED) {
          this._adsConsentForm();
        }
      })
    }
  }

  _adsConsentForm() {
    AdsConsent.requestInfoUpdate().then(async consentInfo => {
      if (consentInfo.isConsentFormAvailable && (consentInfo.status === AdsConsentStatus.UNKNOWN || consentInfo.status === AdsConsentStatus.REQUIRED)) {
        AdsConsent.showForm().then(async res => {
          if (res.status === AdsConsentStatus.OBTAINED) {
            mobileAds().initialize().then(async adapterStatuses => {console.log(adapterStatuses)});
          }
        });
      }
    });
  }

  componentDidUpdate() {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#0594ae");
    }
  }

  _showUpdateModal() {
    return (
      <Modal
        isOpen={this.state.modalVisible}
        onClose={() => this.setState({ modalVisible: false })}
      >
        <Modal.Content>
          <Modal.CloseButton/>
          <Modal.Header>Mise à jour</Modal.Header>
          <Modal.Body>
            <Text textAlign={"center"}>Une nouvelle version de l'application est disponible !</Text>
            <Text textAlign={"center"}>Si elle n'apparait pas encore, réessayer plus tard</Text>
            <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p={3} onPress={() => _openPlateformLink(this.googleMarket, this.appleMarket)}>
              <HStack>
                <FontAwesome5 name="download" color="white" size={20}/>
                <Text color={"white"}> Mettre à jour</Text>
              </HStack>
            </Pressable>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

  _showDonsModal() {
    return (
      <Modal
        isOpen={this.state.modalDonsVisible}
        onClose={() => this.setState({ modalDonsVisible: false })}
      >
        <Modal.Content>
          <Modal.CloseButton/>
          <Modal.Header>Pour Soutenir</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p={3} onPress={() => _openURL(this.githubSponsor)}>
                <HStack>
                  <FontAwesome5 name="github" color="white" size={20}/>
                  <Text color={"white"}> GitHub Sponsor</Text>
                </HStack>
              </Pressable>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p={3} onPress={() => _openURL(this.patreon)}>
                <HStack>
                  <FontAwesome5 name="patreon" color="white" size={20}/>
                  <Text color={"white"}> Patreon</Text>
                </HStack>
              </Pressable>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p={3} onPress={() => _openURL(this.buymeacoffee)}>
                <HStack>
                  <FontAwesome5 name="coffee" color="white" size={20}/>
                  <Text color={"white"}> BuyMeACoffee</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
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
    if (this.props.listeMatchs) {
      if (this.props.listeMatchs.length != 0) {
        return (
          <CardButton
            text="Reprendre le tournoi"
            icon="play"
            navigate={() => this._showMatchs()}
          />
        ) 
      }
    }
    else {
      <Box bg="gray.500" flex={1} space="1" alignItems={"center"} rounded="3xl" py={"5"}>
        <FontAwesome5 name="play" color="white" size={24}/>
        <Text color={"white"}>Pas de tournoi en cours</Text>
      </Box>
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" px="10" bgColor={"#0594ae"}>
          <VStack alignItems={"center"}>
            <Image size={"xl"} alt="Logo de l'application" source={require('@assets/icon.png')}/>
          </VStack>
          <Spacer/>
          <VStack space={"3"}>
            <HStack>
              {this._buttonShowMatchs()}
            </HStack>
            <HStack>
              <CardButton
                text="Nouveau Tournoi"
                icon="plus"
                navigate={() => this._navigate('InscriptionStack')}
              />
            </HStack>
            <HStack space={"3"}>
              <CardButton
                text="Mes anciens tournois"
                icon="list"
                navigate={() => this._navigate('ListeTournois')}
              />
              <CardButton
                text="Mes listes de joueurs"
                icon="users"
                navigate={() => this._navigate('ListesJoueurs')}
              />
            </HStack> 
          </VStack>
          <Spacer/>
          <VStack space={3}>
            <HStack>
              <Spacer/>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p={3} onPress={() => _openURL(this.facebook)}>
                <FontAwesome5 name="facebook" color="white" size={20}/>
                <Text color={"white"}>Rejoindre la page</Text>
              </Pressable>
              <Spacer/>
            </HStack>
            <HStack space={3}>
              {Platform.OS !== 'ios' && <>
                <Pressable flex={1} alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => this.setState({ modalDonsVisible: true })}>
                  <FontAwesome5 name="euro-sign" color="white" size={20}/>
                </Pressable>
              </>}
              <Pressable flex={1} alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => _openPlateformLink(this.googleMarketReviews, this.appleMarketReviews)}>
                <FontAwesome5 name="star" color="white" size={20}/>
              </Pressable>
              <Pressable flex={1} alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => _openURL(this.mail)}>
                <FontAwesome5 name="envelope" color="white" size={20}/>
              </Pressable>
              <Pressable flex={1} alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => this.props.navigation.navigate('Parametres')}>
                <FontAwesome5 name="wrench" color="white" size={20}/>
              </Pressable>
            </HStack>
            <HStack justifyContent={"center"}>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p="3" onPress={() => _openURL(this.gcuWebsite)}>
                <Text color={"white"} fontSize={16}>Découvrir le GCU</Text>
              </Pressable>
            </HStack>
            <VStack>
              <Text textAlign={"center"} color={"white"} fontSize={"md"}>Développé par Mathis Cadio</Text>
              <Text textAlign={"center"} color={"white"} fontSize={"md"}>Version: {expo.version}</Text>
            </VStack>
          </VStack>
          {this._showDonsModal()}
          {this._showUpdateModal()}
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(Accueil)
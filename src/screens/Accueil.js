import React from 'react'
import { StyleSheet, View, Button, Image, Modal } from 'react-native'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import * as NavigationBar from 'expo-navigation-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import VersionCheck from 'react-native-version-check-expo';
import { _openPlateformLink, _openURL } from '@utils/link'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, HStack, VStack, Text, Pressable, Spacer } from 'native-base';
import { StatusBar } from 'expo-status-bar';

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
    NavigationBar.setBackgroundColorAsync("#0594ae");
    VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded && this.state.modalVisible != true) {
        this.setState({modalVisible: true})
      }
    })
  }

  componentDidUpdate() {
    NavigationBar.setBackgroundColorAsync("#0594ae");
  }

  _showUpdateModal() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setState({modalVisible: !this.state.modalVisible}) }}
        >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Une mise à jour de l'application est disponible. (Elle peut ne pas encore apparaitre dans play store.)</Text>
            <View style={styles.buttonView}>
              <Button color="green" title='Mettre à jour' onPress={() => _openPlateformLink(this.googleMarket, this.appleMarket) }/>
            </View>
            <View style={styles.buttonView}>
              <Button color="red" title='Fermer' onPress={() => this.setState({modalVisible: !this.state.modalVisible}) }/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    )
  }

  _showDonsModal() {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.modalDonsVisible}
      onRequestClose={() => {
        this.setState({ modalDonsVisible: false })
      }}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Il est possible de soutenir le développement de l'application de différentes façons :</Text>
            <View style={styles.buttonViewCreate}>
              <FontAwesome5.Button name="github" backgroundColor="#1c3969" onPress={() => _openURL(this.githubSponsor)}>GitHub Sponsor</FontAwesome5.Button>
            </View>
            <View style={styles.buttonViewCreate}>
              <FontAwesome5.Button name="patreon" backgroundColor="#1c3969" onPress={() => _openURL(this.patreon)}>Patreon</FontAwesome5.Button>
            </View>
            <View style={styles.buttonViewCreate}>
              <FontAwesome5.Button name="coffee" backgroundColor="#1c3969" onPress={() => _openURL(this.buymeacoffee)}>BuyMeACoffee</FontAwesome5.Button>
            </View>
            <View style={styles.buttonView}>
              <Button color="red" title='Fermer' onPress={() => this.setState({modalDonsVisible: false}) }/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  _showMatchs() {
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsInscription'
      }],
    });
  }

  _navigate(name) {
    this.props.navigation.navigate(name);
  }

  _buttonShowMatchs() {
    if(this.props.listeMatchs) {
      if (this.props.listeMatchs.length != 0) {
        return (
          <Pressable bg="#1c3969" flex={1} space="1" alignItems={"center"} rounded="3xl" py={"5"} onPress={() => this._showMatchs()}>
            <FontAwesome5 name="play" color="white" size={24}/>
            <Text color={"white"}>Reprendre le tournoi</Text>
          </Pressable>
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
            <Image style={styles.logo} source={require('@assets/icon.png')}/>
          </VStack>
          <VStack space={"3"}>
            <HStack>
              {this._buttonShowMatchs()}
            </HStack>
            <HStack>
              <Pressable bg="#1c3969" flex={1} space="1" alignItems={"center"} rounded="3xl" py={"5"} onPress={() => this._navigate('ChoixTypeTournoi')}>
                <FontAwesome5 name="plus" color="white" size={24}/>
                <Text color={"white"}>Nouveau Tournoi</Text>
              </Pressable>
            </HStack>
            <HStack space={"3"}>
              <Pressable bg="#1c3969" flex={1} space="1" alignItems={"center"} rounded="3xl" py={"5"} onPress={() => this._navigate('ListeTournois')}>
                <FontAwesome5 name="list" color="white" size={24}/>
                <Text color={"white"}>Mes anciens tournois</Text>
              </Pressable>
              <Pressable bg="#1c3969" flex={1} space="1" alignItems={"center"} rounded="3xl" py={"5"} onPress={() => this._navigate('ListesJoueurs')}>
                <FontAwesome5 name="users" color="white" size={24}/>
                <Text color={"white"}>Mes listes de joueurs</Text>
              </Pressable>
            </HStack> 
          </VStack>
          <Spacer/>
          <VStack space={3}>
            <HStack>
              <Spacer/>
              <Pressable  alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => _openURL(this.facebook)}>
                <FontAwesome5 name="facebook" color="white" size={20}/>
                <Text color={"white"}>Rejoindre la page</Text>
              </Pressable>
              <Spacer/>
            </HStack>
            <Spacer/>
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
              <Pressable flex={1} alignItems={"center"} bg="#1c3969" rounded="3xl" p="2" onPress={() => this.props.navigation.navigate('Changelog')}>
                <FontAwesome5 name="wrench" color="white" size={20}/>
              </Pressable>
            </HStack>
          </VStack>
          <Spacer/>
          <VStack alignItems={"center"}>
            <HStack>
              <Pressable alignItems={"center"} bg="#1c3969" rounded="3xl" p="3" onPress={() => _openURL(this.gcuWebsite)}>
                <Text color={"white"} fontSize={16}>Découvrir le GCU</Text>
              </Pressable>
            </HStack>
            <Text style={styles.create_text}>Développé par Mathis Cadio</Text>
            <Text style={styles.create_text}>Version: {expo.version}</Text>
          </VStack>
          {this._showDonsModal()}
          {this._showUpdateModal()}
        </VStack>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  logo_container: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200
  },
  body_container : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonView: {
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  informations_container: {
    alignItems: 'center',
    paddingLeft: '1%',
    paddingRight: '1%'
  },
  informations_texte: {
    fontSize: 20,
    textAlign: "justify",
    color: 'white'
  },
  create_container: {
    alignItems: 'center',
  },
  create_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonViewCreate: {
    flexDirection: 'row',
    marginBottom: 10
  },
  footer_container: {
    alignItems: 'center',
  },
})

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(Accueil)
import React from 'react'
import { StyleSheet, View, Text, Button, Image, Modal } from 'react-native'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import * as NavigationBar from 'expo-navigation-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import VersionCheck from 'react-native-version-check-expo';
import { _openPlateformLink, _openURL } from '@utils/link'

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
        return <Button color="#1c3969" title='Reprendre le tournoi' onPress={() => this._showMatchs()}/>
      }
    }
    else {
      return <Button color="#1c3969" disabled title='Pas de tournoi en cours'/>
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.logo_container}>
          <Image style={styles.logo} source={require('@assets/icon.png')}/>
        </View>
        <View style={styles.body_container}>
          <View style={styles.menu_container}>
            <View style={styles.buttonView}>
              {this._buttonShowMatchs()}
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Nouveau tournoi' onPress={() => this._navigate('ChoixTypeTournoi')}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Mes anciens tournois' onPress={() => this._navigate('ListeTournois')}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Mes listes de joueurs' onPress={() => this._navigate('ListesJoueurs')}/>
            </View>
          </View>
          <View style={styles.informations_container}>
            <Text style={styles.informations_texte}>Fonctionnalités :</Text>
            <Text style={styles.informations_texte}>Mêlée-démêlée - Coupe - Championnat</Text>
            <Text style={styles.informations_texte}>Tête à Tête - Doublettes - Triplettes</Text>
            <Text style={styles.informations_texte}>Avec ou Sans Equipes</Text>
            <Text style={styles.informations_texte}>Avec ou Sans Noms</Text>
          </View>
        </View>
        <View style={styles.create_container}>
          <View style={styles.buttonViewCreate}>
            {Platform.OS !== 'ios' && <>
              <View style={styles.buttonView}>
                <FontAwesome5.Button name="euro-sign" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => this.setState({ modalDonsVisible: true })}/>
              </View>
            </>}
            <View style={styles.buttonView}>
              <FontAwesome5.Button name="star" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}}  onPress={() => _openPlateformLink(this.googleMarketReviews, this.appleMarketReviews) }/>
            </View>
            <View style={styles.buttonView}>
              <FontAwesome5.Button name="envelope" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => _openURL(this.mail)}/>
            </View>
            <View style={styles.buttonView}>
              <FontAwesome5.Button name="wrench" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => this.props.navigation.navigate('Changelog')}/>
            </View>
            <View style={styles.buttonView}>
              <FontAwesome5.Button name="facebook" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => _openURL(this.facebook)}/>
            </View>
          </View>
        </View> 
        <View style={styles.footer_container}>
          <Button color="#1c3969" title='Découvrir le GCU' onPress={() => _openURL(this.gcuWebsite)}/>
          <Text style={styles.create_text}>Par Mathis Cadio</Text>
          <Text style={styles.create_text}>Version: {expo.version}</Text>
        </View>
        {this._showDonsModal()}
        {this._showUpdateModal()}
      </View>
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
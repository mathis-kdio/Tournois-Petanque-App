import React from 'react'
import { StyleSheet, View, Text, Button, Image, Modal } from 'react-native'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import * as Linking from 'expo-linking'
import * as NavigationBar from 'expo-navigation-bar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as VersionCheck from 'react-native-version-check-expo';

class Accueil extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalDonsVisible: false,
      modalVisible: false
    }
  }

  componentDidMount() {
    NavigationBar.setBackgroundColorAsync("#0594ae");
    console.log(VersionCheck.getPackageName());
    /*VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded && this.state.modalVisible != true) {
        this.setState({modalVisible: true})
      }
    })*/
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
            <Text style={modalStyles.modalText}>Une mise à jour de l'application est disponible. Elle peut ne pas encore apparaitre dans play store.</Text>
            <View style={styles.buttonView}>
              <Button color="green" title='Mettre à jour' onPress={() => Linking.canOpenURL('market://details?id=com.MK.PetanqueGCU').then(supported => {if (supported) {Linking.openURL('market://details?id=com.MK.PetanqueGCU')}} ) }/>
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
              <MaterialCommunityIcon.Button name="github" backgroundColor="#1c3969" onPress={() => Linking.canOpenURL('https://github.com/sponsors/mathis-kdio').then(supported => {if (supported) {Linking.openURL('https://github.com/sponsors/mathis-kdio')}})}>GitHub Sponsor</MaterialCommunityIcon.Button>
            </View>
            <View style={styles.buttonViewCreate}>
              <MaterialCommunityIcon.Button name="patreon" backgroundColor="#1c3969" onPress={() => Linking.canOpenURL('https://www.gcu.asso.fr/').then(supported => {if (supported) {Linking.openURL('https://patreon.com/tournoipetanque')}})}>Patreon</MaterialCommunityIcon.Button>
            </View>
            <View style={styles.buttonViewCreate}>
              <MaterialCommunityIcon.Button name="coffee" backgroundColor="#1c3969" onPress={() => Linking.canOpenURL('https://www.buymeacoffee.com/tournoipetanque').then(supported => {if (supported) {Linking.openURL('https://www.buymeacoffee.com/tournoipetanque')}})}>BuyMeACoffee</MaterialCommunityIcon.Button>
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
    console.log(VersionCheck.getPackageName());
    return (
      <View style={styles.main_container}>
        <View style={styles.logo_container}>
          <Image style={styles.logo} source={require('../assets/icon.png')}/>
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
            <View style={styles.buttonView}>
              <FontAwesomeIcon.Button name="euro" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => this.setState({ modalDonsVisible: true })}/>
            </View>
            <View style={styles.buttonView}>
              <MaterialCommunityIcon.Button name="star" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}}  onPress={() => Linking.canOpenURL('market://details?id=com.MK.PetanqueGCU&showAllReviews=true').then(supported => {if (supported) {Linking.openURL('market://details?id=com.MK.PetanqueGCU&showAllReviews=true')}})}/>
            </View>
            <View style={styles.buttonView}>
              <FontAwesomeIcon.Button name="envelope-o" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => Linking.canOpenURL('mailto: tournoispetanqueapp@gmail.com').then(supported => {if (supported) {Linking.openURL('mailto: tournoispetanqueapp@gmail.com')}})}/>
            </View>
            <View style={styles.buttonView}>
              <MaterialCommunityIcon.Button name="wrench" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 5, marginRight: 0}} onPress={() => this.props.navigation.navigate('Changelog')}/>
            </View>
          </View>
        </View> 
        <View style={styles.footer_container}>
          <Button color="#1c3969" title='Découvrir le GCU' onPress={() => Linking.canOpenURL('https://www.gcu.asso.fr/').then(supported => {if (supported) {Linking.openURL('https://www.gcu.asso.fr/')}})}/>
          <Text style={styles.create_text}>Par Mathis Cadio</Text>
          <Text style={styles.create_text}>Version: {expo.version}</Text>
        </View>
        {this._showDonsModal()}
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
import React from 'react'
import { StyleSheet, View, Text, Button, Image, Modal } from 'react-native'
import { expo } from '../app.json'
import { connect } from 'react-redux'
import * as Linking from 'expo-linking'
import * as NavigationBar from 'expo-navigation-bar';
import * as VersionCheck from 'react-native-version-check-expo';

class Accueil extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  componentDidMount() {
    //VersionCheck.getCountry().then(country => console.log(country))
    /*VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded && this.state.modalVisible != true) {
        this.setState({modalVisible: true})
      }
    })*/
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

  _showMatchs() {
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsInscription'
      }],
    });
  }

  _showInscription() {
    this.props.navigation.navigate('ChoixTypeTournoi');
  }

  _showListeTournois() {
    this.props.navigation.navigate('ListeTournois');
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
    console.log(VersionCheck.getPackageName());        // com.reactnative.app

    NavigationBar.setBackgroundColorAsync("#0594ae");
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
              <Button color="#1c3969" title='Nouveau tournoi' onPress={() => this._showInscription()}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Voir les anciens tournois' onPress={() => this._showListeTournois()}/>
            </View>
          </View>
          <View style={styles.informations_container}>
            <Text style={styles.informations_texte}>Possibilités :</Text>
            <Text style={styles.informations_texte}>Mêlée-démêlée</Text>
            <Text style={styles.informations_texte}>Tête à Tête / Doublettes / triplettes</Text>
            <Text style={styles.informations_texte}>Avec ou sans noms</Text>
            <Text style={styles.informations_texte}>Avec ou sans équipes</Text>
          </View>
        </View>
        <View style={styles.create_container}>
          <View style={styles.buttonViewCreate}>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Noter et Commenter' onPress={() => Linking.canOpenURL('market://details?id=com.MK.PetanqueGCU&showAllReviews=true').then(supported => {if (supported) {Linking.openURL('market://details?id=com.MK.PetanqueGCU&showAllReviews=true')}})}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Envoyer un mail' onPress={() => Linking.canOpenURL('mailto: tournoispetanqueapp@gmail.com').then(supported => {if (supported) {Linking.openURL('mailto: tournoispetanqueapp@gmail.com')}})}/>
            </View>
          </View>
          <View style={styles.buttonViewCreate}>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Changelog' onPress={() => this.props.navigation.navigate('Changelog')}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Découvrir le GCU' onPress={() => Linking.canOpenURL('https://www.gcu.asso.fr/').then(supported => {if (supported) {Linking.openURL('https://www.gcu.asso.fr/')}})}/>
            </View> 
          </View>
          <Text style={styles.create_text}>Par Mathis Cadio</Text>
          <Text style={styles.create_text}>Version: {expo.version}</Text>
        </View>
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
    paddingLeft: '10%',
    paddingRight: '10%'
  },
  informations_texte: {
    fontSize: 20,
    textAlign: "justify",
    color: 'white'
  },
  create_container: {
    alignItems: 'center',
    paddingBottom: 10
  },
  create_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonViewCreate: {
    flexDirection: 'row',
    marginBottom: 10
  }
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
import React from 'react'
import { StyleSheet, View, Text, Button, Image } from 'react-native'
import { expo } from '../app.json'
import { connect } from 'react-redux'
import * as Linking from 'expo-linking'
import VersionCheck from 'react-native-version-check-expo'

class Accueil extends React.Component {
  
  componentDidMount() {
    VersionCheck.needUpdate()
    .then(async res => {
      if (res.isNeeded) {
        Linking.openURL("market://details?id=com.MK.PetanqueGCU")
      }
    })
  }

  _showMatchs() {
    this.props.navigation.navigate('ListeMatchsInscription');  
  }

  _showInscription() {
    this.props.navigation.navigate('ChoixTournois');
  }

  _buttonShowMatchs() {
    if(this.props.listeMatchs && this.props.listeMatchs.length != 0) {
      return <Button color="#1c3969" title='Reprendre le tournoi' onPress={() => this._showMatchs()}/>
    }
    else {
      return <Button color="#1c3969" disabled title='Pas de tournoi en cours'/>
    }
  }

  render() {
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
              <Button color="#1c3969" disabled title='Voir les anciens tournois' onPress={() => this._showInscription()}/>
            </View>
          </View>
          <View style={styles.informations_container}>
            <Text style={styles.informations_texte}>Mode de tournoi :</Text>
            <Text style={styles.informations_texte}>Mêlée-démélée</Text>
            <Text style={styles.informations_texte}>Doublettes ou triplettes</Text>
            <Text style={styles.informations_texte}>Avec ou sans noms</Text>
          </View>
        </View>
        <View style={styles.create_container}>
          <View style={styles.buttonViewCreate}>
            <Button color="#1c3969" title='Noter et laisser un commentaire' onPress={() => Linking.openURL('market://details?id=com.MK.PetanqueGCU&showAllReviews=true')}/>
          </View>
          <View style={styles.buttonViewCreate}>
            <Button color="#1c3969" title='Changelog' onPress={() => this.props.navigation.navigate('Changelog')}/>
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
    marginBottom: 20,
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
    marginBottom: 10
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(Accueil)
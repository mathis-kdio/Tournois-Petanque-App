import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import {expo} from '../app.json'

class Accueil extends React.Component {
  _showMatchs() {
    this.props.navigation.navigate('InscriptionGeneral', {screen: 'ListeMatchsInscription',});  
  }

  _showInscription() {
    this.props.navigation.navigate('InscriptionGeneral');
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.beta_container}>
          <Text style={[{color: 'red'}, styles.informations_titre]}>Attention</Text>
          <Text style={[{color: 'red'}, styles.informations_texte]}>Vous utilisez une version en test ! Il se peut que certaines fonctionnalités ne marche pas !</Text>
          <Text style={[{color: 'red'}, styles.informations_texte]}>- Les paramètres de tournois ne marchent pas!</Text>
        </View>
        <View style={styles.body_container}>
          <View style={styles.menu_container}>
            <View style={styles.buttonView}>
              <Button title='Reprendre le tournois' onPress={() => this._showMatchs()}/>
            </View>
            <View style={styles.buttonView}>
              <Button title='Nouveau tournois' onPress={() => this._showInscription()}/>
            </View>
            <View style={styles.buttonView}>
              <Button disabled title='Voir les anciens tournois' onPress={() => this._showInscription()}/>
            </View>
          </View>
          <View style={styles.informations_container}>
            <Text style={styles.informations_titre}>Informations</Text>
            <Text style={styles.informations_texte}>Le seul mode de tournois disponible pour l'instant est : - mêlée-démélée</Text>
          </View>
        </View>
        <View style={styles.create_container} >
          <Text style={styles.create_text}>Par Mathis Cadio</Text>
          <Text style={styles.create_text}>Version: {expo.version}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  beta_container: {
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  body_container : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu_container : {

  },
  buttonView: {
    marginBottom: 20
  },
  informations_container: {
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%'
  },
  informations_titre: {
    fontSize: 27
  },
  informations_texte: {
    fontSize: 20,
    textAlign: "justify"
  },
  create_container: {
    alignItems: 'center',
    paddingBottom: 10
  },
  create_text: {
    fontSize: 15
  },
})

export default Accueil
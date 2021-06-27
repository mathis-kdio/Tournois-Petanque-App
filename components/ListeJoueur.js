import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

class ListeJoueur extends React.Component {

  _isSpecial = (joueurSpecial) => {
    if (joueurSpecial === true) {
      return (
        <View style={styles.special_container}>
          <Text style={styles.name_text}>Femme/Enfant</Text>
        </View>
      )
    }
  }

  _showSupprimerJoueur(joueur, supprimerJoueur, isInscription) {

    if (isInscription === true) {
      return (
        <View style={styles.supprJoueur_container}>
          <Button color='#ff0000' title='Supprimer' onPress={() => supprimerJoueur(joueur.id)}/>
        </View>
      )
    }
  }

  render() {
    const { joueur, supprimerJoueur, isInscription } = this.props;

    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          <Text style={styles.name_text}>{joueur.name}</Text>
        </View>
        {this._isSpecial(joueur.special)}
        {this._showSupprimerJoueur(joueur, supprimerJoueur, isInscription)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginHorizontal: 10,
    borderBottomWidth: 1,
  },
  name_container: {
    flex: 1,

  },
  special_container: {
    marginLeft: 5,
    marginRight: 5,
  },
  supprJoueur_container: {
    //flex: 1,
  },
  name_text: {
    fontWeight: 'bold',
    fontSize: 20
  }
})

export default ListeJoueur
import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueur from './ListeJoueur'

class JoueursTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      joueur: undefined,
    }
  }

  _retourMatchs() {
    this.props.navigation.goBack();   
  }

  _displayListeJoueur() {
    if (this.props.listeJoueurs !== undefined) {
      return (
        <FlatList
          data={this.props.listeJoueurs}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueur
              joueur={item}
              supprimerJoueur={undefined}
              isInscription={false}
            />
          )}
        />
      )
    }
  }

  _showNbJoueur() {
    let nbJoueur = this.props.listeJoueurs.length;
    return (
    <Text>{nbJoueur}</Text>
    )
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.nbjoueur_container}>
          <Text style={styles.text_nbjoueur}>Il y a : {this._showNbJoueur()} joueur.se.s inscrit.e.s</Text>
        </View>
        <View style={styles.flatList} >
          {this._displayListeJoueur()}
        </View>
        <View style={styles.buttonView}>
          <Button color='#32cd32' title='Retourner à la liste des parties' onPress={() => this._retourMatchs()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  buttonView: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  flatList: {
    flex: 1
  },
  nbjoueur_container: {
    alignItems: 'center',
    marginTop: 5
  },
  text_nbjoueur: {
    fontSize: 20,
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(JoueursTournoi)
import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueurItem from '../../components/ListeJoueurItem'

class JoueursTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      joueur: undefined,
    }
  }

  _retourMatchs() {
    this.props.navigation.navigate('ListeMatchsStack');   
  }

  _displayListeJoueur() {
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs
    if (listeJoueurs !== undefined) {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={listeJoueurs}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueurItem
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
    let nbJoueur = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs.length
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
          <Button color='#1c3969' title='Retourner à la liste des parties' onPress={() => this._retourMatchs()}/>
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
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
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
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(JoueursTournoi)
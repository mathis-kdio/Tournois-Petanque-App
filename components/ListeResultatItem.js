import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'

class ListeResultatItem extends React.Component {

  _displayName = (joueurNumber) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined) {
      return (
        <Text style={styles.joueurName} >manque J:{joueurNumber}</Text>
      )
    }
    else {
      return (
      <Text style={styles.joueurName} >{nomJoueur.name}</Text>
      )
    }
  }

  render() {
    let { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.position_container}>
          <Text style={styles.joueurName}>{joueur.position}</Text>
        </View>
        <View style={styles.nom_container}>
          {this._displayName(joueur.joueurId)}
        </View>
        <View style={styles.victoires_container}>
          <Text style={styles.joueurName}>Victoire(s): {joueur.victoires}</Text>
        </View>
        <View style={styles.points_container}>
          <Text style={styles.joueurName}>point(s): {joueur.points}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  position_container: {
    marginLeft: '5%',
    marginRight: 5
  },
  nom_container: {
    flex: 1,
  },
  joueurName: {
    fontSize: 15,
    textAlign: 'left'
  },
  victoires_container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  points_container: {
    marginRight: '5%',
  },
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
  }
}

export default connect(mapStateToProps)(ListeResultatItem)
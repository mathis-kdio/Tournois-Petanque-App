import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

class ListeResultatItem extends React.Component {

  _displayName = (joueurNumber) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined) {
      return (
        <Text style={styles.text} >manque J:{joueurNumber}</Text>
      )
    }
    else {
      return (
      <Text style={styles.text} >{nomJoueur.name}</Text>
      )
    }
  }

  _fanny(joueurNumber) {
    let listeMatchs = this.props.listeMatchs
    let fanny = false
    let nbFanny = 0
    for (let i = 0; i < listeMatchs[listeMatchs.length - 1].nbMatchs; i++) {
      if ((listeMatchs[i].joueur1 == joueurNumber || listeMatchs[i].joueur2 == joueurNumber) && listeMatchs[i].score1 == '0') {
        fanny = true
        nbFanny++
      }
      else if ((listeMatchs[i].joueur3 == joueurNumber || listeMatchs[i].joueur4 == joueurNumber) && listeMatchs[i].score2 == '0') {
        fanny = true
        nbFanny++
      }
    }
    if (fanny == true) {
      return (
        <View style={styles.fanny_container}>
          <Image source={require('../images/fanny.png')} style={styles.icon}/>
          <Text style={styles.text}>X{nbFanny}</Text>
        </View>
      )
    }
  }

  _partieJoue(joueurNumber) {
    let partieJoue = 0
    let listeMatchs = this.props.listeMatchs
    for (let i = 0; i < listeMatchs[listeMatchs.length - 1].nbMatchs; i++) {
      if (listeMatchs[i].joueur1 == joueurNumber || listeMatchs[i].joueur2 == joueurNumber || listeMatchs[i].joueur3 == joueurNumber || listeMatchs[i].joueur4 == joueurNumber) {
        if (listeMatchs[i].score1 && listeMatchs[i].score2) {
          partieJoue++
        }
      }
    }
    return (
      <Text style={styles.text}>{partieJoue}</Text>
    )
  }

  render() {
    let { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.position_nom_container}>
          <Text style={styles.text}>{joueur.position} - </Text>
          {this._displayName(joueur.joueurId)}
        </View>
        <View style={styles.victoires_container}>
          <Text style={styles.text}>{joueur.victoires}</Text>
        </View>
        <View style={styles.mj_container}>
          {this._partieJoue(joueur.joueurId)}
        </View>
        <View style={styles.points_container}>
          {this._fanny(joueur.joueurId)}
          <Text style={styles.text}>{joueur.points}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  position_nom_container: {
    flex: 1,
    flexDirection: 'row'
  },
  victoires_container: {
    flex: 1,
    alignItems: 'center'
  },
  mj_container: {
    flex: 1,
    alignItems: 'center'
  },
  fanny_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center'
  },
  points_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  text: {
    fontSize: 20,
    textAlign: 'left'
  },
  icon: {
    width: 30,
    height: 30
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeResultatItem)
import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

class ListeResultatItem extends React.Component {

  _displayName(joueurId) {
    let joueur = {}
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs
    joueur = listeJoueurs.find(item => item.id === joueurId)
    let joueurName = "";
    if (joueur.name === undefined) {
      joueurName = "Sans Nom" + ' (' + (joueur.id+1) + ')';
    }
    else if (joueur.name == "") {
      joueurName = "Joueur " + (joueur.id+1);
    }
    else {
      joueurName = joueur.name + ' (' + (joueur.id+1) + ')';
    }

    return (
      <Text style={styles.texte}>{joueurName}</Text>
    )
  }

  _fanny(joueurNumber) {
    let listeMatchs = this.props.listeMatchs
    let fanny = false
    let nbFanny = 0
    for (let i = 0; i < listeMatchs[listeMatchs.length - 1].nbMatchs; i++) {
      if (listeMatchs[i].equipe[0].includes(joueurNumber) && listeMatchs[i].score1 == '0') {
        fanny = true
        nbFanny++
      }
      else if (listeMatchs[i].equipe[1].includes(joueurNumber) && listeMatchs[i].score2 == '0') {
        fanny = true
        nbFanny++
      }
    }
    if (fanny == true) {
      return (
        <View style={styles.fanny_container}>
          <Image source={require('@assets/images/fanny.png')} style={styles.icon}/>
          <Text style={styles.texte}>X{nbFanny}</Text>
        </View>
      )
    }
  }

  render() {
    let { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.position_nom_container}>
          <Text style={styles.texte}>{joueur.position} - </Text>
          {this._displayName(joueur.joueurId)}
        </View>
        <View style={styles.victoires_container}>
          <Text style={styles.texte}>{joueur.victoires}</Text>
        </View>
        <View style={styles.mj_container}>
          <Text style={styles.texte}>{joueur.nbMatchs}</Text>
        </View>
        <View style={styles.points_container}>
          {this._fanny(joueur.joueurId)}
          <Text style={styles.texte}> {joueur.points}</Text>
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
    flex: 2,
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
  texte: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white'
  },
  icon: {
    width: 30,
    height: 30
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeResultatItem)
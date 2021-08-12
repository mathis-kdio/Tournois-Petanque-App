import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

class MatchItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _displayEquipe(equipe, match) {
    let nbJoueur = 2
    if (match.equipe[equipe - 1][2] != 0) {
      nbJoueur = 3
    }
    let nomsJoueurs = []
    if (equipe == 1) {
      for (let i = 0; i < nbJoueur; i++) {
        nomsJoueurs.push(this._displayName(match.equipe[0][i], 1, match.id))
      }
      return nomsJoueurs
    }
    else {
      for (let i = 0; i < nbJoueur; i++) {
        nomsJoueurs.push(this._displayName(match.equipe[1][i], 2, match.id))
      }
      return nomsJoueurs
    }
  }

  _displayName = (joueurNumber, equipe, matchID) => {
    let colorEquipe1 = 'white'
    let colorEquipe2 = 'white'
    let score1 = this.props.listeMatchs[matchID].score1;
    let score2 = this.props.listeMatchs[matchID].score2;
    if (score1 == 13) {
      colorEquipe1 = 'green'
      colorEquipe2 = 'red'
    }
    else if (score2 == 13) {
      colorEquipe1 = 'red'
      colorEquipe2 = 'green'
    }
    let joueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    let styleColor
    let joueurName
    let joueurId
    if (joueur) {
      joueurId = joueur.id
      joueurName = joueur.name
    }
    if (equipe == 1) {
      styleColor = colorEquipe1
      if(joueur === undefined) {
        joueurName = "joueur 1 :"
      }
    }
    else {
      styleColor = colorEquipe2
      if(joueur === undefined) {
        joueurName = "joueur 2 :"
      }
    }
    return <Text style={{color:styleColor, fontSize: 20}}>{joueurId} {joueurName}</Text>
  }

  _displayScore = (matchID) => {
    let score1 = this.props.listeMatchs[matchID].score1;
    let score2 = this.props.listeMatchs[matchID].score2;
    if (score1 == undefined) {
      score1 = '?'
    }
    if (score2 == undefined) {
      score2 = '?'
    }
    return (
      <Text style={styles.vs}>{score1} VS {score2}</Text>
    )
  }

  render() {
    let { match, displayDetailForMatch, manche } = this.props;
    if (match.manche == manche) {
      return (
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForMatch(match.id, match )}>
          <View style={styles.content_container}>
            <View>
              <Text style={styles.title}>Partie n°{(match.id + 1)}</Text>
            </View>
            <View style={styles.equipe_container}>
              <View style={styles.equipe1}>
                {this._displayEquipe(1, match)}
              </View>
              <View style={styles.vs_container}>
                {this._displayScore(match.id)}
              </View>
              <View style={styles.equipe2}>
                {this._displayEquipe(2, match)}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return (null);
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  },
  vs_container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  vs: {
    fontSize: 20,
    color: 'white'
  },
  equipe_container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  equipe1: {
    marginLeft: 10,
  },  
  equipe2: {
    marginRight: 10,
    alignItems: 'flex-end',
  }
})

const mapStateToProps = (state) => {
    return {
      listeJoueurs: state.toggleJoueur.listeJoueurs,
      listeMatchs: state.gestionMatchs.listematchs
    }
}

export default connect(mapStateToProps)(MatchItem)
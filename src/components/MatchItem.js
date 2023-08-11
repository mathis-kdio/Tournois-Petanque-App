import React from 'react'
import { withTranslation } from 'react-i18next'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

class MatchItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _displayTitle(match) {
    const { t } = this.props;
    return (
      match.terrain ? 
      <Text style={styles.title}>{(match.terrain.name)}</Text>
      :
      <Text style={styles.title}>{t("match_numero")}{(match.id + 1)}</Text>
    )
  }

  _displayEquipe(equipe, match, nbPtVictoire) {
    let nomsJoueurs = []
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe, match.id, nbPtVictoire))
    }
    return nomsJoueurs
  }

  _displayName = (joueurNumber, equipe, matchID, nbPtVictoire) => {
    let colorEquipe1 = 'white'
    let colorEquipe2 = 'white'
    if (this.props.listeMatchs[matchID].score1 == nbPtVictoire) {
      colorEquipe1 = 'green'
      colorEquipe2 = 'red'
    }
    else if (this.props.listeMatchs[matchID].score2 == nbPtVictoire) {
      colorEquipe1 = 'red'
      colorEquipe2 = 'green'
    }

    let styleColor
    if (equipe == 1) {
      styleColor = colorEquipe1
    }
    else {
      styleColor = colorEquipe2
    }

    let joueur = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs.find(item => item.id === joueurNumber)
    if (joueur) {
      return <Text key={joueur.id} style={{color:styleColor, fontSize: 20}}>{joueur.id+1} {joueur.name}</Text>
    }
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
      <View style={styles.vs_container}>
        <Text style={styles.score}>{score1}</Text><Text style={styles.vs}> VS </Text><Text style={styles.score}>{score2}</Text>
      </View>
    )
  }

  render() {
    let { match, displayDetailForMatch, manche, nbPtVictoire } = this.props;
    if (match.manche == manche) {
      return (
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForMatch(match.id, match )}>
          <View style={styles.content_container}>
            <View>
            {this._displayTitle(match)}
            </View>
            <View style={styles.equipe_container}>
              <View style={styles.equipe1}>
                {this._displayEquipe(1, match, nbPtVictoire)}
              </View>
              {this._displayScore(match.id)}
              <View style={styles.equipe2}>
                {this._displayEquipe(2, match, nbPtVictoire)}
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
    flexDirection: 'row',
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  vs: {
    fontSize: 15,
    color: 'white'
  },
  score: {
    fontSize: 25,
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
      listeMatchs: state.gestionMatchs.listematchs
    }
}

export default connect(mapStateToProps)(withTranslation()(MatchItem))
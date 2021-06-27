import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import FadeIn from '../animations/FadeIn'

class MatchItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _displayName = (joueurNumber, equipe) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined) {
      return (
        <Text style={styles.joueurName} >manque J:{joueurNumber}</Text>
      )
    }
    else {
      if(nomJoueur.special === true) {
        if (equipe === 1) {
          return (
            <Text style={styles.joueurName} >{nomJoueur.name} Femme/enfant</Text>
          )
        }
        else
        {
          return (
            <Text style={styles.joueurName} >Femme/enfant {nomJoueur.name}</Text>
          )
        }
      }
      else {
        return (
          <Text style={styles.joueurName} >{nomJoueur.name}</Text>
        )
      }
    }
  }

  _displayScore = (matchID) => {
    let score1 = this.props.listeMatchs[matchID].score1;
    let score2 = this.props.listeMatchs[matchID].score2;
    return (
      <Text style={styles.vs}>{score1} VS {score2}</Text>
    )
  }

  _displayItem () {
    
  }

  render() {
    let { match, displayDetailForMatch, manche } = this.props;
    if (match.manche == manche)
    {
      return (
        <FadeIn>
          <TouchableOpacity
            style={styles.main_container}
            onPress={() => displayDetailForMatch(match.id, match)}>
            <View style={styles.content_container}>
              <View>
                <Text style={styles.title}>Match n°{match.id}</Text>
              </View>
              <View style={styles.equipe_container}>
                <View style={styles.equipe1}>
                  {this._displayName(match.joueur1, 1)}
                  {this._displayName(match.joueur2, 1)}
                </View>
                <View style={styles.vs_container}>
                  {this._displayScore(match.id)}
                </View>
                <View style={styles.equipe2}>
                  {this._displayName(match.joueur3, 2)}
                  {this._displayName(match.joueur4, 2)}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </FadeIn>
      )
    }
    return (null);
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  title: {
    textAlign: 'center',
    fontSize: 20
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
    fontSize: 20
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
  },
  joueurName: {
    fontSize: 15
  }
})

const mapStateToProps = (state) => {
    return {
      listeJoueurs: state.toggleJoueur.listeJoueurs,
      listeMatchs: state.gestionMatchs.listematchs
    }
}

export default connect(mapStateToProps)(MatchItem)
import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import { connect } from 'react-redux'

class MatchDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      match: undefined,
      score1: undefined,
      score2: undefined
    }
  }

  _ajoutScoreTextInputChanged = (score, equipe) => {
    if(equipe === 1) {
      this.setState({
        score1: score
      })
    }
    else if(equipe === 2) {
      this.setState({
        score2: score
      })
    }
  } 

  componentDidMount() {
    var idMatch = this.props.route.params.idMatch;
    this.setState({
      match: idMatch,
    })
  }

  _displayName = (joueurNumber) => {
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs
    let joueur = listeJoueurs.find(item => item.id === joueurNumber)
    let joueurName
    let joueurId
    if (joueur) {
      joueurId = joueur.id
      joueurName = joueur.name
    }
    
    return <Text style={styles.joueurName}>{joueurId+1} {joueurName}</Text>
  }

  _displayEquipe(equipe, match) {
    let nbJoueur = 1
    if (this.props.listeMatchs[this.props.listeMatchs.length - 1].typeEquipes == "doublette") {
      nbJoueur = 2
    }
    else if (this.props.listeMatchs[this.props.listeMatchs.length - 1].typeEquipes == "triplette") {
      nbJoueur = 3
    }

    let nomsJoueurs = []
    if (equipe == 1) {
      for (let i = 0; i < nbJoueur; i++) {
        nomsJoueurs.push(this._displayName(match.equipe[0][i], 1))
      }
      return nomsJoueurs
    }
    else {
      for (let i = 0; i < nbJoueur; i++) {
        nomsJoueurs.push(this._displayName(match.equipe[1][i], 2))
      }
      return nomsJoueurs
    }
  }

  _envoyerResultat() {
    if (this.state.score1 && this.state.score2) {
      let info = {idMatch: this.state.match, score1: this.state.score1, score2: this.state.score2};
      const action = { type: "AJOUT_SCORE", value: info};
      this.props.dispatch(action);
      this.props.navigation.navigate('ListeMatchsStack');
    }
  }

  _supprimerResultat() {
    let info = {idMatch: this.state.match, score1: undefined, score2: undefined};
    const action = { type: "AJOUT_SCORE", value: info};
    this.props.dispatch(action);
    this.props.navigation.navigate('ListeMatchsStack');
  }

  _boutonValider() {
    let boutonActive = true
    if (this.state.score1 && this.state.score2) {
      boutonActive = false
    }
    return (
      <Button disabled={boutonActive} color="green" title='Valider le score' onPress={() => this._envoyerResultat()}/>
    )
  }

  render() {
    let match = this.props.route.params.match
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.content_container} >
            <View>
              <Text style={styles.title}>Partie n°{(this.state.match + 1)}</Text>
            </View>
            <View style={styles.equipe_container}>
              <View style={styles.equipe1}>
                {this._displayEquipe(1, match)}
              </View>
              <Text style={styles.vs}>VS</Text>
              <View style={styles.equipe2}>
                {this._displayEquipe(2, match)}
              </View>
            </View>
          </View>
          <View style={styles.resultat_container} >
            <TextInput
              style={styles.textinput}
              placeholderTextColor='white'
              underlineColorAndroid='white'
              keyboardType={'decimal-pad'}
              maxLength={2}
              autoFocus = {true}
              returnKeyType= {'next'}
              placeholder="score équipe 1"
              onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 1)}
              onSubmitEditing={() => this.secondInput.focus()}
            />
            <TextInput
              style={styles.textinput}
              placeholderTextColor='white'
              underlineColorAndroid='white'
              keyboardType={'decimal-pad'}
              maxLength={2}
              ref={ref => {this.secondInput = ref}}
              placeholder="score équipe 2"
              onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 2)}
              onSubmitEditing={() => this._envoyerResultat()}
            />
          </View>
          <View style={styles.buttonView}>
            <Button color="red" title='Supprimer le score' onPress={() => this._supprimerResultat()}/>
          </View>
          <View style={styles.buttonView}>
            {this._boutonValider()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#0594ae",
  },
  body_container: {
    flex: 1,
    marginHorizontal: '5%'
  },
  content_container: {
    margin: 5
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  },
  equipe_container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  equipe1: {
    marginLeft: 10
  },  
  equipe2: {
    alignItems: 'flex-end',
    marginRight: 10
  },
  joueurName: {
    fontSize: 15,
    color: 'white'
  },
  vs_container: {
    justifyContent: 'center'
  },
  vs: {
    fontSize: 20,
    color: 'white'
  },
  resultat_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(MatchDetail)
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

  _displayName = (joueurNumber, equipe) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined)
    {
      if (equipe == 1) {
        return (
          <Text style={styles.joueurName}>joueur 1 :</Text>
        )
      }
      else {
        return (
          <Text style={styles.joueurName}>joueur 2 :</Text>
        )
      }
    }
    else
    {
      return (
        <Text style={styles.joueurName} >{nomJoueur.name}</Text>
      )
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
    let match = this.props.route.params.match;
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.content_container} >
            <View>
              <Text style={styles.title}>Partie n°{(this.state.match + 1)}</Text>
            </View>
            <View style={styles.equipe_container}>
              <View style={styles.equipe1}>
                {this._displayName(match.joueur1, 1)}
                {this._displayName(match.joueur2, 1)}
              </View>
              <Text style={styles.vs}>VS</Text>
              <View style={styles.equipe2}>
                {this._displayName(match.joueur3, 2)}
                {this._displayName(match.joueur4, 2)}
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
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(MatchDetail)
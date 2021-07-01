import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import { connect } from 'react-redux'

class MatchDetail extends React.Component {
  constructor(props) {
    super(props)
    this.score1 = "",
    this.score2 = "",
    this.state = {
      match: undefined,
    }
  }

  _ajoutScoreTextInputChanged = (score, equipe) => {
    if(equipe === 1)
    {
      this.score1 = score;
    }
    if(equipe === 2)
    {
      this.score2 = score;
    }
  } 

  componentDidMount() {
    var idMatch = this.props.route.params.idMatch;
    this.setState({
      match: idMatch,
    })
  }

  _displayName = (joueurNumber) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined)
    {
      return (
        <Text style={styles.joueurName} >manque J:{joueurNumber}</Text>
      )
    }
    else
    {
      return (
        <Text style={styles.joueurName} >{nomJoueur.name}</Text>
      )
    }
  }

  _envoyerResultat() {
    if (this.score1 && this.score2) {
      let info = {idMatch: this.state.match, score1: this.score1, score2: this.score2};
      const action = { type: "AJOUT_SCORE", value: info};
      this.props.dispatch(action);
      this.props.navigation.goBack();
    }
  }

  _supprimerResultat() {
    let info = {idMatch: this.state.match, score1: undefined, score2: undefined};
    const action = { type: "AJOUT_SCORE", value: info};
    this.props.dispatch(action);
    this.props.navigation.goBack();
  }

  render() {
    let match = this.props.route.params.match;
    return (
      <View style={styles.main_container}>
        <View style={styles.content_container} >
          <View>
            <Text style={styles.title}>Match n°{this.state.match}</Text>
          </View>
          <View style={styles.equipe_container}>
            <View style={styles.equipe1}>
              {this._displayName(match.joueur1)}
              {this._displayName(match.joueur2)}
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.equipe2}>
              {this._displayName(match.joueur3)}
              {this._displayName(match.joueur4)}
            </View>
          </View>
        </View>
        <View style={styles.resultat_container} >
          <TextInput
            style={styles.textinput}
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
          <Button color="green" title='Valider le score' onPress={() => this._envoyerResultat()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: '5%'
  },
  content_container: {
    margin: 5
  },
  title: {
    textAlign: 'center',
    fontSize: 20
  },
  equipe_container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  equipe1: {
    marginLeft: 10
  },  
  equipe2: {
    marginRight: 10
  },
  joueurName: {
    fontSize:15
  },
  vs_container: {
    justifyContent: 'center'
  },
  vs: {
    fontSize: 20
  },
  resultat_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonView: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  textinput: {
    height: 50,
    borderBottomWidth: 1,
    paddingLeft: 5
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(MatchDetail)
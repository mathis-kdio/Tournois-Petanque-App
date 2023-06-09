import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
    if (joueur) {
      return <Text key={joueur.id} style={styles.joueurName}>{joueur.id+1} {joueur.name}</Text>
    }
  }

  _displayEquipe(equipe, match) {
    let nomsJoueurs = []
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe))
    }
    return nomsJoueurs
  }

  _envoyerResultat(match) {
    if (this.state.score1 && this.state.score2) {
      let info = {idMatch: this.state.match, score1: this.state.score1, score2: this.state.score2};
      const actionAjoutScore = { type: "AJOUT_SCORE", value: info};
      this.props.dispatch(actionAjoutScore);
      //Si tournoi type coupe et pas le dernier match, alors on ajoute les gagnants au match suivant
      let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
      if (this.props.listeMatchs[this.props.listeMatchs.length - 1].typeTournoi == 'coupe' && match.id + 1 < nbMatchs) {
        let gagnant = match.equipe[0];
        if (parseInt(match.score2) > parseInt(match.score1)) {
          gagnant = match.equipe[1];
        }
        let matchId = null;

        let div = 2;
        for (let i = 2; i <= match.manche; i++) {
          div = div * 2;
        }
        let nbMatchsManche = Math.floor((nbMatchs + 1) / div);

        if (match.manche == 1) {
          if (match.id % 2 != 0) {
            matchId = match.id + (nbMatchsManche - ((match.id + 1) / 2));
          }
          else {
            matchId = match.id + (nbMatchsManche - (match.id / 2));
          }
        }
        else {
          let nbMatchsAvantManche = (nbMatchs + 1) / 2;
          for (let i = 1; i < match.manche - 1; i++) {
            nbMatchsAvantManche += nbMatchsAvantManche / 2;
          }
          matchId = match.id + (nbMatchsManche - (Math.ceil((match.id % nbMatchsAvantManche) / 2)));
        }

        let equipeId = match.id % 2;
        const actionAjoutAdversaire = { type: "COUPE_AJOUT_ADVERSAIRE", value: {gagnant: gagnant, matchId: matchId, equipeId: equipeId}};
        this.props.dispatch(actionAjoutAdversaire);
      }
      const actionUpdateTournoi = { type: "UPDATE_TOURNOI", value: {tournoi: this.props.listeMatchs, tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
      this.props.dispatch(actionUpdateTournoi);
      this.props.navigation.navigate('ListeMatchsStack');
    }
  }


  _supprimerResultat() {
    let info = {idMatch: this.state.match, score1: undefined, score2: undefined};
    const actionAjoutScore = { type: "AJOUT_SCORE", value: info};
    this.props.dispatch(actionAjoutScore);
    const actionUpdateTournoi = { type: "UPDATE_TOURNOI", value: {tournoi: this.props.listeMatchs, tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
    this.props.dispatch(actionUpdateTournoi);
    this.props.navigation.navigate('ListeMatchsStack');
  }

  _boutonValider(match) {
    let boutonActive = true
    if (this.state.score1 && this.state.score2) {
      boutonActive = false
    }
    return (
      <Button disabled={boutonActive} color="green" title='Valider le score' onPress={() => this._envoyerResultat(match)}/>
    )
  }

  render() {
    let match = this.props.route.params.match
    return (
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.main_container}>
          <View style={styles.body_container}>
            <View style={styles.content_container} >
              <View>
                <Text style={styles.title}>Partie n°{(this.state.match + 1)}</Text>
                {match.terrain && <Text style={styles.title}>{match.terrain.name}</Text>}
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
                onSubmitEditing={() => this._envoyerResultat(match)}
              />
            </View>
            <View style={styles.buttonView}>
              <Button color="red" title='Supprimer le score' onPress={() => this._supprimerResultat()}/>
            </View>
            <View style={styles.buttonView}>
              {this._boutonValider(match)}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(MatchDetail)
import React from 'react'
import { StyleSheet, View, Text, Button, TextInput } from 'react-native'
import { connect } from 'react-redux'

class InscriptionsSansNoms extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = "5"
    this.speciauxIncompatibles = true
    this.memesEquipes = true
    this.memesAdversaires = true
    this.state = {
      nbJoueurNormaux: 0,
      nbJoueurSpeciaux: 0,
    }
  }

  componentDidUpdate() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles
      }
      if (routeparams.memesEquipes != undefined) {
        this.memesEquipes = routeparams.memesEquipes
      }
      if (routeparams.memesAdversaires != undefined) {
        this.memesAdversaires = routeparams.memesAdversaires
      }
    }
  }

  _textInputJoueursNormaux(text) {
    this.setState({
      nbJoueurNormaux: parseInt(text)
    })
  }

  _textInputJoueursSpeciaux(text) {
    this.setState({
      nbJoueurSpeciaux: parseInt(text)
    })
  } 

  _ajoutJoueur(isSpecial) {
    const action = { type: "AJOUT_JOUEUR", value: ["sansNoms","", isSpecial, undefined] }
    this.props.dispatch(action)
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] }
    this.props.dispatch(suppressionAllJoueurs);
  }
  
  _commencer() {
    this._supprimerJoueurs()

    for (let i = 0; i < this.state.nbJoueurNormaux; i++) {
      this._ajoutJoueur(false)
    }

    for (let i = 0; i < this.state.nbJoueurSpeciaux; i++) {
      this._ajoutJoueur(true)
    }

    let screenName
    if (this.props.optionsTournoi.typeEquipes == "doublette" || this.props.optionsTournoi.typeEquipes == "teteatete") {
      screenName = 'GenerationMatchs'
    }
    else {
      screenName = 'GenerationMatchsTriplettes'
    }

    this.props.navigation.navigate({
      name: screenName,
      params: {
        nbTours: parseInt(this.nbTours),
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        typeEquipes: this.props.optionsTournoi.typeEquipes,
        typeInscription: this.props.optionsTournoi.mode,
        screenStackName: 'InscriptionsSansNoms'
      }
    })
  }

  _options() {
    this.props.navigation.navigate({
      name: 'OptionsTournoi',
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        screenStackName: 'InscriptionsSansNoms'
      }
    })
  }

  _nbJoueurs() {
    let nbJoueur = 0
    if (!isNaN(this.state.nbJoueurNormaux)) {
      nbJoueur = this.state.nbJoueurNormaux
    }
    if (!isNaN(this.state.nbJoueurSpeciaux)) {
      nbJoueur += this.state.nbJoueurSpeciaux
    }
    return nbJoueur
  }

  _showNbJoueur() {
    let nbJoueur = this._nbJoueurs()
    return (
      <Text>{nbJoueur}</Text>
    )
  }

  _boutonCommencer() {
    let boutonDesactive
    let boutonTitle = ''
    let nbJoueurs = this._nbJoueurs()
    if (this.props.optionsTournoi.typeEquipes == 'doublette' || this.props.optionsTournoi.typeEquipes == "teteatete") {
      if (nbJoueurs % 2 == 0 && nbJoueurs != 0) {
        boutonTitle = 'Commencer le tournoi'
        boutonDesactive = false
      }
      else {
        boutonTitle = "Nombre de joueurs n'est pas un multiple de 2"
        boutonDesactive = true
      }
    }
    else {
      if (nbJoueurs % 6 == 0 && nbJoueurs >= 6) {
        boutonTitle = 'Commencer le tournoi'
        boutonDesactive = false
      }
      else {
        boutonTitle = "En triplette, le nombre de joueurs doit être un multiple de 6"
        boutonDesactive = true
      }
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.nbjoueur_container}>
            <Text style={styles.text_nbjoueur}>Il y aura {this._showNbJoueur()} joueurs</Text>
          </View>
          <View style={styles.ajoutjoueur_container}>
            <View style={styles.textinput_ajoutjoueur_container}>
              <TextInput
                style={styles.textinput}
                keyboardType={'number-pad'}
                placeholderTextColor='white'
                underlineColorAndroid='white'
                placeholder="Nombre de joueurs normaux"
                autoFocus={true}
                blurOnSubmit={false}
                returnKeyType={'next'}
                onChangeText={(text) => this._textInputJoueursNormaux(text)}
                onSubmitEditing={() => this.secondInput.focus()}
              />
            </View>
          </View>
          <View style={styles.ajoutjoueur_container}>
            <View style={styles.textinput_ajoutjoueur_container}>
              <TextInput
                style={styles.textinput}
                keyboardType={'number-pad'}
                placeholderTextColor='white'
                underlineColorAndroid='white'
                placeholder="Nombre de joueurs spéciaux"
                ref={ref => {this.secondInput = ref}}
                onChangeText={(text) => this._textInputJoueursSpeciaux(text)}
              />
            </View>
          </View>
          <View>
            <Text style={styles.texte}>Les joueurs spéciaux sont des joueurs qui ne peuvent pas jouer dans la même équipe</Text>
          </View>
          <View style={styles.buttonView}>
            <Button color='#1c3969' title='Options Tournoi' onPress={() => this._options()}/>
          </View>
          <View style={styles.buttonView}>
            {this._boutonCommencer()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae",
  },
  body_container: {
    marginHorizontal: '5%'
  },
  ajoutjoueur_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  textinput_ajoutjoueur_container: {
    flex: 1,
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  buttonView: {
    marginVertical: 20,
  },
  nbjoueur_container: {
    alignItems: 'center',
    marginTop: 5
  },
  text_nbjoueur: {
    fontSize: 20,
    color: 'white'
  },
  texte: {
    fontSize: 15,
    color: 'white',
    textAlign: "center"
  }
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(InscriptionsSansNoms)
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
      equipe: 'doublette'
    }
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params
      if (routeparams.equipe != undefined) {
        this.setState({
          equipe: routeparams.equipe
        })
      }
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
    const action = { type: "AJOUT_JOUEUR", value: ["", isSpecial] }
    this.props.dispatch(action)
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS" }
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

    if (this.state.equipe == "doublette") {
      this.props.navigation.navigate({
        name: 'GenerationMatchs',
        params: {
          nbTours: parseInt(this.nbTours),
          speciauxIncompatibles: this.speciauxIncompatibles,
          memesEquipes: this.memesEquipes,
          memesAdversaires: this.memesAdversaires,
          screenStackName: 'InscriptionsSansNomsStack'
        }
      })
    }
    else {
      this.props.navigation.navigate({
        name: 'GenerationMatchsTriplettes',
        params: {
          nbTours: parseInt(this.nbTours),
          speciauxIncompatibles: this.speciauxIncompatibles,
          memesEquipes: this.memesEquipes,
          memesAdversaires: this.memesAdversaires,
          screenStackName: 'InscriptionsSansNomsStack'
        }
      })
    }
  }

  _options() {
    this.props.navigation.navigate({
      name: 'OptionsTournoi',
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        screenStackName: 'InscriptionsSansNomsStack'
      }
    })
  }

  _showNbJoueur() {
    let nbJoueur = this.state.nbJoueurNormaux + this.state.nbJoueurSpeciaux;
    return (
      <Text>{nbJoueur}</Text>
    )
  }

  _boutonCommencer() {
    let boutonActive = true
    let boutonTitle = "Nombre de joueurs n'est pas un multiple de 2"
    if ((this.state.nbJoueurNormaux + this.state.nbJoueurSpeciaux) % 2 == 0 && (this.state.nbJoueurNormaux + this.state.nbJoueurSpeciaux) != 0) {
      boutonTitle = 'Commencer le tournoi'
      boutonActive = false
    }
    return (
      <Button disabled={boutonActive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
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
                placeholderTextColor='white'
                underlineColorAndroid='white'
                placeholder="Nombre de joueurs normaux"
                autoFocus={true}
                onChangeText={(text) => this._textInputJoueursNormaux(text)}
              />
            </View>
          </View>
          <View style={styles.ajoutjoueur_container}>
            <View style={styles.textinput_ajoutjoueur_container}>
              <TextInput
                style={styles.textinput}
                placeholderTextColor='white'
                underlineColorAndroid='white'
                placeholder="Nombre de joueurs spéciaux"
                autoFocus={true}
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
    textAlign: "justify"
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(InscriptionsSansNoms)
import React from 'react'
import { withTranslation } from 'react-i18next'
import { StyleSheet, View, Text, Button, TextInput } from 'react-native'
import { connect } from 'react-redux'

class InscriptionsSansNoms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nbJoueurNormaux: 0,
      nbJoueurEnfants: 0,
    }
  }

  _textInputJoueursNormaux(text) {
    this.setState({
      nbJoueurNormaux: parseInt(text)
    })
  }

  _textInputJoueursEnfants(text) {
    this.setState({
      nbJoueurEnfants: parseInt(text)
    })
  } 

  _ajoutJoueur(type) {
    const action = { type: "AJOUT_JOUEUR", value: ["sansNoms","", type, undefined] }
    this.props.dispatch(action)
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] }
    this.props.dispatch(suppressionAllJoueurs);
  }
  
  _commencer() {
    this._supprimerJoueurs()

    for (let i = 0; i < this.state.nbJoueurNormaux; i++) {
      this._ajoutJoueur(undefined)
    }

    for (let i = 0; i < this.state.nbJoueurEnfants; i++) {
      this._ajoutJoueur("enfant")
    }

    let screenName = "GenerationMatchs";
    if (this.props.optionsTournoi.avecTerrains) {
      screenName = "ListeTerrains";
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsSansNoms'
      }
    })
  }

  _nbJoueurs() {
    let nbJoueur = 0
    if (!isNaN(this.state.nbJoueurNormaux)) {
      nbJoueur = this.state.nbJoueurNormaux
    }
    if (!isNaN(this.state.nbJoueurEnfants)) {
      nbJoueur += this.state.nbJoueurEnfants
    }
    return nbJoueur
  }

  _boutonCommencer() {
    let boutonDesactive
    let boutonTitle = ''
    let nbJoueurs = this._nbJoueurs()
    if (this.props.optionsTournoi.typeEquipes == 'doublette' || this.props.optionsTournoi.typeEquipes == "teteatete") {
      if (nbJoueurs % 2 == 0 && nbJoueurs != 0) {
        boutonTitle = t("commencer_tournoi")
        boutonDesactive = false
      }
      else {
        boutonTitle = t("doublette_multiple_2")
        boutonDesactive = true
      }
    }
    else {
      if (nbJoueurs % 6 == 0 && nbJoueurs >= 6) {
        boutonTitle = t("commencer_tournoi")
        boutonDesactive = false
      }
      else {
        boutonTitle = t("triplette_multiple_6")
        boutonDesactive = true
      }
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.nbjoueur_container}>
            <Text style={styles.text_nbjoueur}>{t("nombre_joueurs", {nb: this._nbJoueurs()})}</Text>
          </View>
          <View style={styles.ajoutjoueur_container}>
            <View style={styles.textinput_ajoutjoueur_container}>
              <TextInput
                style={styles.textinput}
                keyboardType={'number-pad'}
                placeholderTextColor='white'
                underlineColorAndroid='white'
                placeholder={t("nombre_joueurs_adultes")}
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
                placeholder={t("nombre_joueurs_enfants")}
                ref={ref => {this.secondInput = ref}}
                onChangeText={(text) => this._textInputJoueursEnfants(text)}
              />
            </View>
          </View>
          <View>
            <Text style={styles.texte}>{t("joueurs_enfants_explication")}</Text>
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

export default connect(mapStateToProps)(withTranslation()(InscriptionsSansNoms))
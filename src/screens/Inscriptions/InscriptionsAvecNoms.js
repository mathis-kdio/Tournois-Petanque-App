import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Inscriptions from '@components/Inscriptions'

class InscriptionsAvecNoms extends React.Component {

  constructor(props) {
    super(props)
    this.nbTours = "5"
    this.nbPtVictoire = 13;
    this.speciauxIncompatibles = true
    this.memesEquipes = true
    this.memesAdversaires = true
    this.state = {
      complement: "3",
    }
  }

  componentDidUpdate() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.nbPtVictoire != undefined) {
        this.nbPtVictoire = routeparams.nbPtVictoire
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
      if (routeparams.complement != undefined && this.state.complement != routeparams.complement) {
        this.setState({
          complement: routeparams.complement
        })
      }
    }
  }

  _commencer() {
    let screenName;
    if (this.props.optionsTournoi.type == "championnat") {
      screenName = 'GenerationChampionnat';
    }
    if (this.props.optionsTournoi.type == "coupe") {
      screenName = 'GenerationCoupe';
    }
    else if (this.props.optionsTournoi.type == "mele-demele") {
      if (this.props.optionsTournoi.mode == 'avecEquipes') {
        screenName = 'GenerationMatchsAvecEquipes';
      }
      else if (this.props.optionsTournoi.typeEquipes == "triplette") {
        screenName = 'GenerationMatchsTriplettes';
      }
      else {
        screenName = 'GenerationMatchs';
      }
    }
    else {

    }

    this.props.navigation.navigate({
      name: screenName,
      params: {
        nbTours: parseInt(this.nbTours),
        nbPtVictoire: this.nbPtVictoire,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        complement: this.state.complement,
        typeEquipes: this.props.optionsTournoi.typeEquipes,
        typeInscription: this.props.optionsTournoi.mode,
        screenStackName: 'InscriptionsAvecNoms'
      }
    })
  }

  _options() {
    this.props.navigation.navigate({
      name: 'OptionsTournoi',
      params: {
        nbTours: this.nbTours,
        nbPtVictoire: this.nbPtVictoire,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        complement: this.state.complement,
        screenStackName: 'InscriptionsAvecNoms'
      }
    })
  }

  _showNbJoueur() {
    let nbJoueur = this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    return (
      <Text>{nbJoueur}</Text>
    )
  }

  _boutonCommencer() {
    let boutonDesactive = false
    let boutonTitle = 'Commencer le tournoi'
    let nbJoueurs = this.props.listesJoueurs[this.props.optionsTournoi.mode].length

    let nbEquipes
    if (this.props.optionsTournoi.typeEquipes == "teteatete") {
      nbEquipes = nbJoueurs
    }
    else if (this.props.optionsTournoi.typeEquipes == "doublette") {
      nbEquipes = Math.ceil(nbJoueurs / 2)
    }
    else {
      nbEquipes = Math.ceil(nbJoueurs / 3)
    }

    if (this.props.optionsTournoi.type == 'coupe' && (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)) {
      boutonTitle = "En coupe, le nombre d'équipes doit être de 4, 8, 16, ..."
      boutonDesactive = true
    }
    else if (this.props.optionsTournoi.mode == 'avecEquipes') {
      if (this.props.listesJoueurs.avecEquipes.find(el => el.equipe == undefined) != undefined || this.props.listesJoueurs.avecEquipes.find(el => el.equipe > nbEquipes) != undefined) {
        boutonTitle = "Des joueurs n'ont pas d'équipe"
        boutonDesactive = true
      }
      else if (this.props.optionsTournoi.typeEquipes == "teteatete") {
        if (this.props.listesJoueurs.avecEquipes.length % 2 != 0 || this.props.listesJoueurs.avecEquipes.length < 2) {
          boutonTitle = "Le nombre d'equipe doit être un multiple de 2"
          boutonDesactive = true
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 1) {
              boutonTitle = "Des équipes ont trop de joueurs"
              boutonDesactive = true
              break
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "doublette") {
        if (this.props.listesJoueurs.avecEquipes.length % 4 != 0 || this.props.listesJoueurs.avecEquipes.length == 0) {
          boutonTitle = "Avec des équipes en doublette, le nombre de joueurs doit être un multiple de 4"
          boutonDesactive = true
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              boutonTitle = "Des équipes ont trop de joueurs"
              boutonDesactive = true
              break
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecEquipes.length % 6 != 0 || this.props.listesJoueurs.avecEquipes.length == 0)) {
        boutonTitle = "En triplette avec des équipes formées, le nombre de joueurs doit être un multiple de 6"
        boutonDesactive = true
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "teteatete" && (this.props.listesJoueurs.avecNoms.length % 2 != 0 || this.props.listesJoueurs.avecNoms.length < 2)) {
      boutonTitle = "En tête-à-tête, le nombre de joueurs doit être un multiple de 2"
      boutonDesactive = true
    }
    else if (this.props.optionsTournoi.typeEquipes == "doublette" && (this.props.listesJoueurs.avecNoms.length % 4 != 0 || this.props.listesJoueurs.avecNoms.length < 4)) {
      if (this.props.listesJoueurs.avecNoms.length < 4) {
        boutonTitle = "Pas assez de joueurs"
        boutonDesactive = true
      }
      else if (this.props.listesJoueurs.avecNoms.length % 2 == 0 && this.state.complement == "1") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera un tête-à-tête"
      }
      else if (this.state.complement == "3") {
        if (this.props.listesJoueurs.avecNoms.length == 7) {
          boutonTitle = "Mode 3vs2 + 1vs1 n'est pas encore disponible"
          boutonDesactive = true
        }
        else {
          boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera des triplettes pour compléter"
        }
      }
      else if (this.state.complement != "3") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, veuiller choisir l'option pour former des triplettes pour compléter si vous voulez lancer"
        boutonDesactive = true
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecNoms.length % 6 != 0 || this.props.listesJoueurs.avecNoms.length < 6)) {
      boutonTitle = "En triplette, le nombre de joueurs doit être un multiple de 6"
      boutonDesactive = true
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
  }

  _boutonOptions() {
    if (this.props.optionsTournoi.type != 'championnat' && this.props.optionsTournoi.type != 'coupe') {
      return (
        <Button color='#1c3969' title='Options Tournoi' onPress={() => this._options()}/>
      )
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.text_container}>
          <Text style={styles.text_nbjoueur}>Il y a : {this._showNbJoueur()} inscrit.e.s</Text>
        </View>
          <Inscriptions 
            navigation={this.props.navigation}
            loadListScreen={false}
          />
        <View>
          <View style={styles.buttonView}>
            {this._boutonOptions()}
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
    backgroundColor: "#0594ae"
  },
  text_container: {
    alignItems: 'center',
    marginTop: 5
  },
  text_nbjoueur: {
    fontSize: 20,
    color: 'white'
  },
  buttonView: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(InscriptionsAvecNoms)
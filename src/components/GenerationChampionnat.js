import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import { connect } from 'react-redux'
import { generationChampionnat } from 'utils/generations/championnat';

class GenerationChampionnat extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5;
    this.nbPtVictoire = 13;
    this.speciauxIncompatibles = true;
    this.jamaisMemeCoequipier = true;
    this.eviterMemeAdversaire = true;
    this.typeEquipes = "doublette";
    this.state = {
      isLoading: true,
      isValid: true,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false
    }
  }

  _ajoutMatchs = (matchs) => {
    //this._supprimerMatchs();
    const action = { type: "AJOUT_MATCHS", value: matchs };
    this.props.dispatch(action);
    const actionAjoutTournoi = { type: "AJOUT_TOURNOI", value: {tournoi: matchs} }
    this.props.dispatch(actionAjoutTournoi);
  }

  _supprimerMatchs () {
    const action = { type: "SUPPR_MATCHS" };
    this.props.dispatch(action);
  }

  componentDidMount() {
    setTimeout(() => {
      this._generation();
    }, 1000);
  }

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'ListeMatchsInscription'}],
    });
  }

  _generation() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbPtVictoire != undefined) {
        this.nbPtVictoire = routeparams.nbPtVictoire;
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles;
      }
      if (routeparams.memesEquipes != undefined) {
        this.jamaisMemeCoequipier = routeparams.memesEquipes;
      }
      if (routeparams.memesAdversaires != undefined) {
        this.eviterMemeAdversaire = routeparams.memesAdversaires;
      }
    }
    
    const {matchs, nbTours, nbMatchs} = generationChampionnat(this.props.optionsTournoi, this.props.listesJoueurs);

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: this.props.listeTournois.length,
      nbTours: nbTours,
      nbPtVictoire: this.nbPtVictoire,
      nbMatchs: nbMatchs,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      listeJoueurs: this.props.listesJoueurs.avecEquipes.slice()
    });

    //Ajout dans le store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    });

    //Affichage des matchs
    this._displayListeMatch(matchs);
  }

  _displayLoading() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="#ffda00"/>
          <Text style={styles.texte}>Génération des parties, veuillez patienter</Text>
        </View>
      )
    }
  }

  _retourInscription() {
    this.props.navigation.navigate({
      name: this.props.route.params.screenStackName,
      params: {
        nbTours: this.nbTours.toString(),
        nbPtVictoire: this.nbPtVictoire,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.jamaisMemeCoequipier,
        memesAdversaires: this.eviterMemeAdversaire,
        typeEquipes: this.state.typeEquipes
      }
    });
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texte: {
    fontSize: 15,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(GenerationChampionnat)
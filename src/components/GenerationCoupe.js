import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'

class GenerationCoupe extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5;
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
      this._lanceurGeneration();
    }, 1000);
  }

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'ListeMatchsInscription'}],
    })
  }

  _lanceurGeneration() {
    this._generation();
  }
  _generation() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.speciauxIncompatibles != undefined) {
        speciauxIncompatibles = routeparams.speciauxIncompatibles;
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles;
      }
      if (routeparams.memesEquipes != undefined) {
        jamaisMemeCoequipier = routeparams.memesEquipes;
        this.jamaisMemeCoequipier = routeparams.memesEquipes;
      }
      if (routeparams.memesAdversaires != undefined) {
        eviterMemeAdversaire = routeparams.memesAdversaires;
        this.eviterMemeAdversaire = routeparams.memesAdversaires;
      }
    }

    this.typeEquipes = this.props.optionsTournoi.typeEquipe;
    let nbjoueurs = this.props.listesJoueurs.avecEquipes.length;
    let speciauxIncompatibles = true
    let jamaisMemeCoequipier = true
    let eviterMemeAdversaire = true;
    let matchs = [];
    let equipe = [];

    //Initialisation des matchs dans un tableau
    let nbEquipes
    let nbMatchsPremierTour
    if (this.typeEquipes == "teteatete") {
      nbEquipes = nbjoueurs;
      nbMatchsPremierTour = nbjoueurs / 2;
    }
    else if (this.typeEquipes == "doublette") {
      nbEquipes = nbjoueurs / 2;
      nbMatchsPremierTour = Math.ceil(nbjoueurs / 4);
    }
    else {
      nbEquipes = nbjoueurs / 3;
      nbMatchsPremierTour = Math.ceil(nbjoueurs / 6);
    }
    this.nbTours = Math.log2(nbEquipes);
    let nbMatchs = 0;
    let idMatch = 0;
    for (let i = 1, nbMatchsParTour = nbMatchsPremierTour; i < this.nbTours + 1; i++, nbMatchsParTour/=2) {
      for (let j = 0; j < nbMatchsParTour; j++) {
        matchs.push({id: idMatch, manche: i, mancheName: "1/" + nbMatchsParTour, equipe: [[-1,-1,-1],[-1,-1,-1]], score1: undefined, score2: undefined});
        idMatch++;
      }
    }
    nbMatchs = idMatch;
    matchs[matchs.length - 1].mancheName = "Finale";
    //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
    for (let i = 1; i <= nbEquipes; i++) {
      equipe.push([]);
      for (let j = 0; j < nbjoueurs; j++) {
        if (this.props.listesJoueurs.avecEquipes[j].equipe == i) {
          equipe[i - 1].push(this.props.listesJoueurs.avecEquipes[j].id);
        }
      }
    }

    //On place les ids des équipes dans un tableau qui sera décalé à chaque nouveaux tour
    let equipesIds = [];
    for (let i = 0; i < nbEquipes; i++) {
      equipesIds.push(i);
    }

    //FONCTIONNEMENT
    idMatch = 0;
    for (let j = 0; j < equipe.length / 2; j++) {
      //Affectation Equipe 1
      matchs[idMatch].equipe[0][0] = equipe[equipesIds[j]][0];
      if (this.typeEquipes == "doublette" || this.typeEquipes == "triplette") {
        matchs[idMatch].equipe[0][1] = equipe[equipesIds[j]][1];
      }
      if (this.typeEquipes == "triplette") {
        matchs[idMatch].equipe[0][2] = equipe[equipesIds[j]][2];
      }

      //Affectation Equipe 2
      matchs[idMatch].equipe[1][0] = equipe[equipesIds[nbEquipes - 1 - j]][0];
      if (this.typeEquipes == "doublette" || this.typeEquipes == "triplette") {
        matchs[idMatch].equipe[1][1] = equipe[equipesIds[nbEquipes - 1 - j]][1];
      }
      if (this.typeEquipes == "triplette") {
        matchs[idMatch].equipe[1][2] = equipe[equipesIds[nbEquipes - 1 - j]][2];
      }
      idMatch++;
    }
    equipesIds.splice(1, 0, equipesIds.pop());

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: this.props.listeTournois.length,
      nbTours: this.nbTours,
      nbMatchs: nbMatchs,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      typeTournoi: 'coupe',
      listeJoueurs: this.props.listesJoueurs.avecEquipes.slice()
    });

    //Ajout dans le store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    })

    //Affichage des matchs
    this._displayListeMatch(matchs);

    return;
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
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.jamaisMemeCoequipier,
        memesAdversaires: this.eviterMemeAdversaire,
        typeEquipes: this.state.typeEquipes,
        typeTournoi: 'coupe'
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

export default connect(mapStateToProps)(GenerationCoupe)
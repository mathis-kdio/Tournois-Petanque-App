import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { generationChampionnat } from 'utils/generations/championnat'
import { generationCoupe } from 'utils/generations/coupe'
import { generationAvecEquipes } from 'utils/generations/tournoiAvecEquipes'
import { generationDoublettes } from 'utils/generations/tournoiDoublettes'
import { generationTeteATete } from 'utils/generations/tournoiTeteATete'
import { generationTriplettes } from 'utils/generations/tournoiTriplettes'

class GenerationMatchs extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5;
    this.nbPtVictoire = 13;
    this.speciauxIncompatibles = true;
    this.jamaisMemeCoequipier = true;
    this.eviterMemeAdversaire = true;
    this.typeEquipes = "doublette";
    this.typeInscription = "avecNoms";
    this.complement = "3";
    this.typeTournoi = "mele-demele"
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
    const actionAjoutMatchs = { type: "AJOUT_MATCHS", value: matchs };
    this.props.dispatch(actionAjoutMatchs);
    const actionAjoutTournoi = { type: "AJOUT_TOURNOI", value: {tournoi: matchs} };
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
    });
  }

  _lanceurGeneration() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    this.nbTours = this.props.optionsTournoi.nbTours;
    this.nbPtVictoire = this.props.optionsTournoi.nbPtVictoire;
    this.speciauxIncompatibles = this.props.optionsTournoi.speciauxIncompatibles;
    this.jamaisMemeCoequipier = this.props.optionsTournoi.memesEquipes;
    this.eviterMemeAdversaire = this.props.optionsTournoi.memesAdversaires;
    this.typeEquipes = this.props.optionsTournoi.typeEquipes;
    this.typeInscription = this.props.optionsTournoi.mode;
    this.complement = this.props.optionsTournoi.complement;
    this.typeTournoi = this.props.optionsTournoi.type;

    let listeJoueurs = this.props.listesJoueurs[this.typeInscription];
    let nbjoueurs = listeJoueurs.length;
    let nbGenerationsRatee = 0;
    let nbEssaisPossibles = nbjoueurs * nbjoueurs;
    let returnType = 0;
    // 3 types de retour possible: 
    // 0 si trop de personnes de type enfants ou règle pas memeEquipes impossible; 
    // 1 si breaker activé
    // 2 si génération réussie
    //Tant que la génération échoue à cause du breaker alors on relancer
    while (nbGenerationsRatee < nbEssaisPossibles) {
      returnType = this._generation()
      if (returnType == 0 || returnType == 2) {
        break;
      }
      else {
        nbGenerationsRatee++;
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee == nbEssaisPossibles) {
      this.setState({
        isGenerationSuccess: false,
        isLoading: false
      });
    }
  }

  _generation() {
    let matchs = [];
    let nbMatchs = undefined;
    let nbTours = this.nbTours;
    let erreurMemesEquipes = undefined;
    let erreurSpeciaux = undefined;
    let echecGeneration = undefined;
    if (this.typeTournoi == "mele-demele") {
      if (this.typeInscription == 'avecEquipes') {
        ({matchs, nbMatchs, echecGeneration} = generationAvecEquipes(this.props.listesJoueurs.avecEquipes, this.nbTours, this.typeEquipes));
      }
      else if (this.typeEquipes == "teteatete") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.typeInscription], this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.typeEquipes == "doublette") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.typeInscription], this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.typeEquipes == "triplette") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationTriplettes(this.props.listesJoueurs[this.typeInscription], this.nbTours));
      }
      else {
        echecGeneration = true;
      }
    }
    else if (this.typeTournoi == "coupe") {
      ({matchs, nbTours, nbMatchs} = generationCoupe(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else if (this.typeTournoi == "championnat") {
      ({matchs, nbTours, nbMatchs} = generationChampionnat(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else {
      echecGeneration = true;
    }
    if (erreurMemesEquipes || erreurSpeciaux) {
      this.setState({
        erreurMemesEquipes: erreurMemesEquipes,
        erreurSpeciaux: erreurSpeciaux,
        isLoading: false
      });
      return 0;
    }
    if (echecGeneration) {
      return 1;
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: undefined,
      nbTours: nbTours,
      nbMatchs: nbMatchs,
      nbPtVictoire: this.nbPtVictoire,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      complement: this.complement,
      typeTournoi: this.typeTournoi,
      listeJoueurs: this.props.listesJoueurs[this.typeInscription].slice()
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

    //Si génération valide alors return 2
    return 2;
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

  _displayErrorGenerationFail() {
    if (this.state.isGenerationSuccess === false && this.state.isLoading === false) {
      return (
        <View style={styles.error_container}>
          <Text style={styles.texte}>La générations n'a pas réussie, certaines options rendent la génération trop compliqué.</Text>
          <Button title="Retourner à l'inscription" onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _displayErreurSpeciaux() {
    if (this.state.erreurSpeciaux == true && this.state.isLoading == false) {
      return (
        <View style={styles.error_container}>
          <Text style={styles.texte}>La générations ne peux pas fonctionner avec les options.</Text>
          <Text style={styles.texte}>Il y a trop d'enfants pour appliquer l'option de les faire jouer séparement</Text>
          <Button title="Désactiver l'option ou enlever des enfants" onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _displayErreurMemesEquipes() {
    if (this.state.erreurMemesEquipes == true && this.state.isLoading == false) {
      return (
        <View style={styles.error_container}>
          <Text style={styles.texte}>La générations ne peux pas fonctionner avec les options.</Text>
          <Text style={styles.texte}>Il semble trop compliqué de ne jamais faire jouer des équipes identiques</Text>
          <Button title="Désactiver l'option ou rajouter des joueurs ou diminuer le nombre de tours" onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _retourInscription() {
    this.props.navigation.navigate(this.props.route.params.screenStackName);
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayErreurSpeciaux()}
        {this._displayErreurMemesEquipes()}
        {this._displayErrorGenerationFail()}
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
  error_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%'
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

export default connect(mapStateToProps)(GenerationMatchs)
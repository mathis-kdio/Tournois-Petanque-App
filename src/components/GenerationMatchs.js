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
    let listeJoueurs = this.props.listesJoueurs[this.typeInscription];
    let nbjoueurs = listeJoueurs.length;
    let nbGenerationsRatee = 0;
    let nbEssaisPossibles = Math.pow(nbjoueurs, nbjoueurs);
    let returnType = 0;
    // 3 types de retour possible: 
    // 0 si trop de personnes spéciaux ou règle pas memeEquipes impossible; 
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
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours;
      }
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
      if (routeparams.typeEquipes != undefined) {
        this.typeEquipes = routeparams.typeEquipes;
      }
      if (routeparams.typeInscription != undefined) {
        this.typeInscription = routeparams.typeInscription;
      }
      if (routeparams.complement != undefined) {
        this.complement = routeparams.complement;
      }
    }

    let matchs = undefined;
    let nbMatchs = undefined;
    let nbTours = this.nbTours;
    let erreurMemesEquipes = undefined;
    let erreurSpeciaux = undefined;
    let echecGeneration = undefined;
    console.log(this.typeInscription)
    switch (this.typeInscription) {
      /*case "teteatete":
        (matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration) = generationTeteATete(listeJoueurs, this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire);
        break;*/
      case "doublette" || "teteatete":
        (matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration) = generationDoublettes(this.props.listesJoueurs[this.typeInscription], this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire);
        break;
      case "triplette":
        (matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration) = generationTriplettes(this.props.listesJoueurs[this.typeInscription], this.nbTours);
        break;
      case "avecEquipes":
        (matchs, nbMatchs, echecGeneration) = generationAvecEquipes(this.props.listesJoueurs.avecEquipes, this.nbTours, this.typeEquipes);
        break;
      case "coupe":
        (matchs, nbTours, nbMatchs) = generationCoupe(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes);
        break;
      case "championnat":
        (matchs, nbTours, nbMatchs) = generationChampionnat(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes);
        break;
      default:
        break;
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
      listeJoueurs: listeJoueurs.slice()
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
          <Button title='Changer des options' onPress={() => this._retourInscription()}/>
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
          <Text style={styles.texte}>Il y semble trop compliqué de ne jamais faire jouer des équipes identiques</Text>
          <Button title="Désactiver l'option ou rajouter des joueurs ou diminuer le nombre de tours" onPress={() => this._retourInscription()}/>
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
        typeEquipes: this.typeEquipes
      }
    });
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
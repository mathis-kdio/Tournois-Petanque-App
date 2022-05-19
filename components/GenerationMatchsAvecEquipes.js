import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'

class GenerationMatchsAvecEquipes extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5
    this.speciauxIncompatibles = true
    this.jamaisMemeCoequipier = true
    this.eviterMemeAdversaire = true
    this.typeEquipes = "doublette"
    this.state = {
      isLoading: true,
      isValid: true,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false
    }
  }

  _ajoutMatchs = (matchs) => {
    this._supprimerMatchs();
    const action = { type: "AJOUT_MATCHS", value: matchs }
    this.props.dispatch(action);
  }

  _supprimerMatchs () {
    const action = { type: "SUPPR_MATCHS" }
    this.props.dispatch(action)
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
      key: null
    })
  }

  _lanceurGeneration() {
    let nbjoueurs = this.props.listesJoueurs.avecEquipes.length;
    let nbGenerationsRatee = 0
    let nbEssaisPossibles = Math.pow(nbjoueurs, nbjoueurs)
    let returnType = 0
    // 3 types de retour possible: 
    // 0 si trop de personnes spéciaux ou règle pas memeEquipes impossible; 
    // 1 si breaker activé
    // 2 si génération réussie
    //Tant que la génération échoue à cause du breaker alors on relancer
    while (nbGenerationsRatee < nbEssaisPossibles) {
      returnType = this._generation()
      if (returnType == 0 || returnType == 2) {
        break
      }
      else {
        nbGenerationsRatee++
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee == nbEssaisPossibles) {
      this.setState({
        isGenerationSuccess: false,
        isLoading: false
      })
    }
  }

  randomBetween(a, b) {
    return (parseInt((Math.random() * (b - a)) + a))
  }
  randomBetweenRange (num, range) {
    const res = [];
    for (let i = 0; i < num; ) {
        const random = this.randomBetween(range[0], range[1])
        if (this.countOccurrences(res, random) < 2) {
          res.push(random)
          i++
        }
    }
    return res
  }

  countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  _generation() {
    let nbjoueurs = this.props.listesJoueurs.avecEquipes.length;
    let speciauxIncompatibles = true
    let jamaisMemeCoequipier = true
    let eviterMemeAdversaire = true;
    let matchs = [];
    let idMatch = 0;
    let equipe = []

    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        speciauxIncompatibles = routeparams.speciauxIncompatibles
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles
      }
      if (routeparams.memesEquipes != undefined) {
        jamaisMemeCoequipier = routeparams.memesEquipes
        this.jamaisMemeCoequipier = routeparams.memesEquipes
      }
      if (routeparams.memesAdversaires != undefined) {
        eviterMemeAdversaire = routeparams.memesAdversaires
        this.eviterMemeAdversaire = routeparams.memesAdversaires
      }
      if (routeparams.typeEquipes != undefined) {
        this.typeEquipes = routeparams.typeEquipes
      }
    }

    //Initialisation des matchs dans un tableau
    let nbEquipes
    let nbMatchsParTour
    if (this.typeEquipes == "teteatete") {
      nbEquipes = nbjoueurs
      nbMatchsParTour = nbjoueurs / 2
    }
    else if (this.typeEquipes == "doublette") {
      nbEquipes = nbjoueurs / 2
      nbMatchsParTour = Math.ceil(nbjoueurs / 4)
    }
    else {
      nbEquipes = nbjoueurs / 3
      nbMatchsParTour = Math.ceil(nbjoueurs / 6)
    }
    let nbMatchs = this.nbTours * nbMatchsParTour

    idMatch = 0;
    for (let i = 1; i < this.nbTours + 1; i++) {
      for (let j = 0; j < nbMatchsParTour; j++) {
        matchs.push({id: idMatch, manche: i, equipe: [[0,0,0],[0,0,0]], score1: undefined, score2: undefined});
        idMatch++;
      }
    }

    //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
    for (let i = 1; i <= nbEquipes; i++) {
      equipe.push([])
      for (let j = 0; j < nbjoueurs; j++) {
        if(this.props.listesJoueurs.avecEquipes[j].equipe == i) {
          equipe[i - 1].push(this.props.listesJoueurs.avecEquipes[j].id)
        }
      }
    }

    //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
    let equipesIds = [];
    for (let i = 0; i < nbEquipes; i++) {
      equipesIds.push(i);
    }
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    }

    //FONCTIONNEMENT
    idMatch = 0;
    let breaker = 0 //permet de détecter quand boucle infinie
    for (let i = 0; i < this.nbTours; i++) {
      breaker = 0
      let randomEquipesIds = shuffle(equipesIds)
      for (let j = 0; j < equipe.length;) {
        //Affectation equipe 1
        if (matchs[idMatch].equipe[0][0] == 0) {
          matchs[idMatch].equipe[0][0] = equipe[randomEquipesIds[j]][0]
          if (this.typeEquipes == "doublette" || this.typeEquipes == "triplette") {
            matchs[idMatch].equipe[0][1] = equipe[randomEquipesIds[j]][1]
          }
          if (this.typeEquipes == "triplette") {
            matchs[idMatch].equipe[0][2] = equipe[randomEquipesIds[j]][2]
          }
          j++
          breaker = 0
        }
        //Affectation Equipe 2
        if (matchs[idMatch].equipe[1][0] == 0) {
          //Test si les équipes 1 et 2 n'ont pas déjà jouées ensemble
          if (eviterMemeAdversaire == true) {
            matchs[idMatch].equipe[1][0] = equipe[randomEquipesIds[j]][0]
            if (this.typeEquipes == "doublette" || this.typeEquipes == "triplette") {
              matchs[idMatch].equipe[1][1] = equipe[randomEquipesIds[j]][1]
            }
            if (this.typeEquipes == "triplette") {
              matchs[idMatch].equipe[1][2] = equipe[randomEquipesIds[j]][2]
            }
            j++
            breaker = 0
          }
        }
        else {
          breaker++
        }

        idMatch++;
        //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
        if (idMatch >= nbMatchsParTour * (i + 1)) {
          idMatch = i * nbMatchsParTour;
        }

        //En cas de trop nombreuses tentatives, arret de la génération
        //L'utilisateur est invité à changer les paramètres ou à relancer la génération
        //TODO condition de break à affiner
        //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / this.nbTours
        if (breaker > nbMatchs) {
          return 1
        }
      }

      //Permettra de retenir contre quelles équipes une équipe a joué
      /*idMatch = i * nbMatchsParTour;
      for (let j = 0; j < nbMatchsParTour; j++) {
        joueurs[matchs[idMatch + j].equipe[0][0] - 1].equipe.push(matchs[idMatch + j].equipe[0][1]);
        joueurs[matchs[idMatch + j].equipe[0][1] - 1].equipe.push(matchs[idMatch + j].equipe[0][0]);
        joueurs[matchs[idMatch + j].equipe[1][0] - 1].equipe.push(matchs[idMatch + j].equipe[1][1]);
        joueurs[matchs[idMatch + j].equipe[1][1] - 1].equipe.push(matchs[idMatch + j].equipe[1][0]);
      }*/
      idMatch = nbMatchsParTour * (i + 1);
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: this.props.listeTournois.length,
      nbTours: this.nbTours,
      nbMatchs: nbMatchs,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      listeJoueurs: this.props.listesJoueurs.avecEquipes.map(item => Array.isArray(item) ? clone(item) : item)
    })

    //Ajout dans le store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    })

    //Affichage des matchs
    this._displayListeMatch(matchs);

    //Si génération valide alors return 2
    return 2
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

  _retourInscription() {
    this.props.navigation.navigate({
      name: this.props.route.params.screenStackName,
      params: {
        nbTours: this.nbTours.toString(),
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.jamaisMemeCoequipier,
        memesAdversaires: this.eviterMemeAdversaire,
        typeEquipes: this.state.typeEquipes
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
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
      listeTournois: state.listeTournois.listeTournois
    }
}

export default connect(mapStateToProps)(GenerationMatchsAvecEquipes)
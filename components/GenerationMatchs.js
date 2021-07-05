import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'

class GenerationMatchs extends React.Component {
  constructor(props) {
    super(props)
    this.incompatibleMatch = []; //Joueur incompatible pour le match
    this.nonDisponibleManche = []; //Joueur déjà choisi pour la manche
    this.dejaPartenaires = []; //Joueur déjà été partenaires
    this.dejaJouerContre = []; //Joueur déjà joué contre
    this.state = {
      isLoading: true,
      isValid: true,
      isGenerationSuccess: true
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
    let matchs = 0;
    setTimeout(() => {
      this._generation();
    }, 1000);
  }

  _displayListeMatch () {
    this.props.navigation.navigate('ListeMatchsInscription');
  }

  //Test si joueur randomNum déjà affecté pour cette manche
  _testNonDisponible = (randomNum) => {
    const excluIndex = this.nonDisponibleManche.findIndex(item => item === randomNum);
    if (excluIndex !== -1) {
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0
  }

  _testNonCompatible = (randomNum) => {
    const excluIndex = this.incompatibleMatch.findIndex(item => item === randomNum);
    if (excluIndex !== -1) {
      console.log('Joueur déjà marqué incompatible pour ce match avec rand=', randomNum);
      return 1;
    }
    return 0
  }

  //Test si le 1er joueur déjà choisi et le nouveau joueur sont tout les 2 femme/enfant
  _testSpeciaux = (randomNum, partenaire) => {
    let joueurSpecial1 = this.props.listeJoueurs.find(item => item.id === partenaire);
    let joueurSpecial2 = this.props.listeJoueurs.find(item => item.id === randomNum);
    if (joueurSpecial1.special === true && joueurSpecial2.special === true) {
      console.log('Joueurs sont spéciaux: j1: ', randomNum, '  j2: ', partenaire);
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0;
  }
  
  //Test si les joueurs ont déjà joués en tant que partenaires dans les manches précédentes
  _testDejaEtePartenaires = (randomNum, partenaire) =>  {
    let dejaJoueAvecIndex = this.dejaPartenaires[randomNum].findIndex(item => item === partenaire)
    if (dejaJoueAvecIndex !== -1) {
      console.log('Joueur deja partenaires');
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0;
  }
  
  //Test si randomNum a déjà jouer contre joueur 1 ou joueur 2 dans une manche précédente
  _testDejaJouerContre = (randomNum, joueurAdverse) =>  {
    if (this.dejaJouerContre[randomNum] !== undefined) {
      let dejaJoueContreIndex = this.dejaJouerContre[randomNum].findIndex(item => item.joueur === joueurAdverse)
      if (dejaJoueContreIndex !== -1) {
        console.log('Joueur à déjà joué un joueur en face comme adversaire')
        this.incompatibleMatch.push(randomNum);
        return 1;
      }
    }
    return 0;
  }

  _generation() {
    let nbjoueurs = this.props.listeJoueurs.length;
    let nbManches = 5;
    let jamaisMemeCoequipier = true;
    let jamaisMemeAdversaire = true;
    let matchs = [];
    let idMatch = 0;
    let joueursSpe = [];
    let joueursNonSpe = [];
    let joueurs = [];

    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        nbManches = routeparams.nbTours
      }
      else {
        nbManches = 5
      }
    }

    //Test si nombre de joueurs multiple de 4
    if (nbjoueurs % 4 !== 0) {
      this.setState({
        isValid: false,
        isLoading: false
      })
      return 0;
    }

    for (let i = 0; i < nbjoueurs; i++) {
      if (this.props.listeJoueurs[i].special === true) {
        joueursSpe.push(this.props.listeJoueurs[i]);
      }
      else {
        joueursNonSpe.push(this.props.listeJoueurs[i]);
      }
      joueurs.push(this.props.listeJoueurs[i]);
      joueurs[i].equipe = [];
    }

    idMatch = 0;
    for (let i = 1; i < nbManches + 1; i++) {
      for (let j = 0; j < nbjoueurs / 4; j++) {
        matchs.push({id: idMatch, manche: i, joueur1: 0, joueur2: 0, joueur3: 0, joueur4: 0, score1: undefined, score2: undefined});
        idMatch++;
      }      
    }

    //TEST si trop de femmes/enfants
    //On assigne les enfants et les femmes
    //Si + de la moitié des joueurs sont des enfants ou des femmes alors ça ne sert à rien de les séparer
    if (joueursSpe.length <= nbjoueurs / 2) {
      idMatch = 0;
      for (let i = 0; i < nbManches; i++) {
        for (let j = 0; j < joueursSpe.length; j++) {
          if (matchs[idMatch].joueur1 == 0) {
            matchs[idMatch].joueur1 = joueursSpe[j].id;
          }
          else if (matchs[idMatch].joueur3 == 0) {
            matchs[idMatch].joueur3 = joueursSpe[j].id;
          }
          idMatch++;
          if (idMatch > (nbjoueurs / 4) * (i + 1) - 1) {
            idMatch = i * (nbjoueurs / 4);
          }
        }
        idMatch = (nbjoueurs / 4) * (i + 1);
      }
    }
    else {
      joueursNonSpe.splice(0, joueursNonSpe.length)
      for (let i = 0; i < nbjoueurs; i++) {
        joueursNonSpe.push(this.props.listeJoueurs[i]);
      }
    }

    //Test si possible d'appliquer la règle jamaisMemeCoequipier
    let nbMatchs = nbManches * (nbjoueurs / 4);
    let nbCombinaisons = Math.pow(nbjoueurs / 2, nbjoueurs - 1);
    //Si on applique la règle de ne pas mettre des femmes et des enfants ensemble alors moins de combinaisons
    if(joueursSpe.length <= nbjoueurs / 2) {
      nbCombinaisons -= joueursSpe.length;
    }

    //Si + de matchs que de combinaisons alors on désactive la règle de ne jamais faire jouer dans la même équipe
    if (nbMatchs >= nbCombinaisons) {
      jamaisMemeCoequipier = false;
      /*this.setState({
        isValid: false,
        isLoading: false
      })
      return 0;*/      
    }

    //Test si possible d'appliquer la règle jamaisMemeAdversaire
    //jamaisMemeAdversaire = false;


    //On ordonne aléatoirement les ids des joueurs non spé à chaque début de manche
    let numbers = [];
    for (let i = 0; i < joueursNonSpe.length; i++) {
      numbers.push(joueursNonSpe[i].id);
    }
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };


    idMatch = 0;
    let breaker = 0
    for (let i = 0; i < nbManches; i++) {
      breaker = 0
      let random = shuffle(numbers);
      for (let j = 0; j < joueursNonSpe.length;) {
        if (matchs[idMatch].joueur1 == 0) {
          matchs[idMatch].joueur1 = random[j];
          j++
        }
        else if (matchs[idMatch].joueur2 == 0) {
          //Empeche que le joueur 1 joue plusieurs fois dans la même équipe avec le même joueur
          //Ne s'applique qu'à partir de la manche 2
          if (jamaisMemeCoequipier == true && i > 0) {
            if (joueurs[random[j] - 1].equipe.includes(matchs[idMatch].joueur1) == false) {
              matchs[idMatch].joueur2 = random[j];
              j++
            }
            else {
              breaker++
            }
          }
          else {
            matchs[idMatch].joueur2 = random[j];
            j++
          }
        }
        else if (matchs[idMatch].joueur3 == 0) {
          matchs[idMatch].joueur3 = random[j];
          j++
        }
        else if (matchs[idMatch].joueur4 == 0) {
          //Empeche que le joueur 4 joue plusieurs fois dans la même équipe avec le même joueur
          //Ne s'applique qu'à partir de la manche 2
          if (jamaisMemeCoequipier == true && i > 0) {
            if (joueurs[random[j] - 1].equipe.includes(matchs[idMatch].joueur3) == false) {
              matchs[idMatch].joueur4 = random[j];
              j++
            }
            else {
              breaker++
            }
          }
          else {
            matchs[idMatch].joueur4 = random[j];
            j++
          }
        }
        else {
          breaker++
        }

        idMatch++;
        if (idMatch >= (nbjoueurs / 4) * (i + 1)) {
          idMatch = i * (nbjoueurs / 4);
        }

        if (breaker > nbjoueurs * nbjoueurs) {
          this.setState({
            isGenerationSuccess: false,
            isLoading: false
          })
          return 0
        }

      }

      idMatch = i * (nbjoueurs / 4);
      for (let j = 0; j < nbjoueurs / 4; j++) {
        joueurs[matchs[idMatch + j].joueur1 - 1].equipe.push(matchs[idMatch + j].joueur2);
        joueurs[matchs[idMatch + j].joueur2 - 1].equipe.push(matchs[idMatch + j].joueur1);
        joueurs[matchs[idMatch + j].joueur3 - 1].equipe.push(matchs[idMatch + j].joueur4);
        joueurs[matchs[idMatch + j].joueur4 - 1].equipe.push(matchs[idMatch + j].joueur3);
      }
      idMatch = (nbjoueurs / 4) * (i + 1);
    }

    matchs.push({
      tournoiID: 0,
      nbManches: nbManches,
      nbMatchs: nbMatchs
    })

    this._ajoutMatchs(matchs);

    this.setState({
      isLoading: false,
      isValid: true,
    })

    this._displayListeMatch(matchs);

  }

  _displayLoading() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="#00ff00"/>
          <Text>Génération des parties, veuillez patienter</Text>
        </View>
      )
    }
  }

  _displayErrorNbJoueur() {
    if (this.state.isValid === false && this.state.isLoading === false) {
      return (
        <View style={styles.loading_container}>
          <Text>Nombre de joueurs non pris en charge, il faut un multiple de 4 !</Text>
          <Button title='Ajouter ou supprimer un joueur' onPress={() => this.props.navigation.goBack()}/>
        </View>
      )
    }
  }

  _displayErrorGenerationFail() {
    if (this.state.isGenerationSuccess === false && this.state.isLoading === false) {
      return (
        <View style={styles.error_container}>
          <Text>La générations n'a pas réussie, vous avez peut-être trop de femmes/enfants ou pas assez de joueurs pour valider toutes les conditions. Vous pouvez aussi essayer en relancant sans rien changer et croiser les doigts.</Text>
          <Button title='Ajouter un joueur ou modifier les conditions' onPress={() => this.props.navigation.goBack()}/>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayErrorNbJoueur()}
        {this._displayErrorGenerationFail()}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1
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
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%'
  },
})

const mapStateToProps = (state) => {
    return {
      listeJoueurs: state.toggleJoueur.listeJoueurs,
      listeMatchs: state.gestionMatchs.listematchs
    }
}

export default connect(mapStateToProps)(GenerationMatchs)
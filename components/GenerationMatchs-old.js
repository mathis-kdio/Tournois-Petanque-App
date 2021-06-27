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
    console.log("nbjoueur:", nbjoueurs)
    let nbManches = 5;
    let retry = 0;
    let randomNum = 0;
    let matchs = [];
    let randJ = [];
    let idMatch = 0;
    let partieParfaite = true;
    let mancheMauvaise = false;
    let countermancheMauvaise = 0;
    let counterPartieMauvaise = 0;

    for (let i = 0; i < nbjoueurs + 1; i++) {
      this.dejaPartenaires[i] = [];
      this.dejaJouerContre[i] = [];
    }

    //Test si nombre de joueurs multiple de 4
    if (nbjoueurs % 4 !== 0) {
      this.setState({
        isValid: false,
        isLoading: false
      })
      return 0;
    }

    //Bonus: Différents retry pour éviter de trop boucler. 
    //       Exemple dernier match d'une manche et un seul randomNum pour joueur 4 qui est incompatible

    do {
      partieParfaite = true;
      for (let i = 0; i < nbManches; i++) {
        console.log('---------------MANCHE:', i+1, '---------------')
        
        do {
          mancheMauvaise = false;
          for (let j = 0; j < nbjoueurs / 4; j++) {
            console.log('------Id match:', idMatch, '------')
            //Joueur 1 et 2
            for (let k = 0; k < 2; k++) {
              console.log("Joueur:", k);
              let counterRetry = 0;
              this.incompatibleMatch = [];
              do {
                retry = 0;
                randomNum = Math.floor(Math.random() * nbjoueurs + 1);

                //Test si randomNum est déjà affecté dans un autre match
                retry = this._testNonDisponible(randomNum);
                if (retry === 0) {
                  //Test si randomNum déjà marqué comme incompatible
                  retry = this._testNonCompatible(randomNum);
                  if (retry === 0 && k === 1) {
                    //Test si joueur 1 et randomNum sont spéciaux tout les 2
                    retry = this._testSpeciaux(randomNum, randJ[0]);
                    if (retry === 0 && i > 0) {
                      //Test si joueur 1 et randomNum ont déjà été partenaires
                      retry = this._testDejaEtePartenaires(randomNum, randJ[0]);
                    }
                    if(retry > 0) {
                      console.log('nb de retry:', counterRetry)
                    }
                  }
                  if(retry > 0) {
                    counterRetry++;
                  }
                }

                if (counterRetry > nbjoueurs) {
                  console.log('ERREUR > ', nbjoueurs);
                  partieParfaite = false;
                  mancheMauvaise = true;
                  retry = 0;
                }
              } while (retry !== 0);
              this.nonDisponibleManche.push(randomNum);
              randJ[k] = randomNum;
            }
            this.dejaPartenaires[randJ[0]].push(randJ[0], randJ[1]);
            this.dejaPartenaires[randJ[0]] = [...new Set(this.dejaPartenaires[randJ[0]])];//Permet d'enlever les doublons
            this.dejaPartenaires[randJ[1]].push(randJ[0], randJ[1]);
            this.dejaPartenaires[randJ[1]] = [...new Set(this.dejaPartenaires[randJ[1]])];//Permet d'enlever les doublons
            
            //Joueur 3 et 4,
            for (let k = 0; k < 2; k++) {
              console.log("Joueur:", k+2);
              let counterRetry = 0;
              this.incompatibleMatch = [];
              do {
                retry = 0;
                randomNum = Math.floor(Math.random() * nbjoueurs + 1);

                //Test si randomNum est déjà affecté dans un autre match
                retry = this._testNonDisponible(randomNum);
                if (retry === 0) {
                  //Test si randomNum déjà marqué comme incompatible
                  retry = this._testNonCompatible(randomNum);
                  if (retry === 0 && k === 1) {
                    //Test si joueur 3 et randomNum sont spéciaux tout les 2
                    retry = this._testSpeciaux(randomNum, randJ[2]);
                    if (retry === 0 && i > 0) {
                      //Test si joueur 3 et randomNum ont déjà été partenaires
                      retry = this._testDejaEtePartenaires(randomNum, randJ[2]);
                    }
                    if(retry > 0) {
                      console.log('nb de retry:', counterRetry)
                    }
                  }
                  if(retry === 0) {
                    //Test si randomNum a déjà jouer contre joueur 1
                    retry = this._testDejaJouerContre(randomNum, randJ[0]);
                    if(retry > 0) {
                      console.log('nb de retry:', counterRetry)
                    }
                    if(retry === 0) {
                      //Test si randomNum a déjà jouer contre joueur 2
                      retry = this._testDejaJouerContre(randomNum, randJ[1]);
                      if(retry > 0) {
                        console.log('nb de retry:', counterRetry)
                      }
                    }
                  }
                  if(retry > 0) {
                    counterRetry++;
                  }
                }

                if (counterRetry > nbjoueurs) {
                  console.log('ERREUR > ', nbjoueurs);
                  partieParfaite = false;
                  mancheMauvaise = true;
                  retry = 0;
                }
              } while (retry !== 0);
              this.nonDisponibleManche.push(randomNum);
              randJ[2+k] = randomNum;
            }
            this.dejaPartenaires[randJ[2]].push(randJ[2], randJ[3]);
            this.dejaPartenaires[randJ[2]] = [...new Set(this.dejaPartenaires[randJ[2]])];//Permet d'enlever les doublons
            this.dejaPartenaires[randJ[3]].push(randJ[2], randJ[3]);
            this.dejaPartenaires[randJ[3]] = [...new Set(this.dejaPartenaires[randJ[3]])];//Permet d'enlever les doublons

            this.dejaJouerContre[randJ[0]].push({joueur: randJ[2], manche: i});
            this.dejaJouerContre[randJ[0]].push({joueur: randJ[3], manche: i});
            this.dejaJouerContre[randJ[1]].push({joueur: randJ[2], manche: i});
            this.dejaJouerContre[randJ[1]].push({joueur: randJ[3], manche: i});
            this.dejaJouerContre[randJ[2]].push({joueur: randJ[0], manche: i});
            this.dejaJouerContre[randJ[2]].push({joueur: randJ[1], manche: i});
            this.dejaJouerContre[randJ[3]].push({joueur: randJ[0], manche: i});
            this.dejaJouerContre[randJ[3]].push({joueur: randJ[1], manche: i});

            matchs.push({id: idMatch, manche: i+1, joueur1: randJ[0], joueur2: randJ[1], joueur3: randJ[2], joueur4: randJ[3], score1: undefined, score2: undefined});

            randJ = [];
            idMatch++;
          }

          //TODO: Valeur à calculer à la place de nbjoueurs
          if (countermancheMauvaise > nbjoueurs) {
            mancheMauvaise = false;
            partieParfaite = false;
          }
          if (mancheMauvaise === true) {
            idMatch -= nbjoueurs / 4;
            for (let k = 0; k < nbjoueurs / 4; k++) {
              let matchpop = matchs.pop ();
              this.dejaPartenaires[matchpop.joueur1].filter(element => element !== matchpop.joueur1 || element !== matchpop.joueur2)
              this.dejaPartenaires[matchpop.joueur2].filter(element => element !== matchpop.joueur1 || element !== matchpop.joueur2)
              this.dejaPartenaires[matchpop.joueur3].filter(element => element !== matchpop.joueur3 || element !== matchpop.joueur4)
              this.dejaPartenaires[matchpop.joueur4].filter(element => element !== matchpop.joueur3 || element !== matchpop.joueur4)
              if (this.dejaJouerContre[randJ[0]] !== undefined) {
                this.dejaJouerContre[randJ[0]].filter(element => element.manche !== i)
              }
              if (this.dejaJouerContre[randJ[1]] !== undefined) {
                this.dejaJouerContre[randJ[1]].filter(element => element.manche !== i)
              }
              if (this.dejaJouerContre[randJ[2]] !== undefined) {
                this.dejaJouerContre[randJ[2]].filter(element => element.manche !== i)
              }
              if (this.dejaJouerContre[randJ[3]] !== undefined) {
                this.dejaJouerContre[randJ[3]].filter(element => element.manche !== i)
              }
            }
            //matchs = matchs.filter(element => element.manche !== i+1);
            console.log("---------------------------MANCHE MAUVAISE----------------------------");
            //console.log("test", matchs);
            countermancheMauvaise++;
            partieParfaite = true;
          }
          this.nonDisponibleManche = [];

        } while (mancheMauvaise === true)

      }

      if (partieParfaite === true) {
        console.log('Partie parfaite en ', countermancheMauvaise, ' essais de reset de manches')
      }
      if (counterPartieMauvaise > nbjoueurs * nbjoueurs)
      {
        console.log('ERREUR VEUILLEZ METTRE + de JOUEUR OU MOINS DE FEMMES/ENFANTS il y a eu ', counterPartieMauvaise, 'générations')
        partieParfaite = true
      }
      //PARTIE IMPOSSIBLE ON RECOMMENCE A GENERER
      if (partieParfaite === false) {
        console.log("Partie mauvaise")

        matchs = [];
        this.incompatibleMatch = [];
        this.nonDisponibleManche = [];
        this.dejaPartenaires = [];
        this.dejaJouerContre = [];
        idMatch = 0;
        countermancheMauvaise = 0;
        for (let i = 0; i < nbjoueurs + 1; i++) {
          this.dejaPartenaires[i] = [];
          this.dejaJouerContre[i] = [];
        }
        counterPartieMauvaise++;
      }

    } while (partieParfaite === false)

    console.log('liste jouer contre', this.dejaJouerContre)
    console.log('liste jouer ensemble', this.dejaPartenaires)

    if (partieParfaite === true && counterPartieMauvaise < nbjoueurs) {
      console.log('Partie parfaite en ', counterPartieMauvaise, ' essais de reset de matchs')
    }


    if (counterPartieMauvaise > nbjoueurs)
    {
      this.setState({
        isLoading: false,
        isGenerationSuccess: false,
      })
    }
    else {
      this._ajoutMatchs(matchs);

      this.setState({
        isLoading: false,
        isValid: true,
      })

      this._displayListeMatch(matchs);
    }

  }

  _displayLoading() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="#00ff00"/>
          <Text>Génération des matchs, veuillez patienter</Text>
        </View>
      )
    }
  }

  _displayErrorNbJoueur() {
    if (this.state.isValid === false && this.state.isLoading === false) {
      return (
        <View style={styles.loading_container}>
          <Text>Nombre de joueurs non pris en charge</Text>
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
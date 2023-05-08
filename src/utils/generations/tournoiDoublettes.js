import { uniqueValueArrayRandOrder } from "./generation";

const testRegleMemeCoequipiersValide = (nbTours, nbjoueurs, nbJoueursSpe, joueursTireurs, joueursPointeurs, moitieNbJoueurs) => {
  let nbCombinaisons = nbjoueurs;
  nbCombinaisons -= nbJoueursSpe;
  if (nbCombinaisons - joueursTireurs > moitieNbJoueurs) {
    nbCombinaisons -= joueursTireurs;
    if (nbCombinaisons - joueursPointeurs > moitieNbJoueurs) {
      nbCombinaisons -= joueursPointeurs;
    }
    else {
      nbCombinaisons = moitieNbJoueurs;
    }
  }
  else {
    nbCombinaisons = moitieNbJoueurs;
  }
  if (nbCombinaisons < nbTours) {
    return false;
  }
  return true;
}

export const generationDoublettes = (listeJoueurs, nbTours, typeEquipes, complement, speciauxIncompatibles, jamaisMemeCoequipier, eviterMemeAdversaire) => {
  let nbjoueurs = listeJoueurs.length;
  let matchs = [];
  let idMatch = 0;
  let joueursEnfants = [];
  let joueursTireurs = [];
  let joueursPointeurs = [];
  let joueursNonType = [];
  let joueursNonSpe = [];
  let joueurs = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour;
  if (typeEquipes == "teteatete") {
    nbMatchsParTour = nbjoueurs / 2;
  }
  else if (typeEquipes == "doublette") {
    if (complement == "1") {
      nbMatchsParTour = Math.ceil(nbjoueurs / 4);
    }
    else {
      nbMatchsParTour = Math.floor(nbjoueurs / 4);
    }
  }
  let nbMatchs = nbTours * nbMatchsParTour;
  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({id: idMatch, manche: i, equipe: [[-1,-1,-1],[-1,-1,-1]], score1: undefined, score2: undefined});
      idMatch++;
    }      
  }

  /*Création de tableaux contenant :
    - Les enfants
    - Les tireurs
    - Les pointeurs
    - Les joueurs hors tireurs, pointeurs et enfants
    - Les tous les joueurs sauf les enfants
    - Tous les joueurs
    Le tableau contenant les tous les joueurs permettra de connaitre dans quel équipe chaque joueur a été
  */
  for (let i = 0; i < nbjoueurs; i++) {
    if (speciauxIncompatibles == true && typeEquipes == "doublette") {
      if (listeJoueurs[i].type === "enfant") {
        joueursEnfants.push({...listeJoueurs[i]});
        joueursEnfants[joueursEnfants.length - 1].equipe = [];
      }
      else {
        if (listeJoueurs[i].type === "tireur") {
          joueursTireurs.push({...listeJoueurs[i]});
          joueursTireurs[joueursTireurs.length - 1].equipe = [];
        }
        else if (listeJoueurs[i].type === "pointeur") {
          joueursPointeurs.push({...listeJoueurs[i]});
          joueursPointeurs[joueursPointeurs.length - 1].equipe = [];
        }
        else {
          joueursNonType.push({...listeJoueurs[i]});
          joueursNonType[joueursNonType.length - 1].equipe = [];
        }
        joueursNonSpe.push({...listeJoueurs[i]});
        joueursNonSpe[joueursNonSpe.length - 1].equipe = [];
      }
    }
    else {
      joueursNonSpe.push({...listeJoueurs[i]});
      joueursNonSpe[joueursNonSpe.length - 1].equipe = [];
    }
    joueurs.push({...listeJoueurs[i]});
    joueurs[i].equipe = [];
  }
  let nbJoueursSpe = joueursEnfants.length;
  //Test si mode doublette et qu'il faut compléter
  //Si c'est le cas, alors on remplie de joueurs invisible pour le complément en mode tête à tête
  if (typeEquipes == "doublette" && nbjoueurs % 4 != 0) {
    if (complement == "1" && nbjoueurs % 2 == 0) {
      joueurs.push({name: "Complément 1", type: "enfant", id: (nbjoueurs)});
      joueurs[nbjoueurs].equipe = [];
      joueurs.push({name: "Complément 2", type: "enfant", id: (nbjoueurs + 1)});
      joueurs[nbjoueurs + 1].equipe = [];
      
      for (let i = 1; i < nbTours + 1; i++) {
        matchs[nbMatchsParTour * i - 1].equipe[0][0] = nbjoueurs;
        matchs[nbMatchsParTour * i - 1].equipe[1][0] = nbjoueurs + 1;
      }
    }
  }

  //Test des règles speciauxIncompatibles et jamaisMemeCoequipier
  if (speciauxIncompatibles == true && typeEquipes == "doublette") {
    if (nbjoueurs % 4 == 0) { //Cas de non complément
      let moitieNbJoueurs = nbjoueurs / 2;
      //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
      if (joueursEnfants.length > moitieNbJoueurs || joueursTireurs.length > moitieNbJoueurs || joueursPointeurs.length > moitieNbJoueurs) {
        return {erreurSpeciaux: true};
      }
      //Test si possible d'appliquer la règle jamaisMemeCoequipier
      let regleValide = testRegleMemeCoequipiersValide(nbTours, nbjoueurs, nbJoueursSpe, joueursTireurs, joueursPointeurs, moitieNbJoueurs);
      if (!regleValide) {
        return {erreurMemesEquipes: true};
      }
    }
    else { //Cas de complément
      if (complement == "1") { //Complément tête-à-tête
        let moitieNbJoueurs = (nbjoueurs / 2) + 1;
        //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
        if (joueursEnfants.length > moitieNbJoueurs || joueursTireurs.length > moitieNbJoueurs || joueursPointeurs.length > moitieNbJoueurs) {
          return {erreurSpeciaux: true};
        }
        //Test si possible d'appliquer la règle jamaisMemeCoequipier
        let regleValide = testRegleMemeCoequipiersValide(nbTours, nbjoueurs, nbJoueursSpe, joueursTireurs, joueursPointeurs, moitieNbJoueurs);
        if (!regleValide) {
          return {erreurMemesEquipes: true};
        }
      }
      if (complement == "3") { //Complément triplette
        let moitieNbJoueurs = (nbjoueurs / 2) - 1;
        //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
        if (joueursEnfants.length > moitieNbJoueurs || joueursTireurs.length > moitieNbJoueurs || joueursPointeurs.length > moitieNbJoueurs) {
          return {erreurSpeciaux: true};
        }
        //Test si possible d'appliquer la règle jamaisMemeCoequipier
        let regleValide = testRegleMemeCoequipiersValide(nbTours, nbjoueurs, nbJoueursSpe, joueursTireurs, joueursPointeurs, moitieNbJoueurs);
        if (!regleValide) {
          return {erreurMemesEquipes: true};
        }
      }
    }
  }
  else if (speciauxIncompatibles == false && typeEquipes == "doublette") {
    //Test si possible d'appliquer la règle jamaisMemeCoequipier
    let regleValide = testRegleMemeCoequipiersValide(nbTours, nbjoueurs, 0, 0, 0, nbjoueurs);
    if (!regleValide) {
      return {erreurMemesEquipes: true};
    }
  }

  //Assignation des joueurs enfants
  if (speciauxIncompatibles == true && typeEquipes == "doublette") {
    //Joueurs enfants seront toujours joueur 2 ou joueur 4
    for (let i = 0; i < nbTours; i++) {
      let idMatch = i * nbMatchsParTour;
      let idsJoueursSpe = [];
      idsJoueursSpe = uniqueValueArrayRandOrder(joueursEnfants.length);
      for (let j = 0; j < joueursEnfants.length; j++) {
        if (matchs[idMatch].equipe[0][1] == -1) {
          matchs[idMatch].equipe[0][1] = joueursEnfants[idsJoueursSpe[j]].id;
        }
        else if (matchs[idMatch].equipe[1][1] == -1) {
          matchs[idMatch].equipe[1][1] = joueursEnfants[idsJoueursSpe[j]].id;
          idMatch++;
        }
      }
    }
  }
  //Sinon si la règle est désactivée alors les joueurs enfants et les non enfants sont regroupés
  else {
    joueursNonSpe.splice(0, joueursNonSpe.length)
    for (let i = 0; i < nbjoueurs; i++) {
      joueursNonSpe.push({...listeJoueurs[i]});
    }
  }

  //Test si possible d'appliquer la règle eviterMemeAdversaire
  //TODO
  //eviterMemeAdversaire = false;


  //On ordonne aléatoirement les ids des joueurs non enfants à chaque début de manche
  //Les listes pointeur ou tireur en 1ère et 2ème position
  function _randomJoueursIds() {
    let arrayIds = [];
    let joueursPointeursId = [];
    let joueursTireursId = [];
    let joueursNonTypeId = [];
    for (let i = 0; i < joueursPointeurs.length; i++) {
      joueursPointeursId.push(joueursPointeurs[i].id);
    }
    for (let i = 0; i < joueursTireurs.length; i++) {
      joueursTireursId.push(joueursTireurs[i].id);
    }
    for (let i = 0; i < joueursNonType.length; i++) {
      joueursNonTypeId.push(joueursNonType[i].id);
    }

    if (joueursPointeurs.length > joueursTireurs.length) {
      arrayIds.push(...shuffle(joueursPointeursId));
      arrayIds.push(...shuffle(joueursTireursId));
    }
    else {
      arrayIds.push(...shuffle(joueursTireursId));
      arrayIds.push(...shuffle(joueursPointeursId));
    }
    arrayIds.push(...shuffle(joueursNonTypeId));
    return arrayIds;
  };

  function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  //FONCTIONNEMENT
  //S'il y a eu des joueurs enfants avant alors ils ont déjà été affectés
  //On complète avec tous les joueurs non enfants
  //Pour conpléter remplissage des matchs tour par tour
  //A chaque tour les joueurs libres sont pris un par un dans une liste
  //Cette liste est semi-aléatoire car les listes mélangées pointeurs et tireurs se suivront au début (selon la liste la + nombreuse des 2) puis les autres
  //Ils sont ensuite ajouté si possible (selon les options) dans le 1er match du tour en tant que joueur 1
  //Si joueur 1 déjà pris alors joueur 2 et si déjà pris alors joueur 3 etc
  //Si impossible d'être ajouté dans le match alors tentative dans le match suivant du même tour
  //Si impossible dans aucun match du tour alors breaker rentre en action et affiche un message

  //Lors de l'affectation des joueurs 3 et 4 la règle aucun même adversaire est appliquée
  //Elle consiste à compter le nombre de fois que le joueur qui va être affecté à déjà jouer dans la même équipe ou contre le joueur 1 et 2
  //Si ce nombre est supérieur à la moitié inférieur du nombre de manche alors on passe au match du tour suivant
  //Exemple 5 manches: si joueur 8 à déjà joué 1 fois contre et 1 fois avec joueur 9 alors pas affecté en joueur 3 ou 4
  //Par contre possible que joueur 8 est déjà joué 2 fois contre joueur 9 et pourra après être avec joueur 9


  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let i = 0; i < nbTours; i++) {
    breaker = 0;
    let random = _randomJoueursIds();
    for (let j = 0; j < joueursNonSpe.length;) {
      //Affectation joueur 1
      if (matchs[idMatch].equipe[0][0] == -1) {
        if (jamaisMemeCoequipier == true && i > 0) {
          if (joueurs[random[j]].equipe.includes(matchs[idMatch].equipe[0][1]) == false) {
            matchs[idMatch].equipe[0][0] = random[j];
            j++
            breaker = 0;
          }
          else {
            breaker++;
          }
        }
        else {
          matchs[idMatch].equipe[0][0] = random[j];
          j++;
          breaker = 0;
        }
      }
      //Affectation joueur 2
      else if (typeEquipes != "teteatete" && matchs[idMatch].equipe[0][1] == -1) {
        //Empeche que le joueur 1 joue plusieurs fois dans la même équipe avec le même joueur
        //Ne s'applique qu'à partir de la manche 2
        if (jamaisMemeCoequipier == true && i > 0) {
          if (joueurs[random[j]].equipe.includes(matchs[idMatch].equipe[0][0]) == false) {
            matchs[idMatch].equipe[0][1] = random[j];
            j++;
            breaker = 0;
          }
          else {
            breaker++;
          }
        }
        else {
          matchs[idMatch].equipe[0][1] = random[j];
          j++;
          breaker = 0;
        }
      }
      //Affectation joueur 3 & 4
      else if (matchs[idMatch].equipe[1][0] == -1 || matchs[idMatch].equipe[1][1] == -1) {
        //Test si le joueur 1 ou 2 n'a pas déjà joué (ensemble et contre) + de la moitié de ses matchs contre le joueur en cours d'affectation
        let affectationPossible = true
        if (eviterMemeAdversaire == true) {
          let joueur1 = matchs[idMatch].equipe[0][0];
          let joueur2 = undefined;
          if (typeEquipes != "teteatete" && matchs[idMatch].equipe[0][1] != -1) {
            joueur2 = matchs[idMatch].equipe[0][1];
          }
          let totPartiesJ1 = 0;
          let totPartiesJ2 = 0;
          //Compte le nombre de fois où joueur 1 ou 2 a été l'adverse de joueur en affectation + ou bien si joueur 3 ou 4 a été l'adverse de joueur en affectation
          const occurrencesAdversaireDansEquipe1 = (arr, joueurAdverse, joueurAffect) => arr.reduce((a, v) => ((v.equipe[0][0] === joueurAdverse || v.equipe[0][1] === joueurAdverse) && (v.equipe[1][0] === joueurAffect || v.equipe[1][1] === joueurAffect) ? a + 1 : a), 0);
          const occurrencesAdversaireDansEquipe2 = (arr, joueurAdverse, joueurAffect) => arr.reduce((a, v) => ((v.equipe[1][0] === joueurAdverse || v.equipe[1][1] === joueurAdverse) && (v.equipe[0][0] === joueurAffect || v.equipe[0][1] === joueurAffect) ? a + 1 : a), 0);
          totPartiesJ1 += occurrencesAdversaireDansEquipe1(matchs, joueur1, random[j]);
          totPartiesJ1 += occurrencesAdversaireDansEquipe2(matchs, joueur1, random[j]);
          if (joueur2) {
            totPartiesJ2 += occurrencesAdversaireDansEquipe1(matchs, joueur2, random[j]);
            totPartiesJ2 += occurrencesAdversaireDansEquipe2(matchs, joueur2, random[j]);
          }
          //+1 si joueur en cours d'affectation a déjà joué dans la même équipe
          totPartiesJ1 += joueurs[joueur1].equipe.includes(random[j]) ? 1 : 0;
          if (joueur2) {
            totPartiesJ2 += joueurs[joueur2].equipe.includes(random[j]) ? 1 : 0;
          }
          let moitieNbManches = nbTours == 1 ? 1 : Math.floor(nbTours / 2); 
          if (totPartiesJ1 > moitieNbManches || totPartiesJ2 > moitieNbManches) {
            affectationPossible = false;
          }
        }
        if (affectationPossible == true) {
          //Affectation joueur 3
          if (matchs[idMatch].equipe[1][0] == -1) {
            if (jamaisMemeCoequipier == true && i > 0) {
              if (joueurs[random[j]].equipe.includes(matchs[idMatch].equipe[1][1]) == false) {
                matchs[idMatch].equipe[1][0] = random[j];
                j++;
                breaker = 0;
              }
              else {
                breaker++;
              }
            }
            else {
              matchs[idMatch].equipe[1][0] = random[j];
              j++;
              breaker = 0;
            }
          }
          //Affectation joueur 4
          else if (typeEquipes != "teteatete" && matchs[idMatch].equipe[1][1] == -1) {
            //Empeche que le joueur 4 joue plusieurs fois dans la même équipe avec le même joueur
            //Ne s'applique qu'à partir de la manche 2
            if (jamaisMemeCoequipier == true && i > 0) {
              if (joueurs[random[j]].equipe.includes(matchs[idMatch].equipe[1][0]) == false) {
                matchs[idMatch].equipe[1][1] = random[j];
                j++;
                breaker = 0;
              }
              else {
                breaker++;
              }
            }
            else {
              matchs[idMatch].equipe[1][1] = random[j];
              j++;
              breaker = 0;
            }
          }
        }
        else {
          breaker++;
        }
      }
      //Affectation joueur(s) complémentaire(s) du tour si tournoi doublette avec complément en triplette
      else if ((idMatch + 1) % nbMatchsParTour == 0) {
        if (typeEquipes == "doublette" && nbjoueurs % 4 != 0 && complement == "3" && matchs[idMatch].equipe[0][2] == -1) {
          let joueursEnTrop = nbjoueurs % 4;
          matchs[idMatch].equipe[0][2] = random[j];
          if (joueursEnTrop == 2) {
            matchs[idMatch].equipe[1][2] = random[j + 1];
          }
          else if (joueursEnTrop == 3) {
            matchs[idMatch].equipe[1][2] = random[j + 1];
            matchs[idMatch - 1].equipe[0][2] = random[j + 2];
          }
          j += joueursEnTrop;
          breaker = 0;
        }
        else {
          breaker++;
        }
      }
      idMatch++;
      //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
      if (idMatch >= nbMatchsParTour * (i + 1)) {
        idMatch = i * nbMatchsParTour;
      }

      //En cas de trop nombreuses tentatives, arret de la génération
      //L'utilisateur est invité à changer les paramètres ou à relancer la génération
      //TODO condition de break à affiner
      //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / nbTours
      if (breaker > nbMatchs) {
        return {echecGeneration: true};
      }
    }

    idMatch = i * nbMatchsParTour;
    if (typeEquipes != "teteatete") {
      for (let j = 0; j < nbMatchsParTour; j++) {
        if (matchs[idMatch + j].equipe[0][0] != -1 && matchs[idMatch + j].equipe[0][1] != -1) {
          joueurs[matchs[idMatch + j].equipe[0][0]].equipe.push(matchs[idMatch + j].equipe[0][1]);
        }
        if (matchs[idMatch + j].equipe[1][0] != -1 && matchs[idMatch + j].equipe[1][1] != -1) {
          joueurs[matchs[idMatch + j].equipe[1][0]].equipe.push(matchs[idMatch + j].equipe[1][1]);
        }
        if (matchs[idMatch + j].equipe[0][1] != -1 && matchs[idMatch + j].equipe[0][0] != -1) {
          joueurs[matchs[idMatch + j].equipe[0][1]].equipe.push(matchs[idMatch + j].equipe[0][0]);
        }
        if (matchs[idMatch + j].equipe[1][1] != -1 && matchs[idMatch + j].equipe[1][0] != -1) {
          joueurs[matchs[idMatch + j].equipe[1][1]].equipe.push(matchs[idMatch + j].equipe[1][0]);
        }
      }
    }
    idMatch = nbMatchsParTour * (i + 1);
  }

  return {matchs, nbMatchs};
}
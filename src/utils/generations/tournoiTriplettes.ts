import { JoueurType } from '@/types/enums/joueurType';
import {
  calcNbMatchsParTour,
  shuffle,
  uniqueValueArrayRandOrder,
} from './generation';
import { Joueur } from '@/types/interfaces/joueur';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Complement } from '@/types/enums/complement';
import { Match } from '@/types/interfaces/match';

export const generationTriplettes = (
  listeJoueurs: Joueur[],
  nbTours: number,
  complement: Complement,
) => {
  let nbjoueurs = listeJoueurs.length;
  let speciauxIncompatibles = true;
  let jamaisMemeCoequipier = true;
  let matchs: Match[] = [];
  let idMatch = 0;
  let joueursSpe = [];
  let joueursNonSpe = [];
  let joueurs = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour = calcNbMatchsParTour(
    nbjoueurs,
    TypeEquipes.TRIPLETTE,
    ModeTournoi.AVECNOMS,
    TypeTournoi.MELEDEMELE,
    complement,
  );
  let nbMatchs = nbTours * nbMatchsParTour;
  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({
        id: idMatch,
        manche: i,
        equipe: [
          [-1, -1, -1, -1],
          [-1, -1, -1, -1],
        ],
        score1: undefined,
        score2: undefined,
        mancheName: undefined,
        terrain: undefined,
      });
      idMatch++;
    }
  }

  //Création d'un tableau contenant tous les joueurs, un autre les non enfants et un autre les enfants
  //Le tableau contenant les tous les joueurs permettra de connaitre dans quel équipe chaque joueur a été
  for (let i = 0; i < nbjoueurs; i++) {
    if (listeJoueurs[i].type === JoueurType.ENFANT) {
      joueursSpe.push({ ...listeJoueurs[i] });
      joueursSpe[joueursSpe.length - 1].equipe = [];
    } else {
      joueursNonSpe.push({ ...listeJoueurs[i] });
      joueursNonSpe[joueursNonSpe.length - 1].equipe = [];
    }
    joueurs.push({ ...listeJoueurs[i] });
    joueurs[i].equipe = [];
  }
  let nbJoueursSpe = joueursSpe.length;

  //Assignation des joueurs enfants
  if (speciauxIncompatibles === true) {
    //Test si joueurs enfants ne sont pas + que 1/3 des joueurs
    if (nbJoueursSpe <= nbjoueurs / 3) {
      //Joueurs enfants seront toujours J1 E1 ou J1 E2
      for (let i = 0; i < nbTours; i++) {
        let idMatch = i * nbMatchsParTour;
        let idsJoueursSpe = [];
        idsJoueursSpe = uniqueValueArrayRandOrder(joueursSpe.length);
        for (let j = 0; j < joueursSpe.length; j++) {
          if (matchs[idMatch].equipe[0][0] === -1) {
            matchs[idMatch].equipe[0][0] = joueursSpe[idsJoueursSpe[j]].id;
          } else if (matchs[idMatch].equipe[1][0] === -1) {
            matchs[idMatch].equipe[1][0] = joueursSpe[idsJoueursSpe[j]].id;
            idMatch++;
          }
        }
      }
    }
    //Si trop nombreux alors message et retour à l'inscription
    else {
      return { erreurSpeciaux: true };
    }
  }
  //Si la règle n'est pas activée alors les joueurs enfants et les non enfants sont regroupés
  else {
    joueursNonSpe.splice(0, joueursNonSpe.length);
    for (let i = 0; i < nbjoueurs; i++) {
      joueursNonSpe.push({ ...listeJoueurs[i] });
    }
  }

  if (complement !== undefined) {
    const complementIds = [];
    let complementCount = 0;

    switch (complement) {
      case Complement.QUATREVSTROIS:
        complementCount = 1;
        break;
      case Complement.TETEATETE:
        complementCount = 4;
        break;
      case Complement.DEUXVSUN:
        complementCount = 3;
        break;
      case Complement.DOUBLETTES:
        complementCount = 2;
        break;
      case Complement.TROISVSDEUX:
        complementCount = 1;
        break;
    }

    for (let i = 0; i < complementCount; i++) {
      const id = nbjoueurs + i;
      joueurs.push({
        name: 'Complement',
        type: JoueurType.ENFANT,
        id: id,
        equipe: [],
      });
      complementIds.push(id);
    }

    for (let i = 1; i < nbTours + 1; i++) {
      const matchIndex = nbMatchsParTour * i - 1;
      switch (complement) {
        case Complement.QUATREVSTROIS:
          matchs[matchIndex].equipe[1][3] = complementIds[0];
          break;
        case Complement.TETEATETE:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[0][1] = complementIds[1];
          matchs[matchIndex].equipe[1][0] = complementIds[2];
          matchs[matchIndex].equipe[1][1] = complementIds[3];
          break;
        case Complement.DEUXVSUN:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[1][0] = complementIds[1];
          matchs[matchIndex].equipe[1][1] = complementIds[2];
          break;
        case Complement.DOUBLETTES:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[1][0] = complementIds[1];
          break;
        case Complement.TROISVSDEUX:
          matchs[matchIndex].equipe[1][0] = complementIds[0];
          break;
      }
    }
  }

  //Test si possible d'appliquer la règle jamaisMemeCoequipier
  //TO DO : réussir à trouver les bons paramètres pour déclencher le message d'erreur sans empecher trop de tournois
  if (jamaisMemeCoequipier === true) {
    let nbCombinaisons = nbjoueurs;
    //Si option de ne pas mettre enfants ensemble alors moins de combinaisons possibles
    if (speciauxIncompatibles === true) {
      if (nbJoueursSpe <= nbjoueurs / 3) {
        nbCombinaisons -= nbJoueursSpe;
      }
    }
    //Si + de matchs que de combinaisons alors on désactive la règle de ne jamais faire jouer avec la même personne
    if (nbCombinaisons < nbTours) {
      //TODO: voir TODO au-dessus
      return { erreurMemesEquipes: true };
    }
  }

  //On ordonne aléatoirement les ids des joueurs non enfants à chaque début de manche
  let joueursNonSpeId = [];
  for (let i = 0; i < joueursNonSpe.length; i++) {
    joueursNonSpeId.push(joueursNonSpe[i].id);
  }

  //FONCTIONNEMENT
  //S'il y a eu des joueurs enfants avant alors ils ont déjà été affectés
  //On complète avec tous les joueurs non enfants
  //Pour conpléter remplissage des matchs tour par tour
  //A chaque tour les joueurs libres sont pris un par un dans une liste les triant aléatoirement à chaque début de tour
  //Ils sont ensuite ajouté si possible (selon les options) dans le 1er match du tour en tant que joueur 1
  //Si joueur 1 déjà pris alors joueur 2 et si déjà pris alors joueur 3 etc
  //Si impossible d'être ajouté dans le match alors tentative dans le match suivant du même tour
  //Si impossible dans aucun match du tour alors breaker rentre en action et affiche un message

  const countOccuEquipe = (arr, val) => arr.filter((x) => x === val).length;

  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let i = 0; i < nbTours; i++) {
    breaker = 0;
    let random = shuffle(joueursNonSpeId);
    for (let j = 0; j < joueursNonSpe.length; ) {
      //Affectation J1 E1
      if (matchs[idMatch].equipe[0][0] === -1) {
        matchs[idMatch].equipe[0][0] = random[j];
        j++;
        breaker = 0;
      }
      //Affectation J2 E1
      else if (matchs[idMatch].equipe[0][1] === -1) {
        //Empeche que le J1 E1 joue plusieurs fois dans la même équipe avec le même joueur
        //Ne s'applique qu'à partir de la manche 2
        if (jamaisMemeCoequipier === true && i > 0) {
          if (
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[0][0],
            ) <
            nbTours / 3
          ) {
            matchs[idMatch].equipe[0][1] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
        } else {
          matchs[idMatch].equipe[0][1] = random[j];
          j++;
          breaker = 0;
        }
      }
      //Affectation J3 E1
      else if (matchs[idMatch].equipe[0][2] === -1) {
        //Empeche que le J1 E1 ou le J2 E1 joue plusieurs fois dans la même équipe avec le même joueur
        //Ne s'applique qu'à partir de la manche 2
        if (jamaisMemeCoequipier === true && i > 0) {
          if (
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[0][0],
            ) <
              nbTours / 3 &&
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[0][1],
            ) <
              nbTours / 3
          ) {
            matchs[idMatch].equipe[0][2] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
        } else {
          matchs[idMatch].equipe[0][2] = random[j];
          j++;
          breaker = 0;
        }
      }
      //Affectation J1 E2
      if (matchs[idMatch].equipe[1][0] === -1) {
        matchs[idMatch].equipe[1][0] = random[j];
        j++;
        breaker = 0;
      }
      //Affectation J2 E2
      else if (matchs[idMatch].equipe[1][1] === -1) {
        //Empeche que le J1 E2 joue plusieurs fois dans la même équipe avec le même joueur
        //Ne s'applique qu'à partir de la manche 2
        if (jamaisMemeCoequipier === true && i > 0) {
          if (
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[1][0],
            ) <
            nbTours / 3
          ) {
            matchs[idMatch].equipe[1][1] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
        } else {
          matchs[idMatch].equipe[1][1] = random[j];
          j++;
          breaker = 0;
        }
      }
      //Affectation J3 E2
      else if (matchs[idMatch].equipe[1][2] === -1) {
        //Empeche que le J1 E2 ou J2 E2 joue plusieurs fois dans la même équipe avec le même joueur
        //Ne s'applique qu'à partir de la manche 2
        if (jamaisMemeCoequipier === true && i > 0) {
          if (
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[1][0],
            ) <
              nbTours / 3 &&
            countOccuEquipe(
              joueurs[random[j]].equipe,
              matchs[idMatch].equipe[1][1],
            ) <
              nbTours / 3
          ) {
            matchs[idMatch].equipe[1][2] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
        } else {
          matchs[idMatch].equipe[1][2] = random[j];
          j++;
          breaker = 0;
        }
      } else {
        breaker++;
      }

      //Affectation du joueur complémentaire au dernier match du tour si complément QUATREVSTROIS
      if (random[j] !== undefined && (idMatch + 1) % nbMatchsParTour === 0) {
        if (
          complement === Complement.QUATREVSTROIS &&
          matchs[idMatch].equipe[0][3] === -1
        ) {
          matchs[idMatch].equipe[0][3] = random[j];
          j++;
          breaker = 0;
        } else {
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
        return { echecGeneration: true };
      }
    }

    idMatch = i * nbMatchsParTour;
    for (let j = 0; j < nbMatchsParTour; j++) {
      joueurs[matchs[idMatch + j].equipe[0][0]].equipe.push(
        matchs[idMatch + j].equipe[0][1],
      );
      joueurs[matchs[idMatch + j].equipe[0][0]].equipe.push(
        matchs[idMatch + j].equipe[0][2],
      );

      joueurs[matchs[idMatch + j].equipe[0][1]].equipe.push(
        matchs[idMatch + j].equipe[0][0],
      );
      joueurs[matchs[idMatch + j].equipe[0][1]].equipe.push(
        matchs[idMatch + j].equipe[0][2],
      );

      joueurs[matchs[idMatch + j].equipe[0][2]].equipe.push(
        matchs[idMatch + j].equipe[0][0],
      );
      joueurs[matchs[idMatch + j].equipe[0][2]].equipe.push(
        matchs[idMatch + j].equipe[0][1],
      );

      joueurs[matchs[idMatch + j].equipe[1][0]].equipe.push(
        matchs[idMatch + j].equipe[1][1],
      );
      joueurs[matchs[idMatch + j].equipe[1][0]].equipe.push(
        matchs[idMatch + j].equipe[1][2],
      );

      joueurs[matchs[idMatch + j].equipe[1][1]].equipe.push(
        matchs[idMatch + j].equipe[1][0],
      );
      joueurs[matchs[idMatch + j].equipe[1][1]].equipe.push(
        matchs[idMatch + j].equipe[1][2],
      );

      joueurs[matchs[idMatch + j].equipe[1][2]].equipe.push(
        matchs[idMatch + j].equipe[1][0],
      );
      joueurs[matchs[idMatch + j].equipe[1][2]].equipe.push(
        matchs[idMatch + j].equipe[1][1],
      );
    }
    idMatch = nbMatchsParTour * (i + 1);
  }

  return { matchs, nbMatchs };
};

import { JoueurType } from '@/types/enums/joueurType';
import {
  calcNbMatchsParTour,
  shuffle,
  uniqueValueArrayRandOrder,
} from './generation';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Complement } from '@/types/enums/complement';
import { Joueur } from '@/types/interfaces/joueur';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Match } from '@/types/interfaces/match';
import { JoueurGeneration } from '@/types/interfaces/joueur-generation.interface';
import {
  testAffectationPossible,
  updatePlayerRelationships,
} from './melee-demelee';

const testRegleJamaisMemeCoequipier = (
  nbTours: number,
  nbjoueurs: number,
  nbJoueursSpe: number,
  nbJoueursTireurs: number,
  nbJoueursPointeurs: number,
) => {
  if (nbjoueurs - 1 < nbTours) {
    return false;
  }

  if (nbjoueurs - nbJoueursSpe < nbTours) {
    return false;
  }

  if (nbjoueurs - nbJoueursTireurs < nbTours) {
    return false;
  }

  if (nbjoueurs - nbJoueursPointeurs < nbTours) {
    return false;
  }

  return true;
};

export const generationDoublettes = (
  listeJoueurs: Joueur[],
  nbTours: number,
  complement: Complement,
  speciauxIncompatibles: boolean,
  jamaisMemeCoequipier: boolean,
  eviterMemeAdversaire: number,
) => {
  const nbjoueurs = listeJoueurs.length;
  let matchs: Match[] = [];
  let idMatch = 0;
  let joueursEnfants: Joueur[] = [];
  let joueursTireurs: Joueur[] = [];
  let joueursPointeurs: Joueur[] = [];
  let joueursNonType: Joueur[] = [];
  let joueursNonSpe: Joueur[] = [];
  let joueurs: JoueurGeneration[] = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour = calcNbMatchsParTour(
    nbjoueurs,
    TypeEquipes.DOUBLETTE,
    ModeTournoi.AVECNOMS,
    TypeTournoi.MELEDEMELE,
    complement,
  );

  const nbMatchs = nbTours * nbMatchsParTour;
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
    const joueur = { ...listeJoueurs[i] };

    if (listeJoueurs[i].type === JoueurType.ENFANT) {
      if (speciauxIncompatibles) {
        joueursEnfants.push(joueur);
      } else {
        joueursNonType.push(joueur);
        joueursNonSpe.push(joueur);
      }
    } else {
      if (listeJoueurs[i].type === JoueurType.TIREUR) {
        joueursTireurs.push(joueur);
      } else if (listeJoueurs[i].type === JoueurType.POINTEUR) {
        joueursPointeurs.push(joueur);
      } else {
        joueursNonType.push(joueur);
      }
      joueursNonSpe.push(joueur);
    }
    joueurs.push({
      id: joueur.id,
      name: joueur.name,
      type: joueur.type,
      isChecked: joueur.isChecked,
      allCoequipiers: [],
      allAdversaires: [],
    });
  }
  let nbJoueursSpe = joueursEnfants.length;
  //Test s'il faut compléter des équipes
  //Si c'est le cas, alors on remplie de joueurs invisible pour le complément en mode tête à tête
  if (nbjoueurs % 4 !== 0) {
    if (complement === Complement.TETEATETE && nbjoueurs % 2 === 0) {
      joueurs.push({
        name: 'Complément 1',
        type: JoueurType.ENFANT,
        id: nbjoueurs,
        isChecked: false,
        allCoequipiers: [],
        allAdversaires: [],
      });
      joueurs.push({
        name: 'Complément 2',
        type: JoueurType.ENFANT,
        id: nbjoueurs + 1,
        isChecked: false,
        allCoequipiers: [],
        allAdversaires: [],
      });

      for (let i = 1; i < nbTours + 1; i++) {
        matchs[nbMatchsParTour * i - 1].equipe[0][0] = nbjoueurs;
        matchs[nbMatchsParTour * i - 1].equipe[1][0] = nbjoueurs + 1;
      }
    } else if (complement === Complement.DEUXVSUN) {
      joueurs.push({
        name: 'Complément 1',
        type: JoueurType.ENFANT,
        id: nbjoueurs,
        isChecked: false,
        allCoequipiers: [],
        allAdversaires: [],
      });

      for (let i = 1; i < nbTours + 1; i++) {
        matchs[nbMatchsParTour * i - 1].equipe[1][0] = nbjoueurs;
      }
    }
  }

  //Test des règles speciauxIncompatibles
  if (speciauxIncompatibles) {
    if (nbjoueurs % 4 === 0) {
      //Cas de non complément
      const moitieNbJoueurs = nbjoueurs / 2;
      //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
      if (
        joueursEnfants.length > moitieNbJoueurs ||
        joueursTireurs.length > moitieNbJoueurs ||
        joueursPointeurs.length > moitieNbJoueurs
      ) {
        return { erreurSpeciaux: true };
      }
    } else {
      //Cas de complément
      let moitieNbJoueurs: number;
      switch (complement) {
        case Complement.TETEATETE:
        case Complement.DEUXVSUN:
          // Complément tête-à-tête et DEUXVSUN
          moitieNbJoueurs = Math.ceil(nbjoueurs / 2);
          break;
        case Complement.TRIPLETTE:
        case Complement.TROISVSDEUX:
          // Complément triplette et TROISVSDEUX
          moitieNbJoueurs = Math.floor(nbjoueurs / 2);
          break;
        default:
          moitieNbJoueurs = nbjoueurs / 2;
      }

      //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
      if (
        joueursEnfants.length > moitieNbJoueurs ||
        joueursTireurs.length > moitieNbJoueurs ||
        joueursPointeurs.length > moitieNbJoueurs
      ) {
        return { erreurSpeciaux: true };
      }
    }
  }

  //Test si possible d'appliquer la règle jamaisMemeCoequipier
  if (jamaisMemeCoequipier) {
    let regleValide = false;
    if (speciauxIncompatibles) {
      regleValide = testRegleJamaisMemeCoequipier(
        nbTours,
        nbjoueurs,
        nbJoueursSpe,
        joueursTireurs.length,
        joueursPointeurs.length,
      );
    } else {
      regleValide = testRegleJamaisMemeCoequipier(nbTours, nbjoueurs, 0, 0, 0);
    }

    if (!regleValide) {
      return { erreurMemesEquipes: true };
    }
  }

  //Test si possible d'appliquer la règle eviterMemeAdversaire
  //TODO

  //Assignation des joueurs enfants
  if (speciauxIncompatibles) {
    //Joueurs enfants seront toujours joueur 2 ou joueur 4
    for (let i = 0; i < nbTours; i++) {
      let idMatch = i * nbMatchsParTour;
      let idsJoueursSpe = [];
      idsJoueursSpe = uniqueValueArrayRandOrder(joueursEnfants.length);
      for (let j = 0; j < joueursEnfants.length; j++) {
        if (matchs[idMatch].equipe[0][1] === -1) {
          matchs[idMatch].equipe[0][1] = joueursEnfants[idsJoueursSpe[j]].id;
        } else if (matchs[idMatch].equipe[1][1] === -1) {
          matchs[idMatch].equipe[1][1] = joueursEnfants[idsJoueursSpe[j]].id;
          idMatch++;
        }
      }
    }
  }
  //Sinon si la règle est désactivée alors les joueurs enfants et les non enfants sont regroupés
  else {
    joueursNonSpe.splice(0, joueursNonSpe.length);
    joueursNonType.splice(0, joueursNonType.length);
    for (let i = 0; i < nbjoueurs; i++) {
      joueursNonSpe.push({ ...listeJoueurs[i] });
      joueursNonType.push({ ...listeJoueurs[i] });
    }
  }

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

  const equipeIndices = [
    { equipe: 0, place: 0 },
    { equipe: 0, place: 1 },
    { equipe: 1, place: 0 },
    { equipe: 1, place: 1 },
  ];

  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let tour = 0; tour < nbTours; tour++) {
    breaker = 0;
    //On ordonne aléatoirement les ids des joueurs non enfants à chaque début de manche
    //Les listes pointeur ou tireur en 1ère et 2ème position
    let random = _randomJoueursIds(
      joueursPointeurs,
      joueursTireurs,
      joueursNonType,
      speciauxIncompatibles,
    );
    for (let j = 0; j < joueursNonSpe.length; ) {
      let joueurId = random[j];
      let match = matchs[idMatch];

      let assigned = false;

      for (const { equipe, place } of equipeIndices) {
        if (match.equipe[equipe][place] === -1) {
          const affectationPossible = testAffectationPossible(
            tour,
            joueurs[joueurId],
            jamaisMemeCoequipier,
            speciauxIncompatibles,
            eviterMemeAdversaire,
            nbTours,
            match.equipe[equipe],
            match.equipe[(equipe + 1) % 2],
            joueurs,
          );
          if (affectationPossible) {
            match.equipe[equipe][place] = joueurId;
            breaker = 0;
            j++;
            assigned = true;
            break;
          } else {
            breaker++;
          }
        }
      }
      joueurId = random[j];
      if (!assigned) {
        breaker++;
      }

      // Affectation du joueur complémentaire au dernier match du tour si complément TRIPLETTE ou TROISVSDEUX
      const isLastMatchTour = (idMatch + 1) % nbMatchsParTour === 0;
      if (isLastMatchTour && joueurId !== undefined) {
        if (
          nbjoueurs % 4 !== 0 &&
          (complement === Complement.TRIPLETTE ||
            complement === Complement.TROISVSDEUX ||
            complement === Complement.TROIS_VS_TROIS_ET_TROIS_VS_DEUX) &&
          match.equipe[0][2] === -1
        ) {
          const joueursEnTrop = nbjoueurs % 4;
          if (joueursEnTrop === 1) {
            // Cas TROISVSDEUX
            match.equipe[0][2] = joueurId;
          } else if (joueursEnTrop === 2) {
            // Cas TRIPLETTE
            match.equipe[0][2] = joueurId;
            match.equipe[1][2] = random[j + 1];
          } else if (joueursEnTrop === 3) {
            // Cas TROIS_VS_TROIS_ET_TROIS_VS_DEUX
            match.equipe[0][2] = joueurId;
            matchs[idMatch - 1].equipe[0][2] = random[j + 1];
            matchs[idMatch - 1].equipe[1][2] = random[j + 2];
          }
          j += joueursEnTrop;
          breaker = 0;
        } else {
          breaker++;
        }
      }

      idMatch++;
      //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
      if (idMatch >= nbMatchsParTour * (tour + 1)) {
        idMatch = tour * nbMatchsParTour;
      }

      //En cas de trop nombreuses tentatives, arret de la génération
      //L'utilisateur est invité à changer les paramètres ou à relancer la génération
      //TODO condition de break à affiner
      //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / nbTours
      if (breaker > nbMatchs) {
        return { echecGeneration: true };
      }
    }

    const startMatchId = tour * nbMatchsParTour;
    const endMatchId = startMatchId + nbMatchsParTour;

    for (let matchId = startMatchId; matchId < endMatchId; matchId++) {
      const match = matchs[matchId];
      const [equipe1, equipe2] = match.equipe;
      updatePlayerRelationships(joueurs, equipe1, equipe2);
      updatePlayerRelationships(joueurs, equipe2, equipe1);
    }

    idMatch = nbMatchsParTour * (tour + 1);
  }

  return { matchs, nbMatchs };
};

function _randomJoueursIds(
  joueursPointeurs: Joueur[],
  joueursTireurs: Joueur[],
  joueursNonType: Joueur[],
  speciauxIncompatibles: boolean,
): number[] {
  let arrayIds: number[] = [];
  let joueursPointeursId: number[] = [];
  let joueursTireursId: number[] = [];
  let joueursNonTypeId: number[] = [];
  for (let i = 0; i < joueursPointeurs.length; i++) {
    joueursPointeursId.push(joueursPointeurs[i].id);
  }
  for (let i = 0; i < joueursTireurs.length; i++) {
    joueursTireursId.push(joueursTireurs[i].id);
  }
  for (let i = 0; i < joueursNonType.length; i++) {
    joueursNonTypeId.push(joueursNonType[i].id);
  }

  if (speciauxIncompatibles === true) {
    if (joueursPointeurs.length > joueursTireurs.length) {
      arrayIds.push(...shuffle(joueursPointeursId));
      joueursNonTypeId.push(...joueursTireursId);
    } else {
      arrayIds.push(...shuffle(joueursTireursId));
      joueursNonTypeId.push(...joueursPointeursId);
    }
  }
  arrayIds.push(...shuffle(joueursNonTypeId));

  return arrayIds;
}

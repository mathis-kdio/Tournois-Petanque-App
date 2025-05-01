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

const testRegleMemeCoequipiersValide = (
  nbTours: number,
  nbjoueurs: number,
  nbJoueursSpe: number,
  nbJoueursTireurs: number,
  nbJoueursPointeurs: number,
  moitieNbJoueurs: number,
) => {
  let nbCombinaisons = nbjoueurs;
  nbCombinaisons -= nbJoueursSpe;
  if (nbCombinaisons - nbJoueursTireurs > moitieNbJoueurs) {
    nbCombinaisons -= nbJoueursTireurs;
    if (nbCombinaisons - nbJoueursPointeurs > moitieNbJoueurs) {
      nbCombinaisons -= nbJoueursPointeurs;
    } else {
      nbCombinaisons = moitieNbJoueurs;
    }
  } else {
    nbCombinaisons = moitieNbJoueurs;
  }
  if (nbCombinaisons < nbTours) {
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
  let nbjoueurs = listeJoueurs.length;
  let matchs: Match[] = [];
  let idMatch = 0;
  let joueursEnfants = [];
  let joueursTireurs = [];
  let joueursPointeurs = [];
  let joueursNonType = [];
  let joueursNonSpe = [];
  let joueurs: JoueurGeneration[] = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour = calcNbMatchsParTour(
    nbjoueurs,
    TypeEquipes.DOUBLETTE,
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
    const joueur = { ...listeJoueurs[i], equipe: [] };

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

  //Test des règles speciauxIncompatibles et jamaisMemeCoequipier
  if (speciauxIncompatibles === true) {
    if (nbjoueurs % 4 === 0) {
      //Cas de non complément
      let moitieNbJoueurs = nbjoueurs / 2;
      //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
      if (
        joueursEnfants.length > moitieNbJoueurs ||
        joueursTireurs.length > moitieNbJoueurs ||
        joueursPointeurs.length > moitieNbJoueurs
      ) {
        return { erreurSpeciaux: true };
      }
      //Test si possible d'appliquer la règle jamaisMemeCoequipier
      let regleValide = testRegleMemeCoequipiersValide(
        nbTours,
        nbjoueurs,
        nbJoueursSpe,
        joueursTireurs.length,
        joueursPointeurs.length,
        moitieNbJoueurs,
      );
      if (!regleValide) {
        return { erreurMemesEquipes: true };
      }
    } else {
      //Cas de complément
      let moitieNbJoueurs: number;
      if (
        complement === Complement.TETEATETE ||
        complement === Complement.DEUXVSUN
      ) {
        //Complément tête-à-tête et DEUXVSUN
        moitieNbJoueurs = nbjoueurs / 2 + 1;
      }
      if (
        complement === Complement.TRIPLETTE ||
        complement === Complement.TROISVSDEUX
      ) {
        //Complément triplette et TROISVSDEUX
        moitieNbJoueurs = nbjoueurs / 2 - 1;
      }

      //Test si trop de joueurs de type pointeurs ou tireurs ou enfants
      if (
        joueursEnfants.length > moitieNbJoueurs ||
        joueursTireurs.length > moitieNbJoueurs ||
        joueursPointeurs.length > moitieNbJoueurs
      ) {
        return { erreurSpeciaux: true };
      }
      //Test si possible d'appliquer la règle jamaisMemeCoequipier
      if (jamaisMemeCoequipier === true) {
        let regleValide = testRegleMemeCoequipiersValide(
          nbTours,
          nbjoueurs,
          nbJoueursSpe,
          joueursTireurs.length,
          joueursPointeurs.length,
          moitieNbJoueurs,
        );
        if (!regleValide) {
          return { erreurMemesEquipes: true };
        }
      }
    }
  } else if (speciauxIncompatibles === false) {
    //Test si possible d'appliquer la règle jamaisMemeCoequipier
    if (jamaisMemeCoequipier === true) {
      let regleValide = testRegleMemeCoequipiersValide(
        nbTours,
        nbjoueurs,
        0,
        0,
        0,
        nbjoueurs,
      );
      if (!regleValide) {
        return { erreurMemesEquipes: true };
      }
    }
  }

  //Assignation des joueurs enfants
  if (speciauxIncompatibles === true) {
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

  //Test si possible d'appliquer la règle eviterMemeAdversaire
  //TODO
  //eviterMemeAdversaire = false;

  //On ordonne aléatoirement les ids des joueurs non enfants à chaque début de manche
  //Les listes pointeur ou tireur en 1ère et 2ème position
  function _randomJoueursIds(joueursPointeurs, joueursTireurs, joueursNonType) {
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
    let random = _randomJoueursIds(
      joueursPointeurs,
      joueursTireurs,
      joueursNonType,
    );
    for (let j = 0; j < joueursNonSpe.length; ) {
      let joueurId = random[j];

      let assigned = false;

      for (const { equipe, place } of equipeIndices) {
        if (matchs[idMatch].equipe[equipe][place] === -1) {
          const affectationPossible = affectationEquipe(
            tour,
            joueurs[random[j]],
            jamaisMemeCoequipier,
            speciauxIncompatibles,
            eviterMemeAdversaire,
            nbTours,
            matchs[idMatch].equipe[0],
            matchs[idMatch].equipe[1],
            joueurs,
          );
          if (affectationPossible) {
            matchs[idMatch].equipe[equipe][place] = joueurId;
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

      //Affectation joueur(s) complémentaire(s) du tour si tournoi avec complément en triplette
      if (random[j] !== undefined && (idMatch + 1) % nbMatchsParTour === 0) {
        if (
          nbjoueurs % 4 !== 0 &&
          (complement === Complement.TRIPLETTE ||
            complement === Complement.TROISVSDEUX) &&
          matchs[idMatch].equipe[0][2] === -1
        ) {
          let joueursEnTrop = nbjoueurs % 4;
          if (joueursEnTrop === 1) {
            matchs[idMatch].equipe[0][2] = random[j];
          } else if (joueursEnTrop === 2) {
            matchs[idMatch].equipe[0][2] = random[j];
            matchs[idMatch].equipe[1][2] = random[j + 1];
          } else if (joueursEnTrop === 3) {
            matchs[idMatch].equipe[1][2] = random[j + 1];
            matchs[idMatch - 1].equipe[0][2] = random[j + 2];
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

    idMatch = tour * nbMatchsParTour;
    for (let j = 0; j < nbMatchsParTour; j++) {
      const match = matchs[idMatch + j];
      if (match.equipe[0][0] !== -1 && match.equipe[0][1] !== -1) {
        joueurs[match.equipe[0][0]].allCoequipiers.push(match.equipe[0][1]);
      }
      if (match.equipe[1][0] !== -1 && match.equipe[1][1] !== -1) {
        joueurs[match.equipe[1][0]].allCoequipiers.push(match.equipe[1][1]);
      }
      if (match.equipe[0][1] !== -1 && match.equipe[0][0] !== -1) {
        joueurs[match.equipe[0][1]].allCoequipiers.push(match.equipe[0][0]);
      }
      if (match.equipe[1][1] !== -1 && match.equipe[1][0] !== -1) {
        joueurs[match.equipe[1][1]].allCoequipiers.push(match.equipe[1][0]);
      }
    }
    idMatch = nbMatchsParTour * (tour + 1);
  }

  return { matchs, nbMatchs };
};

function affectationJoueur1(
  joueurId: number,
  match: Match,
  speciauxIncompatibles: boolean,
  jamaisMemeCoequipier: boolean,
  joueurs: JoueurGeneration[],
  tour: number,
): boolean {
  if (joueurId === undefined || match.equipe[0][0] !== -1) {
    return false;
  }

  if (
    speciauxIncompatibles &&
    joueurs[joueurId].type &&
    joueurs[joueurId].type === joueurs[match.equipe[0][1]].type
  ) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].allCoequipiers.includes(match.equipe[0][1]) === true) {
    return false;
  }

  return true;
}

function affectationJoueur2(
  joueurId: number,
  match: Match,
  speciauxIncompatibles: boolean,
  jamaisMemeCoequipier: boolean,
  joueurs: JoueurGeneration[],
  tour: number,
): boolean {
  if (joueurId === undefined || match.equipe[0][1] !== -1) {
    return false;
  }

  if (
    speciauxIncompatibles &&
    joueurs[joueurId].type &&
    joueurs[joueurId].type === joueurs[match.equipe[0][0]].type
  ) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].allCoequipiers.includes(match.equipe[0][0]) === true) {
    return false;
  }

  return true;
}

function affectationJoueur3(
  joueurId: number,
  match: Match,
  speciauxIncompatibles: boolean,
  jamaisMemeCoequipier: boolean,
  joueurs: JoueurGeneration[],
  tour: number,
): boolean {
  if (joueurId === undefined || match.equipe[1][0] !== -1) {
    return false;
  }

  if (
    speciauxIncompatibles &&
    joueurs[joueurId].type &&
    joueurs[joueurId].type === joueurs[match.equipe[1][1]].type
  ) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].allCoequipiers.includes(match.equipe[1][1]) === true) {
    return false;
  }

  return true;
}

function occuAdversaire(arr: number[], val: number) {
  return arr.filter((x) => x === val).length;
}

function affectationEquipe(
  tour: number,
  joueur: JoueurGeneration,
  jamaisMemeCoequipier: boolean,
  speciauxIncompatibles: boolean,
  eviterMemeAdversaire: number,
  nbTours: number,
  currentEquipe: [number, number, number, number],
  currentAdversaire: [number, number, number, number],
  listeJoueurs: JoueurGeneration[],
): boolean {
  const coequipiersActuels = currentEquipe.filter((id) => id !== -1);

  //Test speciauxIncompatibles
  if (
    speciauxIncompatibles &&
    joueur.type &&
    coequipiersActuels.some(
      (id) => listeJoueurs[id]?.type && listeJoueurs[id]?.type === joueur.type,
    )
  ) {
    return false;
  }

  //Test eviterMemeAdversaire
  if (eviterMemeAdversaire !== 100) {
    const adversairesActuels = currentAdversaire.filter((id) => id !== -1);
    for (const adversaire of adversairesActuels) {
      const nbRencontres = occuAdversaire(joueur.allAdversaires, adversaire);
      const maxRencontres =
        eviterMemeAdversaire === 50 ? Math.floor(nbTours / 2) : 1;
      if (nbRencontres >= maxRencontres) {
        return false;
      }
    }
  }

  //Test jamaisMemeCoequipier
  if (!jamaisMemeCoequipier || tour === 0) {
    return true;
  }

  if (
    coequipiersActuels.some((coequipierActuel) =>
      joueur.allCoequipiers.includes(coequipierActuel),
    )
  ) {
    return false;
  }

  return true;
}

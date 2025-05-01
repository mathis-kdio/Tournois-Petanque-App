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
      //Affectation joueur 1
      let affectationPossibleJ1 = affectationJoueur1(matchs[idMatch], jamaisMemeCoequipier, tour, joueurs, random[j]);
      if (affectationPossibleJ1) {
        matchs[idMatch].equipe[0][0] = random[j];
        j++;
        breaker = 0;
      } else {
        breaker++;
      }

      //Affectation joueur 2
      let affectationPossibleJ2 = affectationJoueur2(random[j], matchs[idMatch], speciauxIncompatibles, joueurs, jamaisMemeCoequipier, tour);
      if (affectationPossibleJ2) {
        matchs[idMatch].equipe[0][1] = random[j];
        j++;
        breaker = 0;
      } else {
        breaker++;
      }

      //Affectation joueur 3 & 4
      if (random[j] !== undefined) {
        //Test si le joueur 1 ou 2 n'a pas déjà joué (ensemble et contre) + de la moitié de ses matchs contre le joueur en cours d'affectation
        let affectationPossible = true;
        if (eviterMemeAdversaire !== 100) {
          if (matchs[idMatch].equipe[0][0] !== -1) {
            let joueur1 = matchs[idMatch].equipe[0][0];
            let joueur2 = undefined;
            if (matchs[idMatch].equipe[0][1] !== -1) {
              joueur2 = matchs[idMatch].equipe[0][1];
            }
            let totPartiesJ1 = 0;
            let totPartiesJ2 = 0;
            //Compte le nombre de fois où dans des matchs :
            //Si le joueur en affectation était joueur 3 ou 4 et qu'il a déjà eu le joueur 1 ou 2 comme adversaire
            //OU
            //Si le joueur en affectation était joueur 1 ou 2 et qu'il a déjà eu le joueur 3 ou 4 comme adversaire
            const occurrencesAdversaireDansEquipe1 = (
              arr,
              joueurAdverse,
              joueurAffect,
            ) =>
              arr.reduce(
                (a, v) =>
                  (v.equipe[0][0] === joueurAdverse ||
                    v.equipe[0][1] === joueurAdverse) &&
                  (v.equipe[1][0] === joueurAffect ||
                    v.equipe[1][1] === joueurAffect)
                    ? a + 1
                    : a,
                0,
              );
            const occurrencesAdversaireDansEquipe2 = (
              arr,
              joueurAdverse,
              joueurAffect,
            ) =>
              arr.reduce(
                (a, v) =>
                  (v.equipe[1][0] === joueurAdverse ||
                    v.equipe[1][1] === joueurAdverse) &&
                  (v.equipe[0][0] === joueurAffect ||
                    v.equipe[0][1] === joueurAffect)
                    ? a + 1
                    : a,
                0,
              );
            totPartiesJ1 += occurrencesAdversaireDansEquipe1(
              matchs,
              joueur1,
              random[j],
            );
            totPartiesJ1 += occurrencesAdversaireDansEquipe2(
              matchs,
              joueur1,
              random[j],
            );
            if (joueur2) {
              totPartiesJ2 += occurrencesAdversaireDansEquipe1(
                matchs,
                joueur2,
                random[j],
              );
              totPartiesJ2 += occurrencesAdversaireDansEquipe2(
                matchs,
                joueur2,
                random[j],
              );
            }
            //+1 si joueur en cours d'affectation a déjà joué dans la même équipe
            totPartiesJ1 += joueurs[joueur1].allCoequipiers.includes(random[j]) ? 1 : 0;
            if (joueur2) {
              totPartiesJ2 += joueurs[joueur2].allCoequipiers.includes(random[j])
                ? 1
                : 0;
            }

            //Règle eviterMemeAdversaire choix dans slider options (0: seul match possible, 50: la moitié des matchs, 100: tous les matchs = règle désactivée)
            let maxNbMatchs = 1;
            if (eviterMemeAdversaire === 50) {
              maxNbMatchs = nbTours === 1 ? 1 : Math.floor(nbTours / 2);
            }
            if (totPartiesJ1 >= maxNbMatchs || totPartiesJ2 >= maxNbMatchs) {
              affectationPossible = false;
            }
          } else {
            affectationPossible = false;
          }
        }
        if (affectationPossible === true) {
          //Affectation joueur 3
          let affectationPossibleJ3 = affectationJoueur3(random[j], matchs[idMatch], jamaisMemeCoequipier, tour, joueurs);
          if (affectationPossibleJ3) {
            matchs[idMatch].equipe[1][0] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
          //Affectation joueur 4
          let affectationPossibleJ4 = affectationJoueur4(random[j], matchs[idMatch], speciauxIncompatibles, joueurs, jamaisMemeCoequipier, tour);
          if (affectationPossibleJ4) {
            matchs[idMatch].equipe[1][1] = random[j];
            j++;
            breaker = 0;
          } else {
            breaker++;
          }
        } else {
          breaker++;
        }
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
  match: Match,
  jamaisMemeCoequipier: boolean,
  tour: number,
  joueurs: any[],
  joueurId: number,
): boolean {
  if (joueurId === undefined || match.equipe[0][0] !== -1) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].equipe.includes(match.equipe[0][1]) === true) {
    return false;
  }

  return true;
}

function affectationJoueur2(
  joueurId: number,
  match: Match,
  speciauxIncompatibles: boolean,
  joueurs: any[],
  jamaisMemeCoequipier: boolean,
  tour: number,
): boolean {
  if (joueurId === undefined || match.equipe[0][1] !== -1) {
    return false;
  }

  // TODO
  if (
    speciauxIncompatibles === false ||
    joueurs[joueurId].type === undefined ||
    (speciauxIncompatibles === true &&
      joueurs[joueurId].type !== joueurs[match.equipe[0][0]].type)
  ) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].equipe.includes(match.equipe[0][0]) === true) {
    return false;
  }

  return true;
}

function affectationJoueur3(
  joueurId: number,
  match: Match,
  jamaisMemeCoequipier: boolean,
  tour: number,
  joueurs: JoueurGeneration[],
): boolean {
  if (joueurId === undefined || match.equipe[1][0] !== -1) {
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

function affectationJoueur4(
  joueurId: number,
  match: Match,
  speciauxIncompatibles: boolean,
  joueurs: JoueurGeneration[],
  jamaisMemeCoequipier: boolean,
  tour: number,
): boolean {
  if (joueurId === undefined || match.equipe[1][1] !== -1) {
    return false;
  }

  // TODO
  if (
    speciauxIncompatibles === false ||
    joueurs[joueurId].type === undefined ||
    (speciauxIncompatibles === true &&
      joueurs[joueurId].type !== joueurs[match.equipe[1][0]].type)
  ) {
    return false;
  }

  if (jamaisMemeCoequipier === false || tour === 0) {
    return true;
  }

  if (joueurs[joueurId].allCoequipiers.includes(match.equipe[1][0]) === true) {
    return false;
  }

  return true;
}

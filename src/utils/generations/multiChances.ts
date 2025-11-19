import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { shuffle } from './generation';

export const generationMultiChances = (
  listeJoueurs: JoueurModel[],
  typeEquipes: TypeEquipes,
) => {
  let nbjoueurs = listeJoueurs.length;
  let matchs = [];
  let idMatch = 0;
  let equipe = [];

  //Initialisation des matchs dans un tableau
  let nbEquipes: number;
  let nbMatchsParTour: number;
  let nbTours: number;
  let nbMatchs: number;
  if (typeEquipes === TypeEquipes.TETEATETE) {
    nbEquipes = nbjoueurs;
  } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = nbjoueurs / 2;
  } else {
    nbEquipes = nbjoueurs / 3;
  }
  nbMatchsParTour = nbEquipes / 2;
  nbTours = Math.log2(nbEquipes);
  nbMatchs = nbMatchsParTour * nbTours;

  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({
        id: idMatch,
        manche: i,
        equipe: [
          [-1, -1, -1],
          [-1, -1, -1],
        ],
        score1: undefined,
        score2: undefined,
      });
      idMatch++;
    }
  }

  //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
  for (let i = 1; i <= nbEquipes; i++) {
    equipe.push([]);
    for (let j = 0; j < nbjoueurs; j++) {
      if (listeJoueurs[j].equipe === i) {
        equipe[i - 1].push(listeJoueurs[j].id);
      }
    }
  }

  //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
  let equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }

  //FONCTIONNEMENT
  idMatch = 0;
  let randomEquipesIds = shuffle(equipesIds);
  for (let j = 0; j < equipe.length; ) {
    //Affectation equipe 1
    if (matchs[idMatch].equipe[0][0] === -1) {
      matchs[idMatch].equipe[0][0] = equipe[randomEquipesIds[j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        matchs[idMatch].equipe[0][1] = equipe[randomEquipesIds[j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        matchs[idMatch].equipe[0][2] = equipe[randomEquipesIds[j]][2];
      }
      j++;
    }
    //Affectation Equipe 2
    if (matchs[idMatch].equipe[1][0] === -1) {
      matchs[idMatch].equipe[1][0] = equipe[randomEquipesIds[j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        matchs[idMatch].equipe[1][1] = equipe[randomEquipesIds[j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        matchs[idMatch].equipe[1][2] = equipe[randomEquipesIds[j]][2];
      }
      j++;
    }
    idMatch++;
  }

  return { matchs, nbTours, nbMatchs };
};

import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchGeneration } from '@/types/interfaces/match-generation';
import { shuffle } from './generation';

export const generationMultiChances = (
  listeJoueurs: JoueurModel[],
  typeEquipes: TypeEquipes,
) => {
  const nbjoueurs = listeJoueurs.length;

  //Calcul nombre d'équipes, de tours, du nombre de match et nombre de matchs par tour
  let nbEquipes: number;
  if (typeEquipes === TypeEquipes.TETEATETE) {
    nbEquipes = nbjoueurs;
  } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = nbjoueurs / 2;
  } else {
    nbEquipes = nbjoueurs / 3;
  }
  const nbMatchsParTour = nbEquipes / 2;
  const nbTours = Math.log2(nbEquipes);
  const nbMatchs = nbMatchsParTour * nbTours;

  //Initialisation des matchs dans un tableau
  const matchs: MatchGeneration[] = [];
  let idMatch = 0;
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

  //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
  const equipe: number[][] = [];
  for (let i = 1; i <= nbEquipes; i++) {
    equipe.push([]);
    for (let j = 0; j < nbjoueurs; j++) {
      const joueur = listeJoueurs[j];
      if (joueur.equipe === i) {
        equipe[i - 1].push(joueur.joueurTournoiId);
      }
    }
  }

  //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
  const equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }

  //FONCTIONNEMENT
  idMatch = 0;
  const randomEquipesIds = shuffle(equipesIds);
  for (let j = 0; j < equipe.length; j) {
    const match = matchs[idMatch];
    //Affectation equipe 1
    const equipe1 = match.equipe[0];
    if (equipe1[0] === -1) {
      equipe1[0] = equipe[randomEquipesIds[j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        equipe1[1] = equipe[randomEquipesIds[j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        equipe1[2] = equipe[randomEquipesIds[j]][2];
      }
      j++;
    }

    //Affectation Equipe 2
    const equipe2 = match.equipe[1];
    if (equipe2[0] === -1) {
      equipe2[0] = equipe[randomEquipesIds[j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        equipe2[1] = equipe[randomEquipesIds[j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        equipe2[2] = equipe[randomEquipesIds[j]][2];
      }
      j++;
    }
    idMatch++;
  }

  return { matchs, nbTours, nbMatchs };
};

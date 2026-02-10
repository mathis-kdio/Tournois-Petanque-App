import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchGeneration } from '@/types/interfaces/match-generation';

export const generationChampionnat = (
  typeEquipes: TypeEquipes,
  listeJoueurs: JoueurModel[],
) => {
  const nbjoueurs = listeJoueurs.length;

  //Calcul nombre d'équipes, de tours, du nombre de match et nombre de matchs par tour
  let nbEquipes: number;
  let nbMatchsParTour: number;
  if (typeEquipes === TypeEquipes.TETEATETE) {
    nbEquipes = nbjoueurs;
    nbMatchsParTour = nbjoueurs / 2;
  } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = nbjoueurs / 2;
    nbMatchsParTour = Math.ceil(nbjoueurs / 4);
  } else {
    nbEquipes = nbjoueurs / 3;
    nbMatchsParTour = Math.ceil(nbjoueurs / 6);
  }
  const nbTours = nbEquipes - 1;
  const nbMatchs = nbTours * nbMatchsParTour;

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

  //On place les ids des équipes dans un tableau qui sera décalé à chaque nouveaux tour
  const equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }

  //FONCTIONNEMENT
  idMatch = 0;
  for (let i = 0; i < nbTours; i++) {
    for (let j = 0; j < equipe.length / 2; j++) {
      const match = matchs[idMatch];
      //Affectation Equipe 1
      const equipe1 = match.equipe[0];
      equipe1[0] = equipe[equipesIds[j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        equipe1[1] = equipe[equipesIds[j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        equipe1[2] = equipe[equipesIds[j]][2];
      }

      //Affectation Equipe 2
      const equipe2 = match.equipe[1];
      equipe2[0] = equipe[equipesIds[nbEquipes - 1 - j]][0];
      if (
        typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE
      ) {
        equipe2[1] = equipe[equipesIds[nbEquipes - 1 - j]][1];
      }
      if (typeEquipes === TypeEquipes.TRIPLETTE) {
        equipe2[2] = equipe[equipesIds[nbEquipes - 1 - j]][2];
      }
      idMatch++;
    }
    const last = equipesIds.pop();
    if (last === undefined) {
      throw Error();
    }
    equipesIds.splice(1, 0, last);
    idMatch = nbMatchsParTour * (i + 1);
  }
  return { matchs, nbTours, nbMatchs };
};

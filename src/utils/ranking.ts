import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MatchModel } from '@/types/interfaces/match';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Victoire } from '@/types/interfaces/victoire';

export const ranking = (
  listeMatchs: MatchModel[],
  optionsTournoi: OptionsTournoi,
): Victoire[] => {
  if (listeMatchs === undefined) {
    throw Error('ranking listeMatchs undefined');
  }
  let victoires = victoiresPointsCalc(listeMatchs, optionsTournoi);

  if (optionsTournoi.typeTournoi === TypeTournoi.MULTICHANCES) {
    //Classement pour les tournois de type Multi-Chances
    return rankingMuliChances(listeMatchs, optionsTournoi, victoires);
  } else {
    //Classement pour les autres tournois
    return rankingClassic(victoires);
  }
};

const rankingClassic = (victoires: Victoire[]) => {
  victoires.sort((a, b) =>
    a.victoires === b.victoires
      ? b.points - a.points
      : b.victoires - a.victoires,
  );

  let position = 1;
  for (let i = 0; i < victoires.length; i++) {
    if (
      i > 0 &&
      victoires[i - 1].victoires === victoires[i].victoires &&
      victoires[i - 1].points === victoires[i].points
    ) {
      victoires[i].position = victoires[i - 1].position;
    } else {
      victoires[i].position = position;
    }
    position++;
  }
  return victoires;
};

const factorial = (n: number): number => {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const rankingMuliChances = (
  listeMatchs: MatchModel[],
  optionsTournoi: OptionsTournoi,
  victoires: Victoire[],
): Victoire[] => {
  for (let i = 0; i < victoires.length; i++) {
    let position = 1;
    for (let j = 0; j < optionsTournoi.nbMatchs; j++) {
      const { score1, score2, equipe, manche } = listeMatchs[j];
      if (score1 !== undefined && score2 !== undefined) {
        if (equipe[0].includes(i) && score1 > score2) {
          position += factorial(optionsTournoi.nbTours + 1 - manche);
        } else if (equipe[1].includes(i) && score2 > score1) {
          position += factorial(manche);
        }
      }
    }
    victoires[i].position = position;
  }

  victoires
    .sort((a, b) => b.position - a.position)
    .forEach((value, index) => (victoires[index].position = index + 1));

  return victoires;
};

const victoiresPointsCalc = (
  listeMatchs: MatchModel[],
  optionsTournoi: OptionsTournoi,
): Victoire[] => {
  let listeJoueurs = optionsTournoi.listeJoueurs;
  let victoires = [];
  for (let i = 0; i < listeJoueurs.length; i++) {
    let nbVictoire = 0;
    let nbPoints = 0;
    let nbMatchs = 0;
    for (let j = 0; j < optionsTournoi.nbMatchs; j++) {
      const { score1, score2, equipe } = listeMatchs[j];
      if (score1 !== undefined && score2 !== undefined) {
        if (equipe[0].includes(i)) {
          if (score1 > score2) {
            nbVictoire++;
            nbPoints += score1 - score2;
          } else {
            nbPoints -= score2 - score1;
          }
          nbMatchs++;
        } else if (equipe[1].includes(i)) {
          if (score2 > score1) {
            nbVictoire++;
            nbPoints += score2 - score1;
          } else {
            nbPoints -= score1 - score2;
          }
          nbMatchs++;
        }
      }
    }
    victoires[i] = {
      joueurId: i,
      victoires: nbVictoire,
      points: nbPoints,
      nbMatchs: nbMatchs,
      position: undefined,
    };
  }

  return victoires;
};

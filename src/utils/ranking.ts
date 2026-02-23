import { TypeTournoi } from '@/types/enums/typeTournoi';
import { EquipeType } from '@/types/interfaces/equipeType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoiModel';
import { Victoire } from '@/types/interfaces/victoire';

export const ranking = (
  listeMatchs: MatchModel[],
  listeJoueurs: JoueurModel[],
  optionsTournoi: OptionsTournoiModel,
): Victoire[] => {
  const victoires = victoiresPointsCalc(listeMatchs, listeJoueurs);

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
  optionsTournoi: OptionsTournoiModel,
  victoires: Victoire[],
): Victoire[] => {
  const { nbMatchs, nbTours } = optionsTournoi;
  for (let i = 0; i < victoires.length; i++) {
    const joueurTournoiId = victoires[i].joueur.joueurTournoiId;
    let position = 1;
    for (let j = 0; j < nbMatchs; j++) {
      const { score1, score2, equipe, manche } = listeMatchs[j];
      if (score1 !== undefined && score2 !== undefined) {
        if (isJoueurInEquipe(joueurTournoiId, equipe[0]) && score1 > score2) {
          position += factorial(nbTours + 1 - manche);
        } else if (
          isJoueurInEquipe(joueurTournoiId, equipe[1]) &&
          score2 > score1
        ) {
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
  listeJoueurs: JoueurModel[],
): Victoire[] => {
  const victoires: Victoire[] = [];
  listeJoueurs.forEach((joueur) => {
    let nbVictoire = 0;
    let nbPoints = 0;
    let nbMatchs = 0;
    listeMatchs.forEach((match) => {
      const { score1, score2, equipe } = match;
      if (score1 !== undefined && score2 !== undefined) {
        if (isJoueurInEquipe(joueur.joueurTournoiId, equipe[0])) {
          if (score1 > score2) {
            nbVictoire++;
            nbPoints += score1 - score2;
          } else {
            nbPoints -= score2 - score1;
          }
          nbMatchs++;
        } else if (isJoueurInEquipe(joueur.joueurTournoiId, equipe[1])) {
          if (score2 > score1) {
            nbVictoire++;
            nbPoints += score2 - score1;
          } else {
            nbPoints -= score1 - score2;
          }
          nbMatchs++;
        }
      }
    });
    victoires.push({
      joueur: joueur,
      victoires: nbVictoire,
      points: nbPoints,
      nbMatchs: nbMatchs,
      position: 0,
    });
  });

  return victoires;
};

export const isJoueurInEquipe = (joueurId: number, equipe: EquipeType) => {
  const res = equipe.find(
    (joueur) => joueur && joueur !== -1 && joueur.joueurTournoiId === joueurId,
  );
  return res !== undefined && res !== -1;
};

import { MatchModel } from '@/types/interfaces/matchModel';

export const nextMatchMultiChances = (
  match: MatchModel,
  nbMatchs: number,
  nbTours: number,
) => {
  const { matchId, manche, score1, score2 } = match;
  if (score1 === undefined || score2 === undefined) {
    throw Error(
      'score1 ou score2 doivent être définis pour calculer le prochain match multichance',
    );
  }

  const gagnantEquipeNumber: 0 | 1 = score2 > score1 ? 1 : 0;
  const perdantEquipeNumber: 0 | 1 = score2 > score1 ? 0 : 1;

  const nbMatchsTour = nbMatchs / nbTours;

  const offset = Math.ceil((matchId % (nbMatchsTour / 2 ** (manche - 1))) / 2);
  const gagnantMatchId = matchId + nbMatchsTour - offset;
  const perdantMatchId =
    matchId + nbMatchsTour + nbMatchsTour / 2 ** manche - offset;

  const nextEquipeNumber = (matchId % 2) as 0 | 1;

  return {
    gagnantEquipeNumber,
    gagnantMatchId,
    perdantEquipeNumber,
    perdantMatchId,
    nextEquipeNumber,
  };
};

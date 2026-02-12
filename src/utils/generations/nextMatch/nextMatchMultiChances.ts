import { MatchModel } from '@/types/interfaces/matchModel';

export const nextMatchMultiChances = (
  match: MatchModel,
  nbMatchs: number,
  nbTours: number,
) => {
  const { matchId, manche, score1, score2, equipe } = match;
  if (score1 === undefined || score2 === undefined) {
    throw Error(
      'score1 ou score2 doivent être définis pour calculer le prochain match multichance',
    );
  }

  let gagnant = equipe[0];
  let perdant = equipe[1];
  if (score2 > score1) {
    gagnant = equipe[1];
    perdant = equipe[0];
  }
  const nbMatchsTour = nbMatchs / nbTours;

  const offset = Math.ceil((matchId % (nbMatchsTour / 2 ** (manche - 1))) / 2);
  const gagnantMatchId = matchId + nbMatchsTour - offset;
  const perdantMatchId =
    matchId + nbMatchsTour + nbMatchsTour / 2 ** manche - offset;

  const equipeId = matchId % 2;
  const actionMultichancesAddNextMatch = {
    type: 'MULTICHANCES_ADD_NEXT_MATCH',
    value: {
      gagnant: gagnant,
      gagnantMatchId: gagnantMatchId,
      perdant: perdant,
      perdantMatchId: perdantMatchId,
      equipeId: equipeId,
    },
  };
  return actionMultichancesAddNextMatch;
};

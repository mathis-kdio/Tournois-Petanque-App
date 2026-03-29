export const nextMatchMultiChances = (
  matchId: number,
  score1: number,
  score2: number,
  manche: number,
  nbMatchs: number,
  nbTours: number,
) => {
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

export const nextMatchMultiChances = (match, nbMatchs, nbTours) => {
  let gagnant = match.equipe[0];
  let perdant = match.equipe[1];
  if (parseInt(match.score2) > parseInt(match.score1)) {
    gagnant = match.equipe[1];
    perdant = match.equipe[0];
  }
  const nbMatchsTour = nbMatchs / nbTours;

  const offset = Math.ceil((match.id % (nbMatchsTour / 2 ** (match.manche - 1))) / 2);
  const gagnantMatchId = match.id + nbMatchsTour - offset;
  const perdantMatchId = match.id + nbMatchsTour + (nbMatchsTour / 2 ** match.manche) - offset;

  const equipeId = match.id % 2;
  const actionMultichancesAddNextMatch = { type: "MULTICHANCES_ADD_NEXT_MATCH", value: {gagnant: gagnant, gagnantMatchId: gagnantMatchId, perdant: perdant, perdantMatchId: perdantMatchId, equipeId: equipeId}};
  return actionMultichancesAddNextMatch;
}
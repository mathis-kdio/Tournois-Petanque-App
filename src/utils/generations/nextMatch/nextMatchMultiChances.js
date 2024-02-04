export const nextMatchMultiChances = (match, nbMatchs, nbTours) => {
  let gagnant = match.equipe[0];
  let perdant = match.equipe[1];
  if (parseInt(match.score2) > parseInt(match.score1)) {
    gagnant = match.equipe[1];
    perdant = match.equipe[0];
  }
  let nbMatchsTour = nbMatchs / nbTours;
  let gagnantMatchId = null;
  let perdantMatchId = null;

  if (match.id % 2 == 0) {
    gagnantMatchId = match.id + nbMatchsTour - ((match.id % (nbMatchsTour / 2 ** (match.manche - 1))) / 2);
    perdantMatchId = match.id + nbMatchsTour + ((nbMatchsTour / 2 ** match.manche) - (match.id % (nbMatchsTour / 2 ** (match.manche - 1))) / 2);
  } else {
    gagnantMatchId = match.id + nbMatchsTour - (Math.ceil((match.id % (nbMatchsTour / 2 ** (match.manche - 1))) / 2));
    perdantMatchId = match.id + nbMatchsTour + ((nbMatchsTour / 2 ** match.manche) - Math.ceil((match.id % (nbMatchsTour / 2 ** (match.manche - 1))) / 2));
  }

  let equipeId = match.id % 2;
  const actionMultichancesAddNextMatch = { type: "MULTICHANCES_ADD_NEXT_MATCH", value: {gagnant: gagnant, gagnantMatchId: gagnantMatchId, perdant: perdant, perdantMatchId: perdantMatchId, equipeId: equipeId}};
  return actionMultichancesAddNextMatch;
}
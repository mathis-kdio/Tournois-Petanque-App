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
    gagnantMatchId = match.id + nbMatchsTour - Math.floor(match.id % nbMatchsTour / 2);
  } else {
    gagnantMatchId = match.id + nbMatchsTour - Math.ceil(match.id % nbMatchsTour / 2);
  }

  if (match.id % 2 == 0) {
    perdantMatchId = match.id + nbMatchsTour + Math.ceil((nbMatchsTour - match.id % nbMatchsTour) / 2);
  } else {
    perdantMatchId = match.id + nbMatchsTour + Math.floor((nbMatchsTour - match.id % nbMatchsTour) / 2);
  }

  let equipeId = match.id % 2;
  const actionMultichancesAddNextMatch = { type: "MULTICHANCES_ADD_NEXT_MATCH", value: {gagnant: gagnant, gagnantMatchId: gagnantMatchId, perdant: perdant, perdantMatchId: perdantMatchId, equipeId: equipeId}};
  return actionMultichancesAddNextMatch;
}
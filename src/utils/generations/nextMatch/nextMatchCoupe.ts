import { MatchModel } from '@/types/interfaces/matchModel';

export const nextMatchCoupe = (match: MatchModel, nbMatchs: number) => {
  const { matchId, score1, score2, manche, equipe } = match;
  let gagnant = equipe[0];
  if (!score2 || !score1) {
    throw Error;
  }

  if (score2 > score1) {
    gagnant = equipe[1];
  }
  let nextMatchId = null;

  let div = 2;
  for (let i = 2; i <= manche; i++) {
    div = div * 2;
  }
  const nbMatchsManche = Math.floor((nbMatchs + 1) / div);

  if (manche === 1) {
    if (matchId % 2 !== 0) {
      nextMatchId = matchId + (nbMatchsManche - (matchId + 1) / 2);
    } else {
      nextMatchId = matchId + (nbMatchsManche - matchId / 2);
    }
  } else {
    let nbMatchsAvantManche = (nbMatchs + 1) / 2;
    for (let i = 1; i < manche - 1; i++) {
      nbMatchsAvantManche += nbMatchsAvantManche / 2;
    }
    nextMatchId =
      matchId +
      (nbMatchsManche - Math.ceil((matchId % nbMatchsAvantManche) / 2));
  }

  const equipeId = matchId % 2;
  const actionAjoutAdversaire = {
    type: 'COUPE_AJOUT_ADVERSAIRE',
    value: { gagnant: gagnant, nextMatchId: nextMatchId, equipeId: equipeId },
  };
  return actionAjoutAdversaire;
};

import { MatchModel } from '@/types/interfaces/matchModel';

export const nextMatchCoupe = (match: MatchModel, nbMatchs: number) => {
  const { id, score1, score2, manche, equipe } = match;
  let gagnant = equipe[0];
  if (!score2 || !score1) {
    throw Error;
  }

  if (score2 > score1) {
    gagnant = equipe[1];
  }
  let matchId = null;

  let div = 2;
  for (let i = 2; i <= manche; i++) {
    div = div * 2;
  }
  let nbMatchsManche = Math.floor((nbMatchs + 1) / div);

  if (manche === 1) {
    if (id % 2 !== 0) {
      matchId = id + (nbMatchsManche - (id + 1) / 2);
    } else {
      matchId = id + (nbMatchsManche - id / 2);
    }
  } else {
    let nbMatchsAvantManche = (nbMatchs + 1) / 2;
    for (let i = 1; i < manche - 1; i++) {
      nbMatchsAvantManche += nbMatchsAvantManche / 2;
    }
    matchId = id + (nbMatchsManche - Math.ceil((id % nbMatchsAvantManche) / 2));
  }

  let equipeId = id % 2;
  const actionAjoutAdversaire = {
    type: 'COUPE_AJOUT_ADVERSAIRE',
    value: { gagnant: gagnant, matchId: matchId, equipeId: equipeId },
  };
  return actionAjoutAdversaire;
};

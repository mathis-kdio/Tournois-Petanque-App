import { Match } from '@/types/interfaces/match';

export const nextMatchCoupe = (match: Match, nbMatchs: number) => {
  let gagnant = match.equipe[0];
  if (match.score2 > match.score1) {
    gagnant = match.equipe[1];
  }
  let matchId = null;

  let div = 2;
  for (let i = 2; i <= match.manche; i++) {
    div = div * 2;
  }
  let nbMatchsManche = Math.floor((nbMatchs + 1) / div);

  if (match.manche === 1) {
    if (match.id % 2 !== 0) {
      matchId = match.id + (nbMatchsManche - (match.id + 1) / 2);
    } else {
      matchId = match.id + (nbMatchsManche - match.id / 2);
    }
  } else {
    let nbMatchsAvantManche = (nbMatchs + 1) / 2;
    for (let i = 1; i < match.manche - 1; i++) {
      nbMatchsAvantManche += nbMatchsAvantManche / 2;
    }
    matchId =
      match.id +
      (nbMatchsManche - Math.ceil((match.id % nbMatchsAvantManche) / 2));
  }

  let equipeId = match.id % 2;
  const actionAjoutAdversaire = {
    type: 'COUPE_AJOUT_ADVERSAIRE',
    value: { gagnant: gagnant, matchId: matchId, equipeId: equipeId },
  };
  return actionAjoutAdversaire;
};

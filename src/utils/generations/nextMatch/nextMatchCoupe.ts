export const nextMatchCoupe = (
  matchId: number,
  score1: number,
  score2: number,
  manche: number,
  nbMatchs: number,
) => {
  const equipeNumber: 1 | 0 = score2 > score1 ? 1 : 0;

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

  const nextEquipeNumber = (matchId % 2) as 0 | 1;

  return {
    equipeNumber,
    gagnantMatchId: nextMatchId,
    nextEquipeNumber,
  };
};

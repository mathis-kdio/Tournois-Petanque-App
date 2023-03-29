const NB_PT_VICTORY = 13;

export const rankingCalc = (listeMatchs) => {
  let victoires = []
  if (!listeMatchs)
    return;

  let listeJoueurs = listeMatchs[listeMatchs.length - 1].listeJoueurs
  for (let i = 0; i < listeJoueurs.length; i++) {
    let nbVictoire = 0;
    let nbPoints = 0;
    let nbMatchs = 0;
    for (let j = 0; j < listeMatchs[listeMatchs.length - 1].nbMatchs; j++) {
      if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
        if (listeMatchs[j].score1 >= NB_PT_VICTORY) {
          nbVictoire++;
          nbPoints += NB_PT_VICTORY - listeMatchs[j].score2;
        }
        else {
          nbPoints -= NB_PT_VICTORY - listeMatchs[j].score1;
        }
        nbMatchs++;
      }
      if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
        if (listeMatchs[j].score2 >= NB_PT_VICTORY) {
          nbVictoire++;
          nbPoints += NB_PT_VICTORY - listeMatchs[j].score1;
        }
        else {
          nbPoints -= NB_PT_VICTORY - listeMatchs[j].score2;
        }
        nbMatchs++;
      }
    }
    victoires[i] = {joueurId: i, victoires: nbVictoire, points: nbPoints, nbMatchs: nbMatchs, position: undefined};
  }

  victoires.sort(
    function(a, b) {          
      if (a.victoires === b.victoires) {
        return b.points - a.points;
      }
      return b.victoires - a.victoires;
    }
  );

  let position = 1;
  for (let i = 0; i < victoires.length; i++) {
    if(i > 0 && victoires[i-1].victoires === victoires[i].victoires && victoires[i-1].points === victoires[i].points) {
      victoires[i].position = victoires[i-1].position;
    }
    else {
      victoires[i].position = position;
    }
    position++;
  }
  return victoires
}
export const rankingCalc = (listeMatchs) => {
  if (!listeMatchs)
    return;

  let victoires = []
  let optionsTournoi = listeMatchs[listeMatchs.length - 1];
  let nbPtVictoire = optionsTournoi.nbPtVictoire ? optionsTournoi.nbPtVictoire : 13;
  let listeJoueurs = optionsTournoi.listeJoueurs;
  for (let i = 0; i < listeJoueurs.length; i++) {
    let nbVictoire = 0;
    let nbPoints = 0;
    let nbMatchs = 0;
    for (let j = 0; j < optionsTournoi.nbMatchs; j++) {
      if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
        if (listeMatchs[j].score1 >= nbPtVictoire) {
          nbVictoire++;
          nbPoints += nbPtVictoire - listeMatchs[j].score2;
        }
        else {
          nbPoints -= nbPtVictoire - listeMatchs[j].score1;
        }
        nbMatchs++;
      }
      if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
        if (listeMatchs[j].score2 >= nbPtVictoire) {
          nbVictoire++;
          nbPoints += nbPtVictoire - listeMatchs[j].score1;
        }
        else {
          nbPoints -= nbPtVictoire - listeMatchs[j].score2;
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
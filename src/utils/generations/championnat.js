
export const generationChampionnat = (optionsTournoi, listesJoueurs, ) => {
    let typeEquipes = optionsTournoi.typeEquipes;
    let nbjoueurs = listesJoueurs.avecEquipes.length;
    let matchs = [];
    let idMatch = 0;
    let equipe = [];

    //Initialisation des matchs dans un tableau
    let nbEquipes;
    let nbMatchsParTour;
    if (typeEquipes == "teteatete") {
      nbEquipes = nbjoueurs;
      nbMatchsParTour = nbjoueurs / 2;
    }
    else if (typeEquipes == "doublette") {
      nbEquipes = nbjoueurs / 2;
      nbMatchsParTour = Math.ceil(nbjoueurs / 4);
    }
    else {
      nbEquipes = nbjoueurs / 3;
      nbMatchsParTour = Math.ceil(nbjoueurs / 6);
    }
    let nbTours = nbEquipes - 1;
    let nbMatchs = nbTours * nbMatchsParTour;

    idMatch = 0;
    for (let i = 1; i < nbTours + 1; i++) {
      for (let j = 0; j < nbMatchsParTour; j++) {
        matchs.push({id: idMatch, manche: i, equipe: [[-1,-1,-1],[-1,-1,-1]], score1: undefined, score2: undefined});
        idMatch++;
      }
    }

    //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
    for (let i = 1; i <= nbEquipes; i++) {
      equipe.push([]);
      for (let j = 0; j < nbjoueurs; j++) {
        if (listesJoueurs.avecEquipes[j].equipe == i) {
          equipe[i - 1].push(listesJoueurs.avecEquipes[j].id);
        }
      }
    }

    //On place les ids des équipes dans un tableau qui sera décalé à chaque nouveaux tour
    let equipesIds = [];
    for (let i = 0; i < nbEquipes; i++) {
      equipesIds.push(i);
    }

    //FONCTIONNEMENT
    idMatch = 0;
    for (let i = 0; i < nbTours; i++) {
      for (let j = 0; j < equipe.length / 2; j++) {
        //Affectation Equipe 1
        matchs[idMatch].equipe[0][0] = equipe[equipesIds[j]][0];
        if (typeEquipes == "doublette" || typeEquipes == "triplette") {
          matchs[idMatch].equipe[0][1] = equipe[equipesIds[j]][1];
        }
        if (typeEquipes == "triplette") {
          matchs[idMatch].equipe[0][2] = equipe[equipesIds[j]][2];
        }

        //Affectation Equipe 2
        matchs[idMatch].equipe[1][0] = equipe[equipesIds[nbEquipes - 1 - j]][0];
        if (typeEquipes == "doublette" || typeEquipes == "triplette") {
          matchs[idMatch].equipe[1][1] = equipe[equipesIds[nbEquipes - 1 - j]][1];
        }
        if (typeEquipes == "triplette") {
          matchs[idMatch].equipe[1][2] = equipe[equipesIds[nbEquipes - 1 - j]][2];
        }
        idMatch++;
      }
      equipesIds.splice(1, 0, equipesIds.pop());
      idMatch = nbMatchsParTour * (i + 1);
    }
    return {matchs, nbTours, nbMatchs};
}

export const generationAvecEquipes = (listeJoueurs, nbTours, typeEquipes) => {
  let nbjoueurs = listeJoueurs.length;
  let speciauxIncompatibles = true
  let jamaisMemeCoequipier = true
  let eviterMemeAdversaire = true;
  let matchs = [];
  let idMatch = 0;
  let equipe = []

  //Initialisation des matchs dans un tableau
  let nbEquipes
  let nbMatchsParTour
  if (typeEquipes == "teteatete") {
    nbEquipes = nbjoueurs
    nbMatchsParTour = nbjoueurs / 2
  }
  else if (typeEquipes == "doublette") {
    nbEquipes = nbjoueurs / 2
    nbMatchsParTour = Math.ceil(nbjoueurs / 4)
  }
  else {
    nbEquipes = nbjoueurs / 3
    nbMatchsParTour = Math.ceil(nbjoueurs / 6)
  }
  let nbMatchs = nbTours * nbMatchsParTour

  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({id: idMatch, manche: i, equipe: [[-1,-1,-1],[-1,-1,-1]], score1: undefined, score2: undefined});
      idMatch++;
    }
  }

  //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
  for (let i = 1; i <= nbEquipes; i++) {
    equipe.push([])
    for (let j = 0; j < nbjoueurs; j++) {
      if(listeJoueurs[j].equipe == i) {
        equipe[i - 1].push(listeJoueurs[j].id)
      }
    }
  }

  //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
  let equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }
  function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  //FONCTIONNEMENT
  idMatch = 0;
  let breaker = 0 //permet de détecter quand boucle infinie
  for (let i = 0; i < nbTours; i++) {
    breaker = 0
    let randomEquipesIds = shuffle(equipesIds)
    for (let j = 0; j < equipe.length;) {
      //Affectation equipe 1
      if (matchs[idMatch].equipe[0][0] == -1) {
        matchs[idMatch].equipe[0][0] = equipe[randomEquipesIds[j]][0]
        if (typeEquipes == "doublette" || typeEquipes == "triplette") {
          matchs[idMatch].equipe[0][1] = equipe[randomEquipesIds[j]][1]
        }
        if (typeEquipes == "triplette") {
          matchs[idMatch].equipe[0][2] = equipe[randomEquipesIds[j]][2]
        }
        j++
        breaker = 0
      }
      //Affectation Equipe 2
      if (matchs[idMatch].equipe[1][0] == -1) {
        //Test si les équipes 1 et 2 n'ont pas déjà jouées ensemble
        if (eviterMemeAdversaire == true) {
          matchs[idMatch].equipe[1][0] = equipe[randomEquipesIds[j]][0]
          if (typeEquipes == "doublette" || typeEquipes == "triplette") {
            matchs[idMatch].equipe[1][1] = equipe[randomEquipesIds[j]][1]
          }
          if (typeEquipes == "triplette") {
            matchs[idMatch].equipe[1][2] = equipe[randomEquipesIds[j]][2]
          }
          j++
          breaker = 0
        }
      }
      else {
        breaker++
      }

      idMatch++;
      //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
      if (idMatch >= nbMatchsParTour * (i + 1)) {
        idMatch = i * nbMatchsParTour;
      }

      //En cas de trop nombreuses tentatives, arret de la génération
      //L'utilisateur est invité à changer les paramètres ou à relancer la génération
      //TODO condition de break à affiner
      //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / nbTours
      if (breaker > nbMatchs) {
        return {echecGeneration: true}
      }
    }

    //Permettra de retenir contre quelles équipes une équipe a joué
    /*idMatch = i * nbMatchsParTour;
    for (let j = 0; j < nbMatchsParTour; j++) {
      joueurs[matchs[idMatch + j].equipe[0][0] - 1].equipe.push(matchs[idMatch + j].equipe[0][1]);
      joueurs[matchs[idMatch + j].equipe[0][1] - 1].equipe.push(matchs[idMatch + j].equipe[0][0]);
      joueurs[matchs[idMatch + j].equipe[1][0] - 1].equipe.push(matchs[idMatch + j].equipe[1][1]);
      joueurs[matchs[idMatch + j].equipe[1][1] - 1].equipe.push(matchs[idMatch + j].equipe[1][0]);
    }*/
    idMatch = nbMatchsParTour * (i + 1);
  }

  return {matchs, nbMatchs};  
}
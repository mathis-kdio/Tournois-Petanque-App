import { TypeEquipes } from "@/types/enums/typeEquipes";
import { Joueur } from "@/types/interfaces/joueur";

export const generationCoupe = (optionsTournoi, listeJoueurs: Joueur[]) => {
  let typeEquipes = optionsTournoi.typeEquipes;
  let nbjoueurs = listeJoueurs.length;
  let nbTours = 0;
  let matchs = [];
  let equipe = [];

  //Initialisation des matchs dans un tableau
  let nbEquipes
  let nbMatchsPremierTour
  if (typeEquipes == TypeEquipes.TETEATETE) {
    nbEquipes = nbjoueurs;
    nbMatchsPremierTour = nbjoueurs / 2;
  }
  else if (typeEquipes == TypeEquipes.DOUBLETTE) {
    nbEquipes = nbjoueurs / 2;
    nbMatchsPremierTour = Math.ceil(nbjoueurs / 4);
  }
  else {
    nbEquipes = nbjoueurs / 3;
    nbMatchsPremierTour = Math.ceil(nbjoueurs / 6);
  }
  nbTours = Math.log2(nbEquipes);

  let idMatch = 0;
  for (let i = 1, nbMatchsParTour = nbMatchsPremierTour; i < nbTours + 1; i++, nbMatchsParTour/=2) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({id: idMatch, manche: i, mancheName: "1/" + nbMatchsParTour, equipe: [[-1,-1,-1],[-1,-1,-1]], score1: undefined, score2: undefined});
      idMatch++;
    }
  }
  let nbMatchs = idMatch;
  matchs[matchs.length - 1].mancheName = "Finale";
  //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
  for (let i = 1; i <= nbEquipes; i++) {
    equipe.push([]);
    for (let j = 0; j < nbjoueurs; j++) {
      if (listeJoueurs[j].equipe == i) {
        equipe[i - 1].push(listeJoueurs[j].id);
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
  for (let j = 0; j < equipe.length / 2; j++) {
    //Affectation Equipe 1
    matchs[idMatch].equipe[0][0] = equipe[equipesIds[j]][0];
    if (typeEquipes == TypeEquipes.DOUBLETTE || typeEquipes == TypeEquipes.TRIPLETTE) {
      matchs[idMatch].equipe[0][1] = equipe[equipesIds[j]][1];
    }
    if (typeEquipes == TypeEquipes.TRIPLETTE) {
      matchs[idMatch].equipe[0][2] = equipe[equipesIds[j]][2];
    }

    //Affectation Equipe 2
    matchs[idMatch].equipe[1][0] = equipe[equipesIds[nbEquipes - 1 - j]][0];
    if (typeEquipes == TypeEquipes.DOUBLETTE || typeEquipes == TypeEquipes.TRIPLETTE) {
      matchs[idMatch].equipe[1][1] = equipe[equipesIds[nbEquipes - 1 - j]][1];
    }
    if (typeEquipes == TypeEquipes.TRIPLETTE) {
      matchs[idMatch].equipe[1][2] = equipe[equipesIds[nbEquipes - 1 - j]][2];
    }
    idMatch++;
  }
  equipesIds.splice(1, 0, equipesIds.pop());

  return {matchs, nbTours, nbMatchs};
}
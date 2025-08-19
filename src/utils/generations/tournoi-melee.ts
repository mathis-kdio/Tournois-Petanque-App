import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Joueur } from '@/types/interfaces/joueur';
import { shuffle } from './generation';
import { Match } from '@/types/interfaces/match';
import { EquipeGeneration } from '@/types/interfaces/equipe-generation.interface';

export const generationMelee = (
  listeJoueurs: Joueur[],
  nbTours: number,
  typeEquipes: TypeEquipes,
  eviterMemeAdversaire: number,
) => {
  let nbjoueurs = listeJoueurs.length;
  let matchs: Match[] = [];
  let idMatch = 0;
  let equipes: EquipeGeneration[] = [];

  //Initialisation des matchs dans un tableau
  let nbEquipes: number;
  let nbMatchsParTour: number;
  if (typeEquipes === TypeEquipes.TETEATETE) {
    nbEquipes = nbjoueurs;
    nbMatchsParTour = nbjoueurs / 2;
  } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = nbjoueurs / 2;
    nbMatchsParTour = Math.ceil(nbjoueurs / 4);
  } else {
    nbEquipes = nbjoueurs / 3;
    nbMatchsParTour = Math.ceil(nbjoueurs / 6);
  }
  let nbMatchs = nbTours * nbMatchsParTour;

  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({
        id: idMatch,
        manche: i,
        equipe: [
          [-1, -1, -1, -1],
          [-1, -1, -1, -1],
        ],
        score1: undefined,
        score2: undefined,
        mancheName: undefined,
        terrain: undefined,
      });
      idMatch++;
    }
  }

  //Création d'un tableau dans lequel les joueurs sont regroupés par équipes
  for (let i = 1; i <= nbEquipes; i++) {
    equipes.push({ joueurs: [], adversesId: [] });
    for (let j = 0; j < nbjoueurs; j++) {
      if (listeJoueurs[j].equipe === i) {
        equipes[i - 1].joueurs.push(listeJoueurs[j].id);
      }
    }
  }

  //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
  let equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }

  //FONCTIONNEMENT
  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let tour = 0; tour < nbTours; tour++) {
    breaker = 0;
    let randomEquipesIds = shuffle(equipesIds);
    for (let j = 0; j < equipes.length; ) {
      //Affectation equipe 1
      if (matchs[idMatch].equipe[0][0] === -1) {
        matchs[idMatch].equipe[0][0] = equipes[randomEquipesIds[j]].joueurs[0];
        if (
          typeEquipes === TypeEquipes.DOUBLETTE ||
          typeEquipes === TypeEquipes.TRIPLETTE
        ) {
          matchs[idMatch].equipe[0][1] = equipes[randomEquipesIds[j]].joueurs[1];
        }
        if (typeEquipes === TypeEquipes.TRIPLETTE) {
          matchs[idMatch].equipe[0][2] = equipes[randomEquipesIds[j]].joueurs[2];
        }
        j++;
        breaker = 0;
      }
      //Affectation Equipe 2
      let affectationPossible = true;
      //Règle eviterMemeAdversaire
      let equipe1Id = equipes.findIndex((equipe) =>
        equipe.joueurs.every(
          (v, index) => v === matchs[idMatch].equipe[0][index],
        ),
      );
      let nbRencontres = equipes[equipe1Id].adversesId.filter(
        (el) => el === randomEquipesIds[j],
      ).length;
      if (eviterMemeAdversaire === 0 && nbRencontres !== 0) {
        //1 seul match possible
        affectationPossible = false;
      } else if (
        eviterMemeAdversaire === 50 &&
        nbRencontres >= Math.floor(nbTours / 2)
      ) {
        //La moitié des matchs possible
        affectationPossible = false;
      }
      if (matchs[idMatch].equipe[1][0] === -1 && affectationPossible) {
        matchs[idMatch].equipe[1][0] = equipes[randomEquipesIds[j]].joueurs[0];
        if (
          typeEquipes === TypeEquipes.DOUBLETTE ||
          typeEquipes === TypeEquipes.TRIPLETTE
        ) {
          matchs[idMatch].equipe[1][1] = equipes[randomEquipesIds[j]].joueurs[1];
        }
        if (typeEquipes === TypeEquipes.TRIPLETTE) {
          matchs[idMatch].equipe[1][2] = equipes[randomEquipesIds[j]].joueurs[2];
        }
        equipes[equipe1Id].adversesId.push(randomEquipesIds[j]);
        equipes[randomEquipesIds[j]].adversesId.push(equipe1Id);

        j++;
        breaker = 0;
      } else {
        breaker++;
      }

      idMatch++;
      //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
      if (idMatch >= nbMatchsParTour * (tour + 1)) {
        idMatch = tour * nbMatchsParTour;
      }

      //En cas de trop nombreuses tentatives, arret de la génération
      //L'utilisateur est invité à changer les paramètres ou à relancer la génération
      //TODO condition de break à affiner
      //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / nbTours
      if (breaker > nbMatchs) {
        return { echecGeneration: true };
      }
    }

    idMatch = nbMatchsParTour * (tour + 1);
  }

  return { matchs, nbMatchs };
};

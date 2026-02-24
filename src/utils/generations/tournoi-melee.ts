import { TypeEquipes } from '@/types/enums/typeEquipes';
import { EquipeGeneration } from '@/types/interfaces/equipe-generation.interface';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchGeneration } from '@/types/interfaces/match-generation';
import { shuffle } from './generation';

export const generationMelee = (
  listeJoueurs: JoueurModel[],
  nbTours: number,
  typeEquipes: TypeEquipes,
  eviterMemeAdversaire: number,
) => {
  const nbjoueurs = listeJoueurs.length;

  //Calcul nombre d'équipes, du nombre de match et nombre de matchs par tour
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
  const nbMatchs = nbTours * nbMatchsParTour;

  //Initialisation des matchs dans un tableau
  const matchs: MatchGeneration[] = [];
  let idMatch = 0;
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
  const equipes: EquipeGeneration[] = [];
  for (let i = 1; i <= nbEquipes; i++) {
    equipes.push({ joueurs: [], adversesId: [] });
    for (let j = 0; j < nbjoueurs; j++) {
      const joueur = listeJoueurs[j];
      if (joueur.equipe === i) {
        equipes[i - 1].joueurs.push(joueur.joueurTournoiId);
      }
    }
  }

  //On place les ids des équipes dans un tableau qui sera mélanger à chaque nouveaux tour
  const equipesIds = [];
  for (let i = 0; i < nbEquipes; i++) {
    equipesIds.push(i);
  }

  //FONCTIONNEMENT
  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let tour = 0; tour < nbTours; tour++) {
    breaker = 0;
    const randomEquipesIds = shuffle(equipesIds);
    for (let j = 0; j < equipes.length; j) {
      const match = matchs[idMatch];
      //Affectation equipe 1
      const equipe1 = match.equipe[0];
      if (equipe1[0] === -1) {
        equipe1[0] = equipes[randomEquipesIds[j]].joueurs[0];
        if (
          typeEquipes === TypeEquipes.DOUBLETTE ||
          typeEquipes === TypeEquipes.TRIPLETTE
        ) {
          equipe1[1] = equipes[randomEquipesIds[j]].joueurs[1];
        }
        if (typeEquipes === TypeEquipes.TRIPLETTE) {
          equipe1[2] = equipes[randomEquipesIds[j]].joueurs[2];
        }
        j++;
        breaker = 0;
      }
      //Affectation Equipe 2
      const equipe2 = match.equipe[1];
      const equipe1Id = equipes.findIndex((equipe) =>
        equipe.joueurs.every((v, index) => v === equipe1[index]),
      );

      //Règle eviterMemeAdversaire
      const affectationPossible = testRegleEviterMemeAdversaire(
        equipes,
        equipe1Id,
        randomEquipesIds[j],
        eviterMemeAdversaire,
        nbTours,
      );

      if (equipe2[0] === -1 && affectationPossible) {
        equipe2[0] = equipes[randomEquipesIds[j]].joueurs[0];
        if (
          typeEquipes === TypeEquipes.DOUBLETTE ||
          typeEquipes === TypeEquipes.TRIPLETTE
        ) {
          equipe2[1] = equipes[randomEquipesIds[j]].joueurs[1];
        }
        if (typeEquipes === TypeEquipes.TRIPLETTE) {
          equipe2[2] = equipes[randomEquipesIds[j]].joueurs[2];
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

const testRegleEviterMemeAdversaire = (
  equipes: EquipeGeneration[],
  equipe1Id: number,
  randomEquipesId: number,
  eviterMemeAdversaire: number,
  nbTours: number,
) => {
  const nbRencontres = equipes[equipe1Id].adversesId.filter(
    (el) => el === randomEquipesId,
  ).length;
  if (eviterMemeAdversaire === 0 && nbRencontres !== 0) {
    //1 seul match possible
    return false;
  } else if (
    eviterMemeAdversaire === 50 &&
    nbRencontres >= Math.floor(nbTours / 2)
  ) {
    //La moitié des matchs possible
    return false;
  } else {
    return true;
  }
};

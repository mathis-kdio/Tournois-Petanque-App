import { JoueurModel } from '@/types/interfaces/joueurModel';
import { shuffle } from './generation';

export const generationTeteATete = (
  listeJoueurs: JoueurModel[],
  nbTours: number,
  eviterMemeAdversaire: number,
) => {
  let nbjoueurs = listeJoueurs.length;
  let matchs = [];
  let idMatch = 0;
  let joueurs = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour = nbjoueurs / 2;
  let nbMatchs = nbTours * nbMatchsParTour;
  idMatch = 0;
  for (let i = 1; i < nbTours + 1; i++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({
        id: idMatch,
        manche: i,
        equipe: [
          [-1, -1, -1],
          [-1, -1, -1],
        ],
        score1: undefined,
        score2: undefined,
      });
      idMatch++;
    }
  }

  for (let i = 0; i < nbjoueurs; i++) {
    const joueur = { ...listeJoueurs[i], equipe: [] };
    joueurs.push(joueur);
  }

  //On place les ids des joueurs dans un tableau qui sera mélangé à chaque nouveau tour
  let joueursIds = [];
  for (let i = 0; i < joueurs.length; i++) {
    joueursIds.push(joueurs[i].id);
  }

  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let i = 0; i < nbTours; i++) {
    breaker = 0;
    let random = shuffle(joueursIds);
    for (let j = 0; j < joueurs.length; ) {
      //Affectation joueur equipe 1
      if (matchs[idMatch].equipe[0][0] === -1) {
        matchs[idMatch].equipe[0][0] = random[j];
        j++;
        breaker = 0;
      }
      //Affectation joueur equipe 2
      if (random[j] !== undefined) {
        //Test si l'équipe 1 n'a pas déjà joué contre + de la moitié de ses matchs contre le joueur adverse
        let affectationPossible = true;
        if (eviterMemeAdversaire !== 100) {
          if (matchs[idMatch].equipe[0][0] !== -1) {
            let joueur1 = matchs[idMatch].equipe[0][0];
            let totPartiesJ1 = 0;
            //Compte le nombre de fois où dans des matchs :
            //Si le joueur en affectation était joueur 3 ou 4 et qu'il a déjà eu le joueur 1 ou 2 comme adversaire
            //OU
            //Si le joueur en affectation était joueur 1 ou 2 et qu'il a déjà eu le joueur 3 ou 4 comme adversaire
            const occurrencesAdversaireDansEquipe1 = (
              arr,
              joueurAdverse,
              joueurAffect,
            ) =>
              arr.reduce(
                (a, v) =>
                  v.equipe[0][0] === joueurAdverse &&
                  v.equipe[1][0] === joueurAffect
                    ? a + 1
                    : a,
                0,
              );
            const occurrencesAdversaireDansEquipe2 = (
              arr,
              joueurAdverse,
              joueurAffect,
            ) =>
              arr.reduce(
                (a, v) =>
                  v.equipe[1][0] === joueurAdverse &&
                  v.equipe[0][0] === joueurAffect
                    ? a + 1
                    : a,
                0,
              );
            totPartiesJ1 += occurrencesAdversaireDansEquipe1(
              matchs,
              joueur1,
              random[j],
            );
            totPartiesJ1 += occurrencesAdversaireDansEquipe2(
              matchs,
              joueur1,
              random[j],
            );
            //+1 si joueur en cours d'affectation a déjà joué dans la même équipe
            totPartiesJ1 += joueurs[joueur1].equipe.includes(random[j]) ? 1 : 0;

            //Règle eviterMemeAdversaire choix dans slider options (0: seul match possible, 50: la moitié des matchs, 100: tous les matchs = règle désactivée)
            let maxNbMatchs = 1;
            if (eviterMemeAdversaire === 50) {
              maxNbMatchs = nbTours === 1 ? 1 : Math.floor(nbTours / 2);
            }
            if (totPartiesJ1 >= maxNbMatchs) {
              affectationPossible = false;
            }
          } else {
            affectationPossible = false;
          }
        }
        if (affectationPossible === true) {
          //Affectation equipe 2
          if (matchs[idMatch].equipe[1][0] === -1) {
            matchs[idMatch].equipe[1][0] = random[j];
            j++;
            breaker = 0;
          }
        } else {
          breaker++;
        }
      }

      idMatch++;
      //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
      if (idMatch >= nbMatchsParTour * (i + 1)) {
        idMatch = i * nbMatchsParTour;
      }

      //En cas de trop nombreuses tentatives, arret de la génération
      //L'utilisateur est invité à changer les paramètres ou à relancer la génération
      if (breaker > nbMatchs) {
        return { echecGeneration: true };
      }
    }

    idMatch = i * nbMatchsParTour;
    idMatch = nbMatchsParTour * (i + 1);
  }

  return { matchs, nbMatchs };
};

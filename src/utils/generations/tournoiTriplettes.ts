import { JoueurType } from '@/types/enums/joueurType';
import {
  calcNbMatchsParTour,
  shuffle,
  uniqueValueArrayRandOrder,
} from './generation';
import { Joueur } from '@/types/interfaces/joueur';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Complement } from '@/types/enums/complement';
import { MatchModel } from '@/types/interfaces/match';
import { JoueurGeneration } from '@/types/interfaces/joueur-generation.interface';
import {
  testAffectationPossible,
  updatePlayerRelationships,
} from './melee-demelee';

export const generationTriplettes = (
  listeJoueurs: Joueur[],
  nbTours: number,
  complement: Complement,
  speciauxIncompatibles: boolean,
  jamaisMemeCoequipier: boolean,
  eviterMemeAdversaire: number,
) => {
  let nbjoueurs = listeJoueurs.length;
  let matchs: MatchModel[] = [];
  let idMatch = 0;
  let joueursSpe = [];
  let joueursNonSpe = [];
  let joueurs: JoueurGeneration[] = [];

  //Initialisation des matchs dans un tableau
  let nbMatchsParTour = calcNbMatchsParTour(
    nbjoueurs,
    TypeEquipes.TRIPLETTE,
    ModeTournoi.AVECNOMS,
    TypeTournoi.MELEDEMELE,
    complement,
  );
  let nbMatchs = nbTours * nbMatchsParTour;
  idMatch = 0;
  for (let tour = 1; tour < nbTours + 1; tour++) {
    for (let j = 0; j < nbMatchsParTour; j++) {
      matchs.push({
        id: idMatch,
        manche: tour,
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

  //Création d'un tableau contenant tous les joueurs, un autre les non enfants et un autre les enfants
  //Le tableau contenant les tous les joueurs permettra de connaitre dans quel équipe chaque joueur a été
  for (let i = 0; i < nbjoueurs; i++) {
    if (listeJoueurs[i].type === JoueurType.ENFANT) {
      joueursSpe.push({ ...listeJoueurs[i] });
      joueursSpe[joueursSpe.length - 1].equipe = [];
    } else {
      joueursNonSpe.push({ ...listeJoueurs[i] });
      joueursNonSpe[joueursNonSpe.length - 1].equipe = [];
    }
    joueurs.push({
      id: listeJoueurs[i].id,
      name: listeJoueurs[i].name,
      type: listeJoueurs[i].type,
      isChecked: listeJoueurs[i].isChecked,
      allCoequipiers: [],
      allAdversaires: [],
    });
  }

  let nbJoueursSpe = joueursSpe.length;

  //Assignation des joueurs enfants
  if (speciauxIncompatibles === true) {
    //Test si joueurs enfants ne sont pas + que 1/3 des joueurs
    if (nbJoueursSpe <= nbjoueurs / 3) {
      //Joueurs enfants seront toujours J1 E1 ou J1 E2
      for (let i = 0; i < nbTours; i++) {
        let idMatch = i * nbMatchsParTour;
        let idsJoueursSpe = [];
        idsJoueursSpe = uniqueValueArrayRandOrder(joueursSpe.length);
        for (let j = 0; j < joueursSpe.length; j++) {
          if (matchs[idMatch].equipe[0][0] === -1) {
            matchs[idMatch].equipe[0][0] = joueursSpe[idsJoueursSpe[j]].id;
          } else if (matchs[idMatch].equipe[1][0] === -1) {
            matchs[idMatch].equipe[1][0] = joueursSpe[idsJoueursSpe[j]].id;
            idMatch++;
          }
        }
      }
    }
    //Si trop nombreux alors message et retour à l'inscription
    else {
      return { erreurSpeciaux: true };
    }
  }
  //Si la règle n'est pas activée alors les joueurs enfants et les non enfants sont regroupés
  else {
    joueursNonSpe.splice(0, joueursNonSpe.length);
    for (let i = 0; i < nbjoueurs; i++) {
      joueursNonSpe.push({ ...listeJoueurs[i] });
    }
  }

  if (complement !== undefined) {
    const complementIds = [];

    const complementCount = getNbComplements(complement);

    for (let i = 0; i < complementCount; i++) {
      const id = nbjoueurs + i;
      joueurs.push({
        name: 'Complement',
        type: JoueurType.ENFANT,
        id: id,
        isChecked: false,
        allCoequipiers: [],
        allAdversaires: [],
      });
      complementIds.push(id);
    }

    for (let i = 1; i < nbTours + 1; i++) {
      const matchIndex = nbMatchsParTour * i - 1;
      switch (complement) {
        case Complement.QUATREVSTROIS:
          matchs[matchIndex].equipe[1][3] = complementIds[0];
          break;
        case Complement.TETEATETE:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[0][1] = complementIds[1];
          matchs[matchIndex].equipe[1][0] = complementIds[2];
          matchs[matchIndex].equipe[1][1] = complementIds[3];
          break;
        case Complement.DEUXVSUN:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[1][0] = complementIds[1];
          matchs[matchIndex].equipe[1][1] = complementIds[2];
          break;
        case Complement.DOUBLETTES:
          matchs[matchIndex].equipe[0][0] = complementIds[0];
          matchs[matchIndex].equipe[1][0] = complementIds[1];
          break;
        case Complement.TROISVSDEUX:
          matchs[matchIndex].equipe[1][0] = complementIds[0];
          break;
      }
    }
  }

  //Test si possible d'appliquer la règle jamaisMemeCoequipier
  //TO DO : réussir à trouver les bons paramètres pour déclencher le message d'erreur sans empecher trop de tournois
  if (jamaisMemeCoequipier === true) {
    let nbCombinaisons = nbjoueurs;
    //Si option de ne pas mettre enfants ensemble alors moins de combinaisons possibles
    if (speciauxIncompatibles === true) {
      if (nbJoueursSpe <= nbjoueurs / 3) {
        nbCombinaisons -= nbJoueursSpe;
      }
    }
    //Si + de matchs que de combinaisons alors on désactive la règle de ne jamais faire jouer avec la même personne
    if (nbCombinaisons < nbTours) {
      //TODO: voir TODO au-dessus
      return { erreurMemesEquipes: true };
    }
  }

  //On ordonne aléatoirement les ids des joueurs non enfants à chaque début de manche
  let joueursNonSpeId = [];
  for (let i = 0; i < joueursNonSpe.length; i++) {
    joueursNonSpeId.push(joueursNonSpe[i].id);
  }

  //FONCTIONNEMENT
  //S'il y a eu des joueurs enfants avant alors ils ont déjà été affectés
  //On complète avec tous les joueurs non enfants
  //Pour conpléter remplissage des matchs tour par tour
  //A chaque tour les joueurs libres sont pris un par un dans une liste les triant aléatoirement à chaque début de tour
  //Ils sont ensuite ajouté si possible (selon les options) dans le 1er match du tour en tant que joueur 1
  //Si joueur 1 déjà pris alors joueur 2 et si déjà pris alors joueur 3 etc
  //Si impossible d'être ajouté dans le match alors tentative dans le match suivant du même tour
  //Si impossible dans aucun match du tour alors breaker rentre en action et affiche un message

  const equipeIndices = [
    { equipe: 0, place: 0 },
    { equipe: 0, place: 1 },
    { equipe: 0, place: 2 },
    { equipe: 1, place: 0 },
    { equipe: 1, place: 1 },
    { equipe: 1, place: 2 },
  ];

  idMatch = 0;
  let breaker = 0; //permet de détecter quand boucle infinie
  for (let tour = 0; tour < nbTours; tour++) {
    breaker = 0;
    let random = shuffle(joueursNonSpeId);
    for (let j = 0; j < joueursNonSpe.length; ) {
      let joueurId = random[j];
      let match = matchs[idMatch];

      let assigned = false;

      for (const { equipe, place } of equipeIndices) {
        if (match.equipe[equipe][place] === -1) {
          const affectationPossible = testAffectationPossible(
            tour,
            joueurs[joueurId],
            jamaisMemeCoequipier,
            speciauxIncompatibles,
            eviterMemeAdversaire,
            nbTours,
            match.equipe[equipe],
            match.equipe[(equipe + 1) % 2],
            joueurs,
          );
          if (affectationPossible) {
            match.equipe[equipe][place] = joueurId;
            breaker = 0;
            j++;
            assigned = true;
            break;
          } else {
            breaker++;
          }
        }
      }
      joueurId = random[j];
      if (!assigned) {
        breaker++;
      }

      // Affectation du joueur complémentaire au dernier match du tour si complément QUATREVSTROIS
      const isLastMatchTour = (idMatch + 1) % nbMatchsParTour === 0;
      if (
        isLastMatchTour &&
        joueurId !== undefined &&
        complement === Complement.QUATREVSTROIS &&
        match.equipe[0][3] === -1
      ) {
        match.equipe[0][3] = joueurId;
        breaker = 0;
        j++;
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

    const startMatchId = tour * nbMatchsParTour;
    const endMatchId = startMatchId + nbMatchsParTour;

    for (let matchId = startMatchId; matchId < endMatchId; matchId++) {
      const match = matchs[matchId];
      const [equipe1, equipe2] = match.equipe;
      updatePlayerRelationships(joueurs, equipe1, equipe2);
      updatePlayerRelationships(joueurs, equipe2, equipe1);
    }

    idMatch = nbMatchsParTour * (tour + 1);
  }

  return { matchs, nbMatchs };
};

function getNbComplements(complement: Complement) {
  switch (complement) {
    case Complement.TETEATETE:
      return 4;
    case Complement.DEUXVSUN:
      return 3;
    case Complement.DOUBLETTES:
      return 2;
    case Complement.QUATREVSTROIS:
    case Complement.TROISVSDEUX:
      return 1;
  }
}

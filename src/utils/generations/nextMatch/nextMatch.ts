import { nextMatchCoupe } from './nextMatchCoupe';
import { nextMatchMultiChances } from './nextMatchMultiChances';

export const nextMatch = (match, nbMatchs, typeTournoi, nbTours) => {
  if (typeTournoi == 'coupe' && match.id + 1 < nbMatchs) {
    //Tournoi de type Coupe sauf dernier match
    return nextMatchCoupe(match, nbMatchs);
  } else if (typeTournoi == 'multi-chances' && match.manche < nbTours) {
    //Tournoi de type Multi-Chances sauf matchs du dernier tour
    return nextMatchMultiChances(match, nbMatchs, nbTours);
  } else {
    return;
  }
}
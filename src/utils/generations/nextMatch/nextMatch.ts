import { TypeTournoi } from '@/types/enums/typeTournoi';
import { nextMatchCoupe } from './nextMatchCoupe';
import { nextMatchMultiChances } from './nextMatchMultiChances';

export const nextMatch = (match, nbMatchs: number, typeTournoi: TypeTournoi, nbTours: number) => {
  if (typeTournoi == TypeTournoi.COUPE && match.id + 1 < nbMatchs) {
    //Tournoi de type Coupe sauf dernier match
    return nextMatchCoupe(match, nbMatchs);
  } else if (typeTournoi == TypeTournoi.MULTICHANCES && match.manche < nbTours) {
    //Tournoi de type Multi-Chances sauf matchs du dernier tour
    return nextMatchMultiChances(match, nbMatchs, nbTours);
  } else {
    return;
  }
}
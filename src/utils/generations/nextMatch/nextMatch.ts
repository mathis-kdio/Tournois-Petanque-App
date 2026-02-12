import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MatchModel } from '@/types/interfaces/matchModel';
import { nextMatchCoupe } from './nextMatchCoupe';
import { nextMatchMultiChances } from './nextMatchMultiChances';

export const nextMatch = (
  match: MatchModel,
  nbMatchs: number,
  typeTournoi: TypeTournoi,
  nbTours: number,
) => {
  const { matchId, manche } = match;
  if (typeTournoi === TypeTournoi.COUPE && matchId + 1 < nbMatchs) {
    //Tournoi de type Coupe sauf dernier match
    return nextMatchCoupe(match, nbMatchs);
  } else if (typeTournoi === TypeTournoi.MULTICHANCES && manche < nbTours) {
    //Tournoi de type Multi-Chances sauf matchs du dernier tour
    return nextMatchMultiChances(match, nbMatchs, nbTours);
  } else {
    return;
  }
};

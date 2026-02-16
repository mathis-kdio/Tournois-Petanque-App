import { MatchsRepository } from '@/repositories/matchs/matchsRepository';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MatchModel } from '@/types/interfaces/matchModel';
import { nextMatchCoupe } from './nextMatchCoupe';
import { nextMatchMultiChances } from './nextMatchMultiChances';

export const nextMatch = async (
  match: MatchModel,
  nbMatchs: number,
  typeTournoi: TypeTournoi,
  nbTours: number,
  tournoiId: number,
) => {
  const { matchId, manche } = match;
  if (typeTournoi === TypeTournoi.COUPE && matchId + 1 < nbMatchs) {
    //Tournoi de type Coupe sauf si dernier match
    const { equipeNumber, gagnantMatchId, nextEquipeNumber } = nextMatchCoupe(
      match,
      nbMatchs,
    );

    const matchBDD = (await MatchsRepository.get(tournoiId, match.matchId))[0];
    const equipeId = equipeNumber === 0 ? matchBDD.equipe1 : matchBDD.equipe2;

    await MatchsRepository.updateMatchNext(
      tournoiId,
      equipeId,
      gagnantMatchId,
      nextEquipeNumber,
    );
  } else if (typeTournoi === TypeTournoi.MULTICHANCES && manche < nbTours) {
    //Tournoi de type Multi-Chances sauf si matchs du dernier tour
    const {
      gagnantEquipeNumber,
      gagnantMatchId,
      perdantEquipeNumber,
      perdantMatchId,
      nextEquipeNumber,
    } = nextMatchMultiChances(match, nbMatchs, nbTours);

    const matchBDD = (await MatchsRepository.get(tournoiId, match.matchId))[0];
    const gagnantEquipeId =
      gagnantEquipeNumber === 0 ? matchBDD.equipe1 : matchBDD.equipe2;
    const perdantEquipeId =
      perdantEquipeNumber === 0 ? matchBDD.equipe1 : matchBDD.equipe2;

    await MatchsRepository.updateMatchNext(
      tournoiId,
      gagnantEquipeId,
      gagnantMatchId,
      nextEquipeNumber,
    );
    await MatchsRepository.updateMatchNext(
      tournoiId,
      perdantEquipeId,
      perdantMatchId,
      nextEquipeNumber,
    );
  } else {
    return;
  }
};

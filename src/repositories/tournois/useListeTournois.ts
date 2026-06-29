import { Tournoi } from '@/db/schema/tournoi';
import { MatchModel } from '@/types/interfaces/matchModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { TournoisRepository } from './tournoisRepository';

function toTournoiModel(tournoi: Tournoi, matchs: MatchModel[]): TournoiModel {
  return {
    tournoiId: tournoi.id,
    name: tournoi.name || undefined,
    estTournoiActuel: tournoi.estTournoiActuel,
    creationDate: new Date(tournoi.createAt),
    updateDate: new Date(tournoi.updatedAt),
    matchs: matchs,
    options: {
      tournoiID: tournoi.id,
      nbTours: tournoi.nbTours,
      nbMatchs: tournoi.nbMatchs,
      nbPtVictoire: tournoi.nbPtVictoire,
      speciauxIncompatibles: tournoi.speciauxIncompatibles,
      memesEquipes: tournoi.memesEquipes,
      memesAdversaires: tournoi.memesAdversaires,
      typeEquipes: tournoi.typeEquipes,
      typeTournoi: tournoi.typeTournoi,
      avecTerrains: tournoi.avecTerrains,
      mode: tournoi.mode,
    },
  };
}

export const useListeTournois = () => {
  const { data: allTournois } = useLiveQuery(
    TournoisRepository.getAllTournois(),
  );
  const listeTournoisVM = () => {
    if (!allTournois) {
      return [];
    }
    return allTournois.map((tournoi) => toTournoiModel(tournoi, []));
  };

  return {
    listeTournois: listeTournoisVM(),
  };
};

import { useCallback, useMemo } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { Tournoi } from '@/db/schema/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

function toTournoiModel(tournoi: Tournoi): TournoiModel {
  return {
    tournoiId: tournoi.id,
    name: tournoi.name || undefined,
    creationDate: new Date(tournoi.createAt),
    updateDate: new Date(tournoi.updatedAt),
    matchs: [],
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
      listeJoueurs: [],
      avecTerrains: tournoi.avecTerrains,
      mode: tournoi.mode,
    },
  };
}

export const useTournoisV2 = () => {
  const { data: data1 } = useLiveQuery(TournoisRepository.getTournoiV2());
  const tournoiVM = useMemo(
    () => data1?.[0] && toTournoiModel(data1[0]),
    [data1],
  );

  const { data: data2 } = useLiveQuery(TournoisRepository.getAllTournoisV2());
  console.log('data2', data2);
  const tournoisVM = useMemo(() => data2.map(toTournoiModel) ?? [], [data2]);

  const deleteTournoi = (id: number) => TournoisRepository.deleteTournoiV2(id);

  const renameTournoi = (id: number, name: string) =>
    TournoisRepository.renameTournoiV2(id, name);

  return {
    actualTournoi: tournoiVM,
    listeTournois: tournoisVM,
    deleteTournoi,
    renameTournoi,
  };
};

export function useTournois() {
  const getAllTournois = useCallback(async () => {
    const tournois = await TournoisRepository.getAllTournois();
    return tournois.map(toTournoiModel);
  }, []);

  const getTournoi = useCallback(() => TournoisRepository.getTournoi(), []);

  const getActualTournoi = useCallback(async () => {
    const tournoi = await TournoisRepository.getTournoi();
    if (!tournoi) {
      return undefined;
    }
    return toTournoiModel(tournoi);
  }, []);

  const deleteTournoi = useCallback(
    (id: number) => TournoisRepository.deleteTournoi(id),
    [],
  );

  const renameTournoi = useCallback(
    (id: number, name: string) => TournoisRepository.renameTournoi(id, name),
    [],
  );

  return {
    getAllTournois,
    getTournoi,
    getActualTournoi,
    deleteTournoi,
    renameTournoi,
  };
}

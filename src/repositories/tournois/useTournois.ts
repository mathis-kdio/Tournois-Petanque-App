import { useCallback } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { Tournoi } from '@/db/schema/tournoi';

function toTournoiModel(lJ: Tournoi): TournoiModel {
  return {
    tournoiId: lJ.id,
    name: lJ.name || undefined,
    creationDate: lJ.updatedAt,
    updateDate: lJ.updatedAt,
    tournoi: lJ.updatedAt,
  };
}

export function useTournoisRepository() {
  const getAllTournois = useCallback(
    () => TournoisRepository.getAllTournois(),
    [],
  );

  const getTournoi = useCallback(() => TournoisRepository.getTournoi(), []);

  const getActualTournoi = useCallback(async () => {
    const tournoi = await TournoisRepository.getTournoi();
    console.log(tournoi);
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

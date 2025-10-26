import { useCallback } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { Tournoi } from '@/db/schema/tournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';

function toTournoiModel(lJ: Tournoi): TournoiModel {
  return {
    tournoiId: lJ.id,
    name: lJ.name || undefined,
    creationDate: new Date(Date.now()),
    updateDate: new Date(Date.now()),
    matchs: [],
    options: {
      tournoiID: 0,
      nbTours: 0,
      nbMatchs: 0,
      nbPtVictoire: 0,
      speciauxIncompatibles: false,
      memesEquipes: false,
      memesAdversaires: 0,
      typeEquipes: TypeEquipes.TETEATETE,
      typeTournoi: TypeTournoi.MELEDEMELE,
      listeJoueurs: [],
      avecTerrains: false,
      mode: ModeTournoi.AVECNOMS,
    },
  };
}

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

import { useCallback, useMemo } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { NewTournoi, Tournoi } from '@/db/schema/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';

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

function toNewTournoi(
  preparationTournoiModel: PreparationTournoiModel,
): NewTournoi {
  const {
    nbTours,
    nbMatchs,
    nbPtVictoire,
    speciauxIncompatibles,
    memesEquipes,
    memesAdversaires,
    typeEquipes,
    typeTournoi,
    avecTerrains,
    mode,
  } = preparationTournoiModel;
  if (
    !mode ||
    (mode !== ModeTournoi.AVECEQUIPES &&
      mode !== ModeTournoi.AVECNOMS &&
      mode !== ModeTournoi.SANSNOMS) ||
    !nbTours ||
    !nbMatchs ||
    !nbPtVictoire ||
    speciauxIncompatibles === undefined ||
    memesEquipes === undefined ||
    !memesAdversaires ||
    (typeEquipes !== TypeEquipes.DOUBLETTE &&
      typeEquipes !== TypeEquipes.TETEATETE &&
      typeEquipes !== TypeEquipes.TRIPLETTE) ||
    (typeTournoi !== TypeTournoi.CHAMPIONNAT &&
      typeTournoi !== TypeTournoi.COUPE &&
      typeTournoi !== TypeTournoi.MELEDEMELE &&
      typeTournoi !== TypeTournoi.MELEE &&
      typeTournoi !== TypeTournoi.MULTICHANCES) ||
    avecTerrains === undefined
  ) {
    throw Error('aaa');
  }

  return {
    mode: mode,
    name: '',
    nbTours: nbTours,
    nbMatchs: nbMatchs,
    nbPtVictoire: nbPtVictoire,
    speciauxIncompatibles: speciauxIncompatibles,
    memesEquipes: memesEquipes,
    memesAdversaires: memesAdversaires,
    typeEquipes: typeEquipes,
    typeTournoi: typeTournoi,
    avecTerrains: avecTerrains,
    createAt: 0,
    updatedAt: 0,
  };
}

export const useTournoisV2 = () => {
  const { data: data1 } = useLiveQuery(TournoisRepository.getTournoiV2());
  const tournoiVM: TournoiModel | undefined = useMemo(
    () => (data1?.[0] && toTournoiModel(data1[0])) ?? undefined,
    [data1],
  );

  const { data: data2 } = useLiveQuery(TournoisRepository.getAllTournoisV2());
  const tournoisVM = useMemo(() => data2.map(toTournoiModel) ?? [], [data2]);

  const addTournoi = async (
    preparationTournoiModel: PreparationTournoiModel,
  ): Promise<Tournoi> => {
    return (
      await TournoisRepository.insertTournoiV2(
        toNewTournoi(preparationTournoiModel),
      )
    )[0] as Tournoi;
  };

  const deleteTournoi = (id: number) => TournoisRepository.deleteTournoiV2(id);

  const renameTournoi = async (id: number, name: string) => {
    await TournoisRepository.renameTournoiV2(id, name);
  };

  return {
    actualTournoi: tournoiVM,
    listeTournois: tournoisVM,
    addTournoi,
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

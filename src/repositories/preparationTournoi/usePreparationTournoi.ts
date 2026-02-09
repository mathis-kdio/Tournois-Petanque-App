import { useMemo } from 'react';
import { PreparationTournoisRepository } from './preparationTournoiRepository';
import {
  MemesAdversairesType,
  PreparationTournoiModel,
} from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Complement } from '@/types/enums/complement';

function toPreparationTournoiModel(
  preparationTournoi: PreparationTournoi,
): PreparationTournoiModel {
  return {
    id: preparationTournoi.id,
    nbTours: preparationTournoi.nbTours ?? undefined,
    nbPtVictoire: preparationTournoi.nbPtVictoire ?? undefined,
    speciauxIncompatibles:
      preparationTournoi.speciauxIncompatibles ?? undefined,
    memesEquipes: preparationTournoi.memesEquipes ?? undefined,
    memesAdversaires: preparationTournoi.memesAdversaires ?? undefined,
    typeEquipes: preparationTournoi.typeEquipes ?? undefined,
    complement: preparationTournoi.complement ?? undefined,
    typeTournoi: preparationTournoi.typeTournoi ?? undefined,
    avecTerrains: preparationTournoi.avecTerrains ?? undefined,
    mode: preparationTournoi.mode ?? undefined,
    modeCreationEquipes: preparationTournoi.modeCreationEquipes ?? undefined,
  };
}

export const usePreparationTournoi = () => {
  const { data: preparationTournoi } = useLiveQuery(
    PreparationTournoisRepository.getPreparationTournoi(),
  );

  const preparationTournoiVM = useMemo(() => {
    return preparationTournoi.length
      ? toPreparationTournoiModel(preparationTournoi[0])
      : undefined;
  }, [preparationTournoi]);

  const updateTypePreparationTournoi = async (typeTournoi: TypeTournoi) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      typeTournoi,
    };
    await PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  const updateModePreparationTournoi = async (
    typeEquipes: TypeEquipes,
    mode: ModeTournoi,
    modeCreationEquipes: ModeCreationEquipes,
  ) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      typeEquipes,
      mode,
      modeCreationEquipes,
    };
    await PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  const updateOptionsPreparationTournoi = async (
    nbTours: number,
    nbPtVictoire: number,
    speciauxIncompatibles: boolean,
    memesEquipes: boolean,
    memesAdversaires: MemesAdversairesType,
    avecTerrains: boolean,
  ) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      nbTours,
      nbPtVictoire,
      speciauxIncompatibles,
      memesEquipes,
      memesAdversaires,
      avecTerrains,
    };
    await PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  const updateComplementPreparationTournoi = async (complement: Complement) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      complement,
    };
    await PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  return {
    preparationTournoiVM: preparationTournoiVM,
    updateTypePreparationTournoi,
    updateModePreparationTournoi,
    updateOptionsPreparationTournoi,
    updateComplementPreparationTournoi,
  };
};

import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { Complement } from '@/types/enums/complement';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import {
  MemesAdversairesType,
  PreparationTournoiModel,
} from '@/types/interfaces/preparationTournoiModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { PreparationTournoisRepository } from './preparationTournoiRepository';

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
    avecTerrains: preparationTournoi.avecTerrains,
    mode: preparationTournoi.mode ?? undefined,
    modeCreationEquipes: preparationTournoi.modeCreationEquipes ?? undefined,
  };
}

const resetPreparationTournoi = async () => {
  await PreparationTournoisRepository.delete();
};

const resetComplementPreparationTournoi = async () => {
  const res = await PreparationTournoisRepository.getPreparationTournoi();
  if (res.length === 0) {
    throw Error('PreparationTournoi undefined');
  }
  const updated = {
    ...res.at(0),
    id: 0,
    complement: null,
  };
  await PreparationTournoisRepository.updatePreparationTournoi(updated);
};

const updateTypePreparationTournoi = async (typeTournoi: TypeTournoi) => {
  const res = await PreparationTournoisRepository.getPreparationTournoi();
  const updated = {
    ...(res.at(0) || {}),
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
  if (res.length === 0) {
    throw Error('PreparationTournoi undefined');
  }
  const updated = {
    ...res.at(0),
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
  if (res.length === 0) {
    throw Error('PreparationTournoi undefined');
  }
  const updated = {
    ...res.at(0),
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
  if (res.length === 0) {
    throw Error('PreparationTournoi undefined');
  }
  const updated = {
    ...res.at(0),
    id: 0,
    complement,
  };
  await PreparationTournoisRepository.updatePreparationTournoi(updated);
};

export const usePreparationTournoi = () => {
  const { data: preparationTournoi } = useLiveQuery(
    PreparationTournoisRepository.getPreparationTournoi(),
  );

  const preparationTournoiVM = () => {
    return preparationTournoi.length
      ? toPreparationTournoiModel(preparationTournoi[0])
      : undefined;
  };

  return {
    preparationTournoi: preparationTournoiVM(),
    resetPreparationTournoi,
    resetComplementPreparationTournoi,
    updateTypePreparationTournoi,
    updateModePreparationTournoi,
    updateOptionsPreparationTournoi,
    updateComplementPreparationTournoi,
  };
};

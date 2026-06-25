import { Complement } from '@/types/enums/complement';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoisRepository } from './preparationTournoiRepository';

export const resetPreparationTournoi = async () => {
  await PreparationTournoisRepository.delete();
};

export const resetComplementPreparationTournoi = async () => {
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

export const updateTypePreparationTournoi = async (
  typeTournoi: TypeTournoi,
) => {
  const res = await PreparationTournoisRepository.getPreparationTournoi();
  const updated = {
    ...(res.at(0) || {}),
    id: 0,
    typeTournoi,
  };
  await PreparationTournoisRepository.updatePreparationTournoi(updated);
};

export const updateModePreparationTournoi = async (
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

export const updateOptionsPreparationTournoi = async (
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

export const updateComplementPreparationTournoi = async (
  complement: Complement,
) => {
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

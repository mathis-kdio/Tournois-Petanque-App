import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
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
  };
};

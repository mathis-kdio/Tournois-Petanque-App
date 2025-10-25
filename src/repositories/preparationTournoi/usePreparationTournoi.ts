import { useCallback } from 'react';
import { PreparationTournoisRepository } from './preparationTournoiRepository';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoi } from '@/db/schema/preparationTournoi';

function toPreparationTournoiModel(
  preparationTournoi: PreparationTournoi,
): PreparationTournoiModel {
  return {
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

function toPreparationTournoi(
  preparationTournoi: PreparationTournoiModel,
): PreparationTournoi {
  return {
    id: 0,
    nbTours: preparationTournoi.nbTours ?? null,
    nbPtVictoire: preparationTournoi.nbPtVictoire ?? null,
    speciauxIncompatibles: preparationTournoi.speciauxIncompatibles ?? null,
    memesEquipes: preparationTournoi.memesEquipes ?? null,
    memesAdversaires: preparationTournoi.memesAdversaires ?? null,
    typeEquipes: preparationTournoi.typeEquipes ?? null,
    complement: preparationTournoi.complement ?? null,
    typeTournoi: preparationTournoi.typeTournoi ?? null,
    avecTerrains: preparationTournoi.avecTerrains ?? null,
    mode: preparationTournoi.mode ?? null,
    modeCreationEquipes: preparationTournoi.modeCreationEquipes ?? null,
  };
}

export function usePreparationTournoi() {
  const getActualPreparationTournoi = useCallback(async () => {
    const tournoi = await PreparationTournoisRepository.getPreparationTournoi();
    console.log(tournoi);
    return toPreparationTournoiModel(tournoi);
  }, []);

  const updatePreparationTournoi = useCallback(
    (preparationTournoiModel: PreparationTournoiModel) => {
      const preparationTournoi = toPreparationTournoi(preparationTournoiModel);
      PreparationTournoisRepository.updatePreparationTournoi(
        preparationTournoi,
      );
    },
    [],
  );

  return {
    getActualPreparationTournoi,
    updatePreparationTournoi,
  };
}

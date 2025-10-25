import { useCallback } from 'react';
import { JoueursPreparationTournoisRepository } from './joueursPreparationTournoiRepository';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { JoueursPreparationTournois } from '@/db/schema/joueursPreparationTournois';

function toJoueurModel(
  preparationTournoi: JoueursPreparationTournois,
): JoueurModel[] {
  return {
    id: preparationTournoi.joueurId;
    name: preparationTournoi.;
    type: JoueurType | undefined;
    equipe: number;
    isChecked: boolean;
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

export function useJoueursPreparationTournois() {
  const getActualJoueursPreparationTournoi = useCallback(async () => {
    const joueursPreparationTournois =
      await JoueursPreparationTournoisRepository.getPreparationTournoi();
    console.log(joueursPreparationTournois);
    return joueursPreparationTournois.map(toJoueurModel);
  }, []);

  return {
    getActualJoueursPreparationTournoi,
  };
}

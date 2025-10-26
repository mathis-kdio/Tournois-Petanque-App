import { useCallback } from 'react';
import {
  JoueursPreparationTournoisRepository,
  JoueursPreparationTournoisWithJoueur,
} from './joueursPreparationTournoiRepository';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { JoueurType } from '@/types/enums/joueurType';

function toJoueurModel(
  preparationTournoi: JoueursPreparationTournoisWithJoueur,
): JoueurModel {
  const { joueurs } = preparationTournoi;
  return {
    id: joueurs.id,
    name: joueurs.name,
    type: joueurs.type ?? undefined,
    equipe: joueurs.equipe ?? undefined,
    isChecked: false,
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
  const getActualJoueursPreparationTournoi = useCallback(
    async (preparationTournoiId: number) => {
      const joueursPreparationTournois =
        await JoueursPreparationTournoisRepository.getJoueursPreparationTournoi(
          preparationTournoiId,
        );
      console.log(joueursPreparationTournois);
      return joueursPreparationTournois.map(toJoueurModel);
    },
    [],
  );

  const addJoueursPreparationTournoi = useCallback(
    async (
      joueurName: string,
      joueurType: JoueurType | undefined,
      equipe: number,
    ) => {
      const joueursPreparationTournois =
        await JoueursPreparationTournoisRepository.getJoueursPreparationTournoi(
          preparationTournoiId,
        );
      console.log(joueursPreparationTournois);
      return joueursPreparationTournois.map(toJoueurModel);
    },
    [],
  );

  return {
    getActualJoueursPreparationTournoi,
    addJoueursPreparationTournoi,
  };
}

import { useCallback, useMemo } from 'react';
import { PreparationTournoisRepository } from './preparationTournoiRepository';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { PreparationTournoi } from '@/db/schema/preparationTournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { JoueurModel } from '@/types/interfaces/joueurModel';
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

function toJoueursModel(): JoueurModel {
  return {
    joueurTournoiId: 0,
    name: '',
    type: undefined,
    equipe: undefined,
    isChecked: false,
  };
}

export const usePreparationTournoiV2 = () => {
  const { data: preparationTournoi } = useLiveQuery(
    PreparationTournoisRepository.getPreparationTournoi(),
  );

  const preparationTournoiVM = useMemo(() => {
    return preparationTournoi.length
      ? toPreparationTournoiModel(preparationTournoi[0])
      : undefined;
  }, [preparationTournoi]);

  const { data: preparationTournoiJoueurs } = useLiveQuery(
    PreparationTournoisRepository.getPreparationTournoi(),
  );

  const preparationTournoiJoueursVM = useMemo(() => {
    return preparationTournoiJoueurs.map(toJoueursModel);
  }, [preparationTournoiJoueurs]);

  const updateTypePreparationTournoi = async (typeTournoi: TypeTournoi) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      typeTournoi,
    };
    PreparationTournoisRepository.updatePreparationTournoi(updated);
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
    PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  const updateOptionsPreparationTournoi = async (
    nbTours: number,
    nbPtVictoire: number,
    speciauxIncompatibles: boolean,
    memesEquipes: boolean,
    memesAdversaires: number,
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
    PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  const updateComplementPreparationTournoi = async (complement: Complement) => {
    const res = await PreparationTournoisRepository.getPreparationTournoi();
    const updated = {
      ...res[0],
      id: 0,
      complement,
    };
    PreparationTournoisRepository.updatePreparationTournoi(updated);
  };

  return {
    preparationTournoiVM: preparationTournoiVM,
    preparationTournoiJoueurs: preparationTournoiJoueursVM,
    updateTypePreparationTournoi,
    updateModePreparationTournoi,
    updateOptionsPreparationTournoi,
    updateComplementPreparationTournoi,
  };
};

export function usePreparationTournoi() {
  const getActualPreparationTournoi = useCallback(async () => {
    const tournoi = await PreparationTournoisRepository.getPreparationTournoi();
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

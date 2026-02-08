import { useCallback, useMemo } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { Tournoi } from '@/db/schema/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FullMatch, MatchsRepository } from '../matchs/matchsRepository';
import { MatchModel } from '@/types/interfaces/matchModel';
import {
  EquipesJoueursRepository,
  FullEquipeJoueur,
} from '../equipesJoueurs/equipesJoueursRepository';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { EquipeType } from '@/types/interfaces/equipeType';

function toTournoiModel(tournoi: Tournoi, matchs: MatchModel[]): TournoiModel {
  return {
    tournoiId: tournoi.id,
    name: tournoi.name || undefined,
    creationDate: new Date(tournoi.createAt),
    updateDate: new Date(tournoi.updatedAt),
    matchs: matchs,
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

function toMatchmodel(
  fullMatch: FullMatch,
  equipe1: EquipeType,
  equipe2: EquipeType,
): MatchModel {
  return {
    id: fullMatch.match.id,
    score1: fullMatch.match.score1 ?? undefined,
    score2: fullMatch.match.score2 ?? undefined,
    manche: fullMatch.match.tourId,
    mancheName: fullMatch.match.tourName ?? undefined,
    equipe: [equipe1, equipe2],
    terrain: fullMatch.terrains ?? undefined,
  };
}

function toJoueurModel(fullEquipeJoueur: FullEquipeJoueur): JoueurModel {
  return {
    uniqueBDDId: fullEquipeJoueur.joueurs.id,
    joueurTournoiId: fullEquipeJoueur.joueurs.joueurId,
    name: fullEquipeJoueur.joueurs.name,
    type: fullEquipeJoueur.joueurs.type ?? undefined,
    equipe: fullEquipeJoueur.joueurs.equipe ?? undefined,
    isChecked: fullEquipeJoueur.joueurs.isChecked ?? false,
  };
}

export const useTournoisV2 = () => {
  const { data: data1 } = useLiveQuery(TournoisRepository.getTournoi());

  const tournoiId = data1?.[0]?.id;
  const { data: matchs } = useLiveQuery(
    MatchsRepository.getFullMatchsTournoi(tournoiId ?? -1),
    [tournoiId],
  );

  const equipesTournoi = useMemo(() => {
    if (!matchs) {
      return [];
    }
    const allEquipes = matchs.flatMap((match) => [
      match.equipe1,
      match.equipe2,
    ]);

    const equipes = new Set();
    return allEquipes.filter((equipe) => {
      if (equipes.has(equipe.id)) {
        return false;
      } else {
        equipes.add(equipe.id);
        return true;
      }
    });
  }, [matchs]);

  const { data: equipes } = useLiveQuery(
    EquipesJoueursRepository.getEquipes(
      equipesTournoi.map((equipe) => equipe.id),
    ),
    [equipesTournoi],
  );

  const tournoiVM = useMemo(() => {
    if (!data1.length && !matchs.length && !equipes.length) {
      return;
    }

    const matchModels = matchs.map((match) => {
      const equipe1JoueurModels = equipes
        .filter((a) => a.equipes_joueurs.equipeId === match.equipe1.id)
        .map(toJoueurModel);
      const equipe1: EquipeType = [
        ...equipe1JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe1JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      const equipe2JoueurModels = equipes
        .filter((a) => a.equipes_joueurs.equipeId === match.equipe2.id)
        .map(toJoueurModel);
      const equipe2: EquipeType = [
        ...equipe2JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe2JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      return toMatchmodel(match, equipe1, equipe2);
    });
    return toTournoiModel(data1[0], matchModels);
  }, [data1, matchs, equipes]);

  const { data: allTournois } = useLiveQuery(
    TournoisRepository.getAllTournois(),
  );
  const tournoisVM = useMemo(
    () => allTournois.map((tournoi) => toTournoiModel(tournoi, [])) ?? [],
    [allTournois],
  );

  const deleteTournoi = (id: number) => TournoisRepository.deleteTournoiV2(id);

  const renameTournoi = async (id: number, name: string) => {
    await TournoisRepository.renameTournoiV2(id, name);
  };

  return {
    actualTournoi: tournoiVM,
    listeTournois: tournoisVM,
    deleteTournoi,
    renameTournoi,
  };
};

export function useTournois() {
  const deleteTournoi = useCallback(
    (id: number) => TournoisRepository.deleteTournoi(id),
    [],
  );

  const renameTournoi = useCallback(
    (id: number, name: string) => TournoisRepository.renameTournoi(id, name),
    [],
  );

  return {
    deleteTournoi,
    renameTournoi,
  };
}

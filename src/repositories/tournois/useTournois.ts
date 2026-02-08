import { useMemo } from 'react';
import { TournoisRepository } from './tournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { Tournoi } from '@/db/schema/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FullMatch, MatchsRepository } from '../matchs/matchsRepository';
import { MatchModel } from '@/types/interfaces/matchModel';
import { EquipesJoueursRepository } from '../equipesJoueurs/equipesJoueursRepository';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { EquipeType } from '@/types/interfaces/equipeType';
import { Joueur } from '@/db/schema';

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

function toJoueurModel(joueur: Joueur): JoueurModel {
  return {
    uniqueBDDId: joueur.id,
    joueurTournoiId: joueur.joueurId,
    name: joueur.name,
    type: joueur.type ?? undefined,
    equipe: joueur.equipe ?? undefined,
    isChecked: joueur.isChecked ?? false,
  };
}

export const useTournois = () => {
  const { data: data1 } = useLiveQuery(TournoisRepository.getTournoi());

  const tournoiId = data1[0] ? data1[0].id : -1;
  const { data: matchs } = useLiveQuery(
    MatchsRepository.getFullMatchsTournoi(tournoiId),
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

  const joueursTournoi = useMemo(() => {
    const joueursIds = new Set();
    return equipes
      .map(({ joueurs }) => joueurs)
      .filter(({ id }) => {
        if (joueursIds.has(id)) {
          return false;
        } else {
          joueursIds.add(id);
          return true;
        }
      })
      .map(toJoueurModel);
  }, [equipes]);

  const tournoiVM = useMemo(() => {
    if (!data1.length || !matchs.length || !equipes.length) {
      return;
    }

    const matchModels = matchs.map((match) => {
      const equipe1JoueurModels = equipes
        .filter(
          ({ equipes_joueurs }) =>
            equipes_joueurs.equipeId === match.equipe1.id,
        )
        .map(({ joueurs }) => toJoueurModel(joueurs));
      const equipe1: EquipeType = [
        ...equipe1JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe1JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      const equipe2JoueurModels = equipes
        .filter(
          ({ equipes_joueurs }) =>
            equipes_joueurs.equipeId === match.equipe2.id,
        )
        .map(({ joueurs }) => toJoueurModel(joueurs));
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

  //TODO : Ajouter autres tables à supprimer comme terrains, matchs etc
  const deleteTournoi = async (id: number) => {
    await TournoisRepository.deleteTournoi(id);
  };

  const renameTournoi = async (id: number, name: string) => {
    await TournoisRepository.renameTournoi(id, name);
  };

  return {
    actualTournoi: tournoiVM,
    joueursTournoi: joueursTournoi,
    listeTournois: tournoisVM,
    deleteTournoi,
    renameTournoi,
  };
};

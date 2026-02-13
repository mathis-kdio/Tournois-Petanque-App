import { Joueur } from '@/db/schema';
import { Tournoi } from '@/db/schema/tournoi';
import { EquipeType } from '@/types/interfaces/equipeType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { FullMatch, MatchsRepository } from '../matchs/matchsRepository';
import { TournoisRepository } from './tournoisRepository';

function toTournoiModel(tournoi: Tournoi, matchs: MatchModel[]): TournoiModel {
  return {
    tournoiId: tournoi.id,
    name: tournoi.name || undefined,
    estTournoiActuel: tournoi.estTournoiActuel,
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
    matchId: fullMatch.match.matchId,
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
  const { data: tournois } = useLiveQuery(TournoisRepository.getTournois());

  const tournoiActuel = tournois.find((tournoi) => tournoi.estTournoiActuel);
  const tournoiId = tournoiActuel ? tournoiActuel.id : -1;
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

  const { data: equipesWithJoueursTournoi } = useLiveQuery(
    JoueursRepository.getEquipes(equipesTournoi.map((equipe) => equipe.id)),
    [equipesTournoi],
  );

  const joueursTournoi = useMemo(() => {
    if (!equipesWithJoueursTournoi.length) {
      return;
    }
    const joueursIds = new Set();
    return equipesWithJoueursTournoi
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
  }, [equipesWithJoueursTournoi]);

  const actualTournoiVM = useMemo(() => {
    if (!tournoiActuel || !matchs.length || !equipesWithJoueursTournoi.length) {
      return;
    }

    const matchModels = matchs.map((match) => {
      const equipe1JoueurModels = equipesWithJoueursTournoi
        .filter(
          ({ equipes_joueurs }) =>
            equipes_joueurs.equipeId === match.equipe1.id,
        )
        .map(({ joueurs }) => toJoueurModel(joueurs));
      const equipe1: EquipeType = [
        ...equipe1JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe1JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      const equipe2JoueurModels = equipesWithJoueursTournoi
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
    return toTournoiModel(tournoiActuel, matchModels);
  }, [tournoiActuel, matchs, equipesWithJoueursTournoi]);

  const { data: allTournois } = useLiveQuery(
    TournoisRepository.getAllTournois(),
  );
  const listeTournoisVM = useMemo(() => {
    if (!allTournois) {
      return;
    }
    return allTournois.map((tournoi) => toTournoiModel(tournoi, [])) ?? [];
  }, [allTournois]);

  const setActualTournoi = async (id: number) => {
    if (actualTournoiVM) {
      await TournoisRepository.setActualTournoi(
        actualTournoiVM.tournoiId,
        false,
      );
    }
    await TournoisRepository.setActualTournoi(id, true);
  };

  //TODO : Ajouter autres tables à supprimer comme terrains, matchs etc
  const deleteTournoi = async (id: number) => {
    await TournoisRepository.deleteTournoi(id);
  };

  const renameTournoi = async (id: number, name: string) => {
    await TournoisRepository.renameTournoi(id, name);
  };

  return {
    actualTournoi: actualTournoiVM,
    joueursTournoi: joueursTournoi,
    listeTournois: listeTournoisVM,
    setActualTournoi,
    deleteTournoi,
    renameTournoi,
  };
};

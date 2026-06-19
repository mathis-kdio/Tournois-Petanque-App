import { Tournoi } from '@/db/schema/tournoi';
import { EquipeType } from '@/types/interfaces/equipeType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  Joueur_EquipesJoueurs,
  JoueursRepository,
} from '../joueurs/joueursRepository';
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

function toTerrainModel(fullMatch: FullMatch): TerrainModel | undefined {
  if (fullMatch.t_id === null || fullMatch.t_name === null) {
    return undefined;
  }
  return {
    id: fullMatch.t_id,
    name: fullMatch.t_name,
  };
}

function toMatchmodel(
  fullMatch: FullMatch,
  equipe1: EquipeType,
  equipe2: EquipeType,
): MatchModel {
  return {
    matchId: fullMatch.m_matchId,
    score1: fullMatch.m_score1 ?? undefined,
    score2: fullMatch.m_score2 ?? undefined,
    manche: fullMatch.m_tourId,
    mancheName: fullMatch.m_tourName ?? undefined,
    equipe: [equipe1, equipe2],
    terrain: toTerrainModel(fullMatch),
  };
}

function toJoueurModel(joueur: Joueur_EquipesJoueurs): JoueurModel {
  return {
    uniqueBDDId: joueur.j_id,
    joueurTournoiId: joueur.j_joueurId,
    name: joueur.j_name,
    type: joueur.j_type ?? undefined,
    equipe: joueur.j_equipe ?? undefined,
    isChecked: joueur.j_isChecked ?? false,
  };
}

const renameTournoi = async (id: number, name: string) => {
  await TournoisRepository.renameTournoi(id, name);
};

export const useTournois = () => {
  const { data: tournois = [] } = useLiveQuery(
    TournoisRepository.getTournois(),
  );

  const tournoiActuel = tournois.find((tournoi) => tournoi.estTournoiActuel);
  const tournoiId = tournoiActuel ? tournoiActuel.id : -1;
  const { data: fullMatchs } = useLiveQuery(
    MatchsRepository.getFullMatchsTournoi(tournoiId),
    [tournoiId],
  );

  const equipesTournoiId = () => {
    if (!fullMatchs) {
      return [];
    }
    const allEquipes = fullMatchs.flatMap((fullMatch) => [
      fullMatch.m_equipe1,
      fullMatch.m_equipe2,
    ]);

    const equipes = new Set();
    return allEquipes.filter((equipeId) => {
      if (equipes.has(equipeId)) {
        return false;
      } else {
        equipes.add(equipeId);
        return true;
      }
    });
  };

  const { data: equipesWithJoueursTournoi } = useLiveQuery(
    JoueursRepository.getEquipes(equipesTournoiId()),
    [equipesTournoiId],
  );

  const joueursTournoi = () => {
    if (!equipesWithJoueursTournoi || equipesWithJoueursTournoi.length === 0) {
      return;
    }
    const joueursIds = new Set();
    const result = equipesWithJoueursTournoi.reduce((acc, { joueurs: j }) => {
      if (!joueursIds.has(j.j_id)) {
        joueursIds.add(j.j_id);
        acc.push(toJoueurModel(j));
      }
      return acc;
    }, [] as JoueurModel[]);
    return result.sort((a, b) => a.joueurTournoiId - b.joueurTournoiId);
  };

  const actualTournoiVM = () => {
    if (
      !tournoiActuel ||
      !fullMatchs ||
      !fullMatchs.length ||
      !equipesWithJoueursTournoi ||
      !equipesWithJoueursTournoi.length
    ) {
      return;
    }

    const matchModels = fullMatchs.map((fullMatch) => {
      const equipe1JoueurModels = equipesWithJoueursTournoi.reduce(
        (acc, { equipes_joueurs, joueurs }) => {
          if (equipes_joueurs.ej_equipeId === fullMatch.m_equipe1) {
            acc.push(toJoueurModel(joueurs));
          }
          return acc;
        },
        [] as JoueurModel[],
      );
      const equipe1: EquipeType = [
        ...equipe1JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe1JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      const equipe2JoueurModels = equipesWithJoueursTournoi.reduce(
        (acc, { equipes_joueurs, joueurs }) => {
          if (equipes_joueurs.ej_equipeId === fullMatch.m_equipe2) {
            acc.push(toJoueurModel(joueurs));
          }
          return acc;
        },
        [] as JoueurModel[],
      );
      const equipe2: EquipeType = [
        ...equipe2JoueurModels.slice(0, 4),
        ...Array(Math.max(0, 4 - equipe2JoueurModels.length)).fill(undefined),
      ] as EquipeType;

      return toMatchmodel(fullMatch, equipe1, equipe2);
    });
    return toTournoiModel(tournoiActuel, matchModels);
  };

  const { data: allTournois } = useLiveQuery(
    TournoisRepository.getAllTournois(),
  );
  const listeTournoisVM = () => {
    if (!allTournois) {
      return;
    }
    return allTournois.map((tournoi) => toTournoiModel(tournoi, [])) ?? [];
  };

  const setActualTournoi = async (id: number) => {
    const actualTournoi = actualTournoiVM();
    if (actualTournoi) {
      await TournoisRepository.setActualTournoi(actualTournoi.tournoiId, false);
    }
    await TournoisRepository.setActualTournoi(id, true);
  };

  return {
    actualTournoi: actualTournoiVM(),
    joueursTournoi: joueursTournoi,
    listeTournois: listeTournoisVM,
    setActualTournoi,
    renameTournoi,
  };
};

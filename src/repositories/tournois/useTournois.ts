import { Tournoi } from '@/db/schema/tournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  Joueur_EquipesJoueurs,
  JoueursRepository,
} from '../joueurs/joueursRepository';
import { MatchsRepository } from '../matchs/matchsRepository';
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

  const joueursTournoiVM = () => {
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

  const { data: allTournois } = useLiveQuery(
    TournoisRepository.getAllTournois(),
  );
  const listeTournoisVM = () => {
    if (!allTournois) {
      return;
    }
    return allTournois.map((tournoi) => toTournoiModel(tournoi, [])) ?? [];
  };

  return {
    joueursTournoi: joueursTournoiVM(),
    listeTournois: listeTournoisVM(),
  };
};

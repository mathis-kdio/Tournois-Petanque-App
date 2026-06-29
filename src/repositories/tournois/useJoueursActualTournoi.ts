import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  Joueur_EquipesJoueurs,
  JoueursRepository,
} from '../joueurs/joueursRepository';
import { MatchsRepository } from '../matchs/matchsRepository';
import { TournoisRepository } from './tournoisRepository';

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

export const useJoueursActualTournoi = () => {
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

  const joueursActualTournoiVM = () => {
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

  return {
    joueursActualTournoi: joueursActualTournoiVM(),
  };
};

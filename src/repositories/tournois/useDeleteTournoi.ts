import { EquipeRepository } from '../equipe/equipeRepository';
import { EquipesJoueursRepository } from '../equipesJoueurs/equipesJoueursRepository';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { MatchsRepository } from '../matchs/matchsRepository';
import { TerrainsRepository } from '../terrains/terrainsRepository';
import { TournoisRepository } from './tournoisRepository';

export const useDeleteTournoi = () => {
  const deleteTournoi = async (tournoiId: number) => {
    const matchsId = new Set<number>();
    const joueursIds = new Set<number>();
    const equipesIds = new Set<number>();
    const equipesJoueursIds = new Set<number>();
    const terrainsIds = new Set<number>();

    const matchs = await MatchsRepository.getFullMatchsTournoi(tournoiId);
    matchs.map((match) => {
      matchsId.add(match.m_id);
      equipesIds.add(match.e1_id);
      equipesIds.add(match.e2_id);
      if (match.t_id) {
        terrainsIds.add(match.t_id);
      }
    });

    const equipes = await JoueursRepository.getEquipes(Array.from(equipesIds));
    equipes.map((equipe) => {
      equipesJoueursIds.add(equipe.equipes_joueurs.ej_id);
      joueursIds.add(equipe.joueurs.j_id);
    });

    await MatchsRepository.delete(Array.from(matchsId));

    await TournoisRepository.deleteTournoi(tournoiId);

    await EquipesJoueursRepository.delete(Array.from(equipesJoueursIds));

    await EquipeRepository.delete(Array.from(equipesIds));

    await JoueursRepository.delete(Array.from(joueursIds));

    await TerrainsRepository.delete(Array.from(terrainsIds));
  };

  return {
    deleteTournoi,
  };
};

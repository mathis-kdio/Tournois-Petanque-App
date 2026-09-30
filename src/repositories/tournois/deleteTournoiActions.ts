import { EquipeRepository } from '../equipe/equipeRepository';
import { EquipesJoueursRepository } from '../equipesJoueurs/equipesJoueursRepository';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { MatchsRepository } from '../matchs/matchsRepository';
import { TerrainsRepository } from '../terrains/terrainsRepository';
import { TournoisRepository } from './tournoisRepository';

export const deleteTournoi = async (tournoiId: string) => {
  const matchsId = new Set<string>();
  const joueursIds = new Set<string>();
  const equipesIds = new Set<string>();
  const equipesJoueursIds = new Set<string>();
  const terrainsIds = new Set<string>();

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

import { EquipeRepository } from '@/repositories/equipe/equipeRepository';
import { EquipesJoueursRepository } from '@/repositories/equipesJoueurs/equipesJoueursRepository';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
import { JoueursPreparationTournoisRepository } from '@/repositories/joueursPreparationTournois/joueursPreparationTournoiRepository';
import { JoueursSuggestionRepository } from '@/repositories/joueursSuggestion/joueursSuggestionRepository';
import { ListesJoueursRepository } from '@/repositories/listesJoueurs/listesJoueursRepository';
import { MatchsRepository } from '@/repositories/matchs/matchsRepository';
import { PreparationTournoisRepository } from '@/repositories/preparationTournoi/preparationTournoiRepository';
import { TerrainsRepository } from '@/repositories/terrains/terrainsRepository';
import { TerrainsPreparationTournoisRepository } from '@/repositories/terrainsPreparationTournois/terrainsPreparationTournoiRepository';
import { TournoisRepository } from '@/repositories/tournois/tournoisRepository';

export const clearData = async () => {
  await JoueursSuggestionRepository.softDeleteAll();
  await JoueursListesRepository.softDeleteAll();
  await ListesJoueursRepository.softDeleteAll();
  await PreparationTournoisRepository.deleteAll();
  await JoueursPreparationTournoisRepository.deleteAll();
  await TerrainsPreparationTournoisRepository.deleteAll();
  await MatchsRepository.softDeleteAll();
  await TerrainsRepository.softDeleteAll();
  await TournoisRepository.softDeleteAll();
  await EquipesJoueursRepository.softDeleteAll();
  await EquipeRepository.softDeleteAll();
  await JoueursRepository.softDeleteAll();
};

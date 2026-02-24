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

export const useClearData = () => {
  const clearData = async () => {
    await JoueursSuggestionRepository.deleteAll();
    await JoueursListesRepository.deleteAll();
    await ListesJoueursRepository.deleteAll();
    await PreparationTournoisRepository.deleteAll();
    await JoueursPreparationTournoisRepository.deleteAll();
    await TerrainsPreparationTournoisRepository.deleteAll();
    await MatchsRepository.deleteAll();
    await TerrainsRepository.deleteAll();
    await TournoisRepository.deleteAll();
    await EquipesJoueursRepository.deleteAll();
    await EquipeRepository.deleteAll();
    await JoueursRepository.deleteAll();
  };

  return {
    clearData,
  };
};

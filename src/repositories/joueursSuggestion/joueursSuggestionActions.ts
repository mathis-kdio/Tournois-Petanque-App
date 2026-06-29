import { JoueursSuggestionRepository } from './joueursSuggestionRepository';

export const cacherSuggestion = async (suggestionId: number) => {
  await JoueursSuggestionRepository.cacherSuggestion(suggestionId);
};

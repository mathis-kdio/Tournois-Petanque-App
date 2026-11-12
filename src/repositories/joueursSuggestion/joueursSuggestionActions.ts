import { JoueursSuggestionRepository } from './joueursSuggestionRepository';

export const cacherSuggestion = async (suggestionId: string) => {
  await JoueursSuggestionRepository.cacherSuggestion(suggestionId);
};

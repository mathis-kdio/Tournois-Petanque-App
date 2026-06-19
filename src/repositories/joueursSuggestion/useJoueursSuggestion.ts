import { JoueursSuggestion } from '@/db/schema';
import { JoueurSuggestionModel } from '@/types/interfaces/joueurSuggestionModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { JoueursSuggestionRepository } from './joueursSuggestionRepository';

const toJoueurSuggestionModel = (
  joueursSuggestion: JoueursSuggestion,
): JoueurSuggestionModel => {
  return {
    id: joueursSuggestion.id,
    name: joueursSuggestion.name,
  };
};

const cacherSuggestion = async (suggestionId: number) => {
  await JoueursSuggestionRepository.cacherSuggestion(suggestionId);
};

export const useJoueursSuggestion = () => {
  const { data: joueurs } = useLiveQuery(JoueursSuggestionRepository.get());

  const joueursSuggestionVM = useMemo(
    () => joueurs.map(toJoueurSuggestionModel) ?? [],
    [joueurs],
  );

  return {
    joueursSuggestion: joueursSuggestionVM,
    cacherSuggestion,
  };
};

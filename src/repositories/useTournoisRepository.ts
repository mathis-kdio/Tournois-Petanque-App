import { useCallback } from 'react';
import { TournoisRepository } from './tournoisRepository';

export function useTournoisRepository() {
  const getAllTournois = useCallback(
    () => TournoisRepository.getAllTournois(),
    [],
  );

  const deleteTournoi = useCallback(
    (id: number) => TournoisRepository.deleteTournoi(id),
    [],
  );

  const renameTournoi = useCallback(
    (id: number, name: string) => TournoisRepository.renameTournoi(id, name),
    [],
  );

  return { getAllTournois, deleteTournoi, renameTournoi };
}

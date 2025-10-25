import { useCallback } from 'react';
import { ListesJoueursRepository } from './listesJoueursRepository';

export function useListesJoueursRepository() {
  const getAllListesJoueurs = useCallback(
    () => ListesJoueursRepository.getAllListesJoueurs(),
    [],
  );

  const deleteListeJoueurs = useCallback(
    (id: number) => ListesJoueursRepository.deleteListeJoueurs(id),
    [],
  );

  const renameListeJoueurs = useCallback(
    (id: number, name: string) =>
      ListesJoueursRepository.renameListeJoueurs(id, name),
    [],
  );

  return { getAllListesJoueurs, deleteListeJoueurs, renameListeJoueurs };
}

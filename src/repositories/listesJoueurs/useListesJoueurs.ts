import { useMemo } from 'react';
import { ListesJoueursRepository } from './listesJoueursRepository';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { ListesJoueurs, NewListesJoueurs } from '@/db/schema';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';

function toListeJoueursInfos(lJ: ListesJoueurs): ListeJoueursInfos {
  return {
    listId: lJ.id,
    name: lJ.name,
  };
}

export const useListesJoueurs = () => {
  const { data: listesJoueurs } = useLiveQuery(
    ListesJoueursRepository.getAllListesJoueurs(),
  );

  const allListesJoueursVM = useMemo(() => {
    if (!listesJoueurs.length) {
      return;
    }
    return listesJoueurs.map(toListeJoueursInfos);
  }, [listesJoueurs]);

  const insertListeJoueurs = async (newListesJoueurs: NewListesJoueurs) => {
    await ListesJoueursRepository.insertListeJoueurs(newListesJoueurs);
  };

  const deleteListeJoueurs = async (id: number) => {
    await ListesJoueursRepository.deleteListeJoueurs(id);
  };

  const renameListeJoueurs = async (id: number, name: string) => {
    await ListesJoueursRepository.renameListeJoueurs(id, name);
  };

  return {
    allListesJoueurs: allListesJoueursVM,
    insertListeJoueurs,
    deleteListeJoueurs,
    renameListeJoueurs,
  };
};

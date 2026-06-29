import { ListesJoueurs } from '@/db/schema';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { ListesJoueursRepository } from './listesJoueursRepository';

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

  const allListesJoueursVM = () => {
    if (!listesJoueurs.length) {
      return [];
    }
    return listesJoueurs.map(toListeJoueursInfos);
  };

  return {
    allListesJoueurs: allListesJoueursVM(),
  };
};

import { ListesJoueurs, NewListesJoueurs } from '@/db/schema';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursListesRepository } from '../joueursListes/joueursListesRepository';
import { ListesJoueursRepository } from './listesJoueursRepository';

function toListeJoueursInfos(lJ: ListesJoueurs): ListeJoueursInfos {
  return {
    listId: lJ.id,
    name: lJ.name,
  };
}

const insertListeJoueurs = async () => {
  const newListesJoueurs: NewListesJoueurs = {
    updatedAt: Date.now(),
  };

  return (
    await ListesJoueursRepository.insertListeJoueurs(newListesJoueurs)
  )[0];
};

const deleteListeJoueurs = async (id: number) => {
  const joueursListes = await JoueursListesRepository.getInList(id);
  await JoueursListesRepository.removeAllInList(id);
  await ListesJoueursRepository.deleteListeJoueurs(id);
  await JoueursRepository.delete(
    joueursListes.map((joueursListe) => joueursListe.joueurId),
  );
};

const renameListeJoueurs = async (id: number, name: string) => {
  await ListesJoueursRepository.renameListeJoueurs(id, name);
};

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
    insertListeJoueurs,
    deleteListeJoueurs,
    renameListeJoueurs,
  };
};

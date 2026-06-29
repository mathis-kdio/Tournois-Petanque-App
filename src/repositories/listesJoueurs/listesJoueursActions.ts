import { NewListesJoueurs } from '@/db/schema';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursListesRepository } from '../joueursListes/joueursListesRepository';
import { ListesJoueursRepository } from './listesJoueursRepository';

export const insertListeJoueurs = async () => {
  const newListesJoueurs: NewListesJoueurs = {
    updatedAt: Date.now(),
  };

  return (
    await ListesJoueursRepository.insertListeJoueurs(newListesJoueurs)
  )[0];
};

export const deleteListeJoueurs = async (id: number) => {
  const joueursListes = await JoueursListesRepository.getInList(id);
  await JoueursListesRepository.removeAllInList(id);
  await ListesJoueursRepository.deleteListeJoueurs(id);
  await JoueursRepository.delete(
    joueursListes.map((joueursListe) => joueursListe.joueurId),
  );
};

export const renameListeJoueurs = async (id: number, name: string) => {
  await ListesJoueursRepository.renameListeJoueurs(id, name);
};

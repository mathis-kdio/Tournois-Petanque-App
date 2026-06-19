import { Joueur, NewJoueur, NewJoueursListes } from '@/db/schema';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
import { JoueursSuggestionRepository } from '@/repositories/joueursSuggestion/joueursSuggestionRepository';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

function toJoueurModel(joueur: Joueur): JoueurModel {
  return {
    uniqueBDDId: joueur.id,
    joueurTournoiId: joueur.joueurId,
    name: joueur.name,
    type: joueur.type ?? undefined,
    equipe: joueur.equipe ?? undefined,
    isChecked: joueur.isChecked ?? false,
  };
}

function toNewJoueursListes(joueur: Joueur, listeId: number): NewJoueursListes {
  return {
    joueurId: joueur.id,
    listeId: listeId,
  };
}

const addJoueurInList = async (
  joueurName: string,
  joueurType: JoueurType | undefined,
  listeId: number,
) => {
  const joueursListe = await JoueursListesRepository.getInList(listeId);

  const newJoueur: NewJoueur = {
    joueurId: joueursListe.length,
    name: joueurName,
    type: joueurType,
    equipe: undefined,
    isChecked: false,
  };
  const joueur = await JoueursRepository.insert(newJoueur);
  await JoueursListesRepository.insert(toNewJoueursListes(joueur, listeId));

  await JoueursSuggestionRepository.insertOrUpdateOccurence({
    name: joueurName,
    occurence: 1,
  });
};

export const useCreateListeJoueur = (listeId: number) => {
  const { data: joueursListe } = useLiveQuery(
    JoueursRepository.getJoueursListe(listeId),
  );

  const listeJoueursVM = () => {
    if (!joueursListe.length) {
      return [];
    }
    return joueursListe.map((joueur) => toJoueurModel(joueur));
  };

  const removeAllJoueursList = async (listId: number) => {
    const joueursListes = await JoueursListesRepository.getInList(listeId);
    await JoueursListesRepository.removeAllInList(listId);
    await JoueursRepository.delete(
      joueursListes.map((joueursListe) => joueursListe.joueurId),
    );
  };

  const removeJoueurList = async (joueurUniqueBDDId: number) => {
    await JoueursListesRepository.removeJoueurId(joueurUniqueBDDId);
    await JoueursRepository.delete([joueurUniqueBDDId]);

    //Update JoueurId des autres joueurs de la liste
    const joueurs = await JoueursRepository.getJoueursListe(listeId);
    await Promise.all(
      joueurs.map(
        async (joueur, index) =>
          await JoueursRepository.updateJoueurId(joueur.id, index),
      ),
    );
  };

  return {
    listeJoueurs: listeJoueursVM(),
    removeAllJoueursList,
    removeJoueurList,
    addJoueurInList,
  };
};

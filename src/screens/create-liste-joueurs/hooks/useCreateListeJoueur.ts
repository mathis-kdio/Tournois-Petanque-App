import { Joueur, NewJoueur, NewJoueursListes } from '@/db/schema';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
import { JoueursSuggestionRepository } from '@/repositories/joueursSuggestion/joueursSuggestionRepository';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';

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

export const useCreateListeJoueur = (listeId: number) => {
  const { data: joueursJoueursListes } = useLiveQuery(
    JoueursRepository.getJoueursListe(listeId),
  );

  const listeJoueursVM = useMemo(() => {
    if (!joueursJoueursListes.length) {
      return [];
    }
    return joueursJoueursListes.map((jjl) => toJoueurModel(jjl.joueurs));
  }, [joueursJoueursListes]);

  const removeAllJoueursList = async (listId: number) => {
    const joueursListes = await JoueursListesRepository.getInList(listeId);
    console.log(listId);
    await JoueursListesRepository.removeAllInList(listId);
    await JoueursRepository.delete(
      joueursListes.map((joueursListe) => joueursListe.joueurId),
    );
  };

  const removeJoueurList = async (joueurUniqueBDDId: number) => {
    await JoueursListesRepository.removeJoueurId(joueurUniqueBDDId);
    await JoueursRepository.delete([joueurUniqueBDDId]);
  };

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

  return {
    listeJoueurs: listeJoueursVM,
    removeAllJoueursList,
    removeJoueurList,
    addJoueurInList,
  };
};

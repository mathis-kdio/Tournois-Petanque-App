import { Joueur, NewJoueur, NewJoueursPreparationTournois } from '@/db/schema';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursSuggestionRepository } from '../joueursSuggestion/joueursSuggestionRepository';
import {
  JoueursPreparationTournoisRepository,
  JoueursPreparationTournoisWithJoueur,
} from './joueursPreparationTournoiRepository';

function toJoueurModel(
  preparationTournoi: JoueursPreparationTournoisWithJoueur,
): JoueurModel {
  const { joueurs } = preparationTournoi;
  return {
    uniqueBDDId: joueurs.id,
    joueurTournoiId: joueurs.joueurId,
    name: joueurs.name,
    type: joueurs.type ?? undefined,
    equipe: joueurs.equipe ?? undefined,
    isChecked: joueurs.isChecked ?? false,
  };
}

function toNewJoueur(
  joueurTournoiId: number,
  joueurName: string,
  joueurType: JoueurType | undefined,
  equipe: number,
): NewJoueur {
  return {
    joueurId: joueurTournoiId,
    name: joueurName,
    type: joueurType,
    equipe: equipe,
    isChecked: false,
  };
}

export function toNewJoueursPreparationTournois(
  joueur: Joueur,
  preparationTournoiId: number,
): NewJoueursPreparationTournois {
  return {
    joueurId: joueur.id,
    preparationTournoiId: preparationTournoiId,
  };
}

export const useJoueursPreparationTournois = () => {
  const { data } = useLiveQuery(JoueursPreparationTournoisRepository.getMany());

  const actualJoueursPreparationTournoiVM = useMemo(
    () => data.map(toJoueurModel) ?? [],
    [data],
  );

  const addJoueursPreparationTournoi = async (
    joueurTournoiId: number,
    joueurName: string,
    joueurType: JoueurType | undefined,
    equipe: number,
  ) => {
    const res = await JoueursRepository.insert(
      toNewJoueur(joueurTournoiId, joueurName, joueurType, equipe),
    );
    await JoueursPreparationTournoisRepository.insert([
      toNewJoueursPreparationTournois(res, 0),
    ]);

    await JoueursSuggestionRepository.insertOrUpdateOccurence({
      name: joueurName,
      occurence: 1,
    });
  };

  const addJoueursPreparationTournoiFromList = async (listeId: number) => {
    const joueursInscrits =
      await JoueursPreparationTournoisRepository.getMany();
    let nbJoueursInscrits = joueursInscrits.length;

    const joueursListe = await JoueursRepository.getJoueursListe(listeId);
    const newJoueurs = joueursListe
      .map((a) => a.joueurs)
      .map((joueur) =>
        toNewJoueur(
          nbJoueursInscrits++,
          joueur.name,
          joueur.type ?? undefined,
          0,
        ),
      );
    const joueurs = await JoueursRepository.insertMultiples(newJoueurs);

    const newJoueursPreparationTournois = joueurs.map((joueur) =>
      toNewJoueursPreparationTournois(joueur, 0),
    );
    await JoueursPreparationTournoisRepository.insert(
      newJoueursPreparationTournois,
    );
  };

  const removeJoueursPreparationTournoi = async (joueurId: number) => {
    const joueur = await JoueursRepository.select(joueurId);
    await JoueursPreparationTournoisRepository.delete([joueur.id]);
    await JoueursRepository.delete([joueur.id]);
  };

  const removeAllJoueursPreparationTournoi = async () => {
    const joueur = await JoueursPreparationTournoisRepository.getMany();
    await JoueursPreparationTournoisRepository.deleteAll();
    await JoueursRepository.delete(joueur.map((e) => e.joueurs.id));
  };

  return {
    joueurs: actualJoueursPreparationTournoiVM,
    addJoueursPreparationTournoi,
    addJoueursPreparationTournoiFromList,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  };
};

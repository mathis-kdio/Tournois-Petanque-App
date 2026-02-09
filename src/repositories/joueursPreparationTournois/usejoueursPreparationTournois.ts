import { useMemo } from 'react';
import {
  JoueursPreparationTournoisRepository,
  JoueursPreparationTournoisWithJoueur,
} from './joueursPreparationTournoiRepository';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Joueur, NewJoueur, NewJoueursPreparationTournois } from '@/db/schema';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

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

function toNewJoueur(joueurModel: JoueurModel): NewJoueur {
  return {
    joueurId: joueurModel.joueurTournoiId,
    name: joueurModel.name,
    type: joueurModel.type,
    equipe: joueurModel.equipe,
    isChecked: joueurModel.isChecked,
  };
}

function toNewJoueursPreparationTournois(
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

  const addJoueursPreparationTournoi = async (joueurModel: JoueurModel) => {
    const res = await JoueursRepository.insert(toNewJoueur(joueurModel));
    await JoueursPreparationTournoisRepository.insert(
      toNewJoueursPreparationTournois(res, 0),
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
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  };
};

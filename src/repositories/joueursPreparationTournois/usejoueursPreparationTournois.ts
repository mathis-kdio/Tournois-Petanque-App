import { useCallback } from 'react';
import {
  JoueursPreparationTournoisRepository,
  JoueursPreparationTournoisWithJoueur,
} from './joueursPreparationTournoiRepository';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Joueur, NewJoueursPreparationTournois } from '@/db/schema';
import { JoueursRepository } from '../joueurs/joueursRepository';

function toJoueurModel(
  preparationTournoi: JoueursPreparationTournoisWithJoueur,
): JoueurModel {
  const { joueurs } = preparationTournoi;
  return {
    id: joueurs.id,
    name: joueurs.name,
    type: joueurs.type ?? undefined,
    equipe: joueurs.equipe ?? undefined,
    isChecked: false,
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

export function useJoueursPreparationTournois() {
  const getActualJoueursPreparationTournoi = useCallback(
    async (preparationTournoiId: number) => {
      const joueursPreparationTournois =
        await JoueursPreparationTournoisRepository.getJoueursPreparationTournoi(
          preparationTournoiId,
        );
      console.log(joueursPreparationTournois);
      return joueursPreparationTournois.map(toJoueurModel);
    },
    [],
  );

  const addJoueursPreparationTournoi = useCallback(
    async (joueurModel: JoueurModel) => {
      const joueur = await JoueursRepository.insert(
        JoueursRepository.toNewJoueur(joueurModel),
      );

      await JoueursPreparationTournoisRepository.insert(
        toNewJoueursPreparationTournois(joueur, 0),
      );
      return JoueursRepository.toJoueurModel(joueur);
    },
    [],
  );

  return {
    getActualJoueursPreparationTournoi,
    addJoueursPreparationTournoi,
  };
}

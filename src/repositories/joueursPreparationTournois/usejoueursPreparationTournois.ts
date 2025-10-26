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
        await JoueursPreparationTournoisRepository.getMany(
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

  const removeAllJoueursPreparationTournoi = useCallback(async () => {
    const joueursPreparationTournois =
      await JoueursPreparationTournoisRepository.getMany(0);
    JoueursRepository.delete(
      joueursPreparationTournois.map((e) => e.joueurs.id),
    );
    JoueursPreparationTournoisRepository.deleteAll();
  }, []);

  return {
    getActualJoueursPreparationTournoi,
    addJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  };
}

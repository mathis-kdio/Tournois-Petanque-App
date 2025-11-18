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
    id: joueurs.joueurId,
    name: joueurs.name,
    type: joueurs.type ?? undefined,
    equipe: joueurs.equipe ?? undefined,
    isChecked: joueurs.isChecked ?? false,
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

  const removeJoueursPreparationTournoi = useCallback(
    async (joueurId: number) => {
      const joueur = await JoueursRepository.select(joueurId);

      await JoueursPreparationTournoisRepository.delete([joueur.id]);
      await JoueursRepository.delete([joueur.id]);
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

  const getAllJoueursPreparationTournoi = useCallback(async () => {
    const joueursPreparationTournois =
      await JoueursPreparationTournoisRepository.getMany(0);
    const joueurModel = joueursPreparationTournois.map(
      (joueursPreparationTournoisWithJoueur) =>
        toJoueurModel(joueursPreparationTournoisWithJoueur),
    );
    return joueurModel;
  }, []);

  return {
    getActualJoueursPreparationTournoi,
    addJoueursPreparationTournoi,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
    getAllJoueursPreparationTournoi,
  };
}

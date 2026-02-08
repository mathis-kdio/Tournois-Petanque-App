import { useCallback } from 'react';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Joueur } from '@/db/schema';
import { JoueursRepository } from './joueursRepository';

function toJoueurModel(joueur: Joueur): JoueurModel {
  return {
    joueurTournoiId: joueur.joueurId,
    name: joueur.name,
    type: joueur.type ?? undefined,
    equipe: joueur.equipe ?? undefined,
    isChecked: joueur.isChecked ?? false,
  };
}

export const useJoueursV2 = () => {
  const checkJoueur = async (id: number, isChecked: boolean) => {
    const joueur = await JoueursRepository.select(id);
    JoueursRepository.updateCheckV2(joueur.id, isChecked);
  };

  const renameJoueur = async (id: number, name: string) => {
    const joueur = await JoueursRepository.select(id);
    JoueursRepository.updateNameV2(joueur.id, name);
  };

  return {
    checkJoueur,
    renameJoueur,
  };
};

export function useJoueurs() {
  const getAllJoueurs = useCallback(async () => {
    const joueurs = await JoueursRepository.selectAll();
    return joueurs.map(toJoueurModel);
  }, []);

  const renameJoueur = useCallback(
    async (joueurModel: JoueurModel, newName: string) => {
      const joueur = await JoueursRepository.select(joueurModel.joueurTournoiId);
      await JoueursRepository.updateName(joueur.id, newName);
    },
    [],
  );

  const checkJoueur = useCallback(
    async (joueurModel: JoueurModel, isChecked: boolean) => {
      const joueur = await JoueursRepository.select(joueurModel.joueurTournoiId);
      await JoueursRepository.updateCheck(joueur.id, isChecked);
    },
    [],
  );

  return {
    getAllJoueurs,
    renameJoueur,
    checkJoueur,
  };
}

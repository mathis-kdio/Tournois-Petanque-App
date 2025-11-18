import { useCallback } from 'react';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Joueur } from '@/db/schema';
import { JoueursRepository } from './joueursRepository';

function toJoueurModel(joueur: Joueur): JoueurModel {
  return {
    id: joueur.joueurId,
    name: joueur.name,
    type: joueur.type ?? undefined,
    equipe: joueur.equipe ?? undefined,
    isChecked: joueur.isChecked ?? false,
  };
}

export function useJoueurs() {
  const renameJoueur = useCallback(
    async (joueurModel: JoueurModel, newName: string) => {
      const joueur = await JoueursRepository.select(joueurModel.id);
      await JoueursRepository.updateName(joueur.id, newName);
    },
    [],
  );

  return {
    renameJoueur,
  };
}

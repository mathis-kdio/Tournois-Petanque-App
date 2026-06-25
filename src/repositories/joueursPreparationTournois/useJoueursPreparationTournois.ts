import { Joueur, NewJoueursPreparationTournois } from '@/db/schema';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursPreparationTournoisRepository } from './joueursPreparationTournoiRepository';

function toJoueurModel(joueurs: Joueur): JoueurModel {
  return {
    uniqueBDDId: joueurs.id,
    joueurTournoiId: joueurs.joueurId,
    name: joueurs.name,
    type: joueurs.type ?? undefined,
    equipe: joueurs.equipe ?? undefined,
    isChecked: joueurs.isChecked ?? false,
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
  const { data: joueurs = [] } = useLiveQuery(JoueursRepository.getAll());

  const { data: joueursPreparation = [] } = useLiveQuery(
    JoueursPreparationTournoisRepository.getAll(),
  );

  const actualJoueursPreparationTournoiVM = () => {
    if (!joueurs.length || !joueursPreparation.length) {
      return [];
    }
    const idsEnPreparation = new Set(joueursPreparation.map((l) => l.joueurId));
    return joueurs.reduce((acc, t) => {
      if (idsEnPreparation.has(t.id)) {
        acc.push(toJoueurModel(t));
      }
      return acc;
    }, [] as JoueurModel[]);
  };

  return {
    joueurs: actualJoueursPreparationTournoiVM(),
  };
};

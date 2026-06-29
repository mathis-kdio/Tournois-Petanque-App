import { Joueur } from '@/db/schema';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
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

export const useListeJoueurListeId = (listeId: number) => {
  const { data: joueursListe } = useLiveQuery(
    JoueursRepository.getJoueursListe(listeId),
  );

  const listeJoueurListeIdVM = () => {
    if (!joueursListe.length) {
      return [];
    }
    return joueursListe.map((joueur) => toJoueurModel(joueur));
  };

  return {
    listeJoueurListeId: listeJoueurListeIdVM(),
  };
};

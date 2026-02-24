import { NewJoueur } from '@/db/schema';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursPreparationTournoisRepository } from '@/repositories/joueursPreparationTournois/joueursPreparationTournoiRepository';
import { toNewJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { JoueurType } from '@/types/enums/joueurType';

export const useInscriptionSansNom = () => {
  const addJoueurs = async (
    nbJoueurNormaux: number,
    nbJoueurEnfants: number,
  ) => {
    const joueurs: NewJoueur[] = [
      ...Array.from({ length: nbJoueurNormaux }, (_, i) => ({
        joueurId: i,
        name: '',
      })),
      ...Array.from({ length: nbJoueurEnfants }, (_, i) => ({
        joueurId: nbJoueurNormaux + i,
        name: '',
        type: JoueurType.ENFANT,
      })),
    ];

    const joueursBDD = await JoueursRepository.insertMultiples(joueurs);

    const joueursPreparationTournois = joueursBDD.map((joueur) =>
      toNewJoueursPreparationTournois(joueur, 0),
    );

    await JoueursPreparationTournoisRepository.insert(
      joueursPreparationTournois,
    );
  };

  const clearJoueursAutresInscriptions = async () => {
    const joueurs = await JoueursPreparationTournoisRepository.getMany();
    await JoueursPreparationTournoisRepository.deleteAll();
    await JoueursRepository.delete(joueurs.map(({ joueurs }) => joueurs.id));
  };

  return {
    addJoueurs,
    clearJoueursAutresInscriptions,
  };
};

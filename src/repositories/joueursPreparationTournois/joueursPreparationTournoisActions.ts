import { Joueur, NewJoueur } from '@/db/schema';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursSuggestionRepository } from '../joueursSuggestion/joueursSuggestionRepository';
import { JoueursPreparationTournoisRepository } from './joueursPreparationTournoiRepository';
import { toNewJoueursPreparationTournois } from './useJoueursPreparationTournois';

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

export const getAllJoueursPreparationTournoi = async () => {
  const joueurs = await JoueursPreparationTournoisRepository.getMany();
  return joueurs.map(toJoueurModel);
};

export const addJoueursPreparationTournoi = async (
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

export const addJoueursPreparationTournoiFromList = async (listeId: number) => {
  const joueursInscrits: Joueur[] =
    await JoueursPreparationTournoisRepository.getMany();
  let nbJoueursInscrits = joueursInscrits.length;

  const joueursListe = await JoueursRepository.getJoueursListe(listeId);
  const newJoueurs = joueursListe.map((joueur, index) =>
    toNewJoueur(
      nbJoueursInscrits + index,
      joueur.name,
      joueur.type ?? undefined,
      0,
    ),
  );

  if (newJoueurs.length === 0) {
    return;
  }
  const joueurs = await JoueursRepository.insertMultiples(newJoueurs);

  const newJoueursPreparationTournois = joueurs.map((joueur) =>
    toNewJoueursPreparationTournois(joueur, 0),
  );
  await JoueursPreparationTournoisRepository.insert(
    newJoueursPreparationTournois,
  );
};

export const removeJoueursPreparationTournoi = async (joueurId: number) => {
  const joueur = await JoueursRepository.select(joueurId);
  await JoueursPreparationTournoisRepository.delete([joueur.id]);
  await JoueursRepository.delete([joueur.id]);

  //Update JoueurId des autres joueurs inscrits
  const joueurs: Joueur[] =
    await JoueursPreparationTournoisRepository.getMany();
  await Promise.all(
    joueurs.map(
      async (joueur, index) =>
        await JoueursRepository.updateJoueurId(joueur.id, index),
    ),
  );
};

export const updateJoueursEquipe = async () => {
  const joueurs: Joueur[] =
    await JoueursPreparationTournoisRepository.getMany();
  await Promise.all(
    joueurs.map(
      async (joueur, index) =>
        await JoueursRepository.updateEquipe(joueur.id, index + 1),
    ),
  );
};

export const removeAllJoueursPreparationTournoi = async () => {
  const joueurs: Joueur[] =
    await JoueursPreparationTournoisRepository.getMany();
  await JoueursPreparationTournoisRepository.deleteAll();
  await JoueursRepository.delete(joueurs.map((joueur) => joueur.id));
};

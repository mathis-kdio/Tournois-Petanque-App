import { Joueur, NewJoueur, NewJoueursPreparationTournois } from '@/db/schema';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { JoueursRepository } from '../joueurs/joueursRepository';
import { JoueursSuggestionRepository } from '../joueursSuggestion/joueursSuggestionRepository';
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

  const actualJoueursPreparationTournoiVM = useMemo(() => {
    if (!joueurs.length || !joueursPreparation.length) {
      return [];
    }
    const idsEnPreparation = new Set(joueursPreparation.map((l) => l.joueurId));
    return joueurs
      .filter((t) => idsEnPreparation.has(t.id))
      .map((t) => toJoueurModel(t));
  }, [joueurs, joueursPreparation]);

  const addJoueursPreparationTournoi = async (
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

  const addJoueursPreparationTournoiFromList = async (listeId: number) => {
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

  const removeJoueursPreparationTournoi = async (joueurId: number) => {
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

  const updateJoueursEquipe = async () => {
    const joueurs: Joueur[] =
      await JoueursPreparationTournoisRepository.getMany();
    await Promise.all(
      joueurs.map(
        async (joueur, index) =>
          await JoueursRepository.updateEquipe(joueur.id, index + 1),
      ),
    );
  };

  const removeAllJoueursPreparationTournoi = async () => {
    const joueurs: Joueur[] =
      await JoueursPreparationTournoisRepository.getMany();
    await JoueursPreparationTournoisRepository.deleteAll();
    await JoueursRepository.delete(joueurs.map((joueur) => joueur.id));
  };

  return {
    joueurs: actualJoueursPreparationTournoiVM,
    addJoueursPreparationTournoi,
    addJoueursPreparationTournoiFromList,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
    updateJoueursEquipe,
  };
};

import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { JoueursTournoi, MatchsRepository } from '../matchs/matchsRepository';
import { TournoisRepository } from './tournoisRepository';

function toJoueurModel(joueur: JoueursTournoi): JoueurModel {
  return {
    uniqueBDDId: joueur.j_id,
    joueurTournoiId: joueur.j_joueurId,
    name: joueur.j_name,
    type: (joueur.j_type as JoueurType) ?? undefined,
    equipe: joueur.j_equipe ?? undefined,
    isChecked: !!joueur.j_isChecked,
  };
}

export const renameTournoi = async (id: number, name: string) => {
  await TournoisRepository.renameTournoi(id, name);
};

export const setActualTournoi = async (
  actualTournoi: TournoiModel | undefined,
  id: number,
) => {
  if (actualTournoi) {
    await TournoisRepository.setActualTournoi(actualTournoi.tournoiId, false);
  }
  await TournoisRepository.setActualTournoi(id, true);
};

export const getJoueursTournoi = async (tournoiId: number) => {
  const joueurs = await MatchsRepository.getJoueursTournoi(tournoiId);
  return joueurs.map((joueur) => toJoueurModel(joueur));
};

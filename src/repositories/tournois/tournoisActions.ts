import { TournoiModel } from '@/types/interfaces/tournoi';
import { TournoisRepository } from './tournoisRepository';

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

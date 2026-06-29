import { TournoiModel } from '@/types/interfaces/tournoi';
import { MatchsRepository } from './matchsRepository';

export const updateScore = async (
  actualTournoi: TournoiModel | undefined,
  matchId: number,
  score1: number,
  score2: number,
) => {
  if (!actualTournoi) {
    throw Error('actualTournoi doit être défini pour updateScore');
  }
  const match = await MatchsRepository.get(actualTournoi.tournoiId, matchId);
  await MatchsRepository.updateScore(match[0].id, score1, score2);
};

export const resetScore = async (
  actualTournoi: TournoiModel | undefined,
  matchId: number,
) => {
  if (!actualTournoi) {
    throw Error('actualTournoi doit être défini pour resetScore');
  }
  const match = await MatchsRepository.get(actualTournoi?.tournoiId, matchId);
  await MatchsRepository.resetScore(match[0].id);
};

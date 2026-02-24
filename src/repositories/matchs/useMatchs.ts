import { useTournois } from '../tournois/useTournois';
import { MatchsRepository } from './matchsRepository';

export const useMatchs = () => {
  const { actualTournoi } = useTournois();

  const updateScore = async (
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

  const resetScore = async (matchId: number) => {
    if (!actualTournoi) {
      throw Error('actualTournoi doit être défini pour resetScore');
    }
    const match = await MatchsRepository.get(actualTournoi?.tournoiId, matchId);
    await MatchsRepository.resetScore(match[0].id);
  };

  return {
    updateScore,
    resetScore,
  };
};

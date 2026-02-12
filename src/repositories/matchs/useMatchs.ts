import { MatchsRepository } from './matchsRepository';

export const useMatchs = () => {
  const updateScore = async (id: number, score1: number, score2: number) => {
    await MatchsRepository.updateScore(id, score1, score2);
  };

  const resetScore = async (id: number) => {
    await MatchsRepository.resetScore(id);
  };

  return {
    updateScore,
    resetScore,
  };
};

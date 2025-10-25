import { useCallback } from 'react';
import { MatchsRepository } from './matchsRepository';
import { Match } from '@/db/schema/match';
import { MatchModel } from '@/types/interfaces/match';

function toMatchmodel(match: Match): MatchModel {
  return {
    id: match.id,
    score1: match.score1 ?? undefined,
    score2: match.score2 ?? undefined,
  };
}

export function useMatchsRepository() {
  const getAllMatchs = useCallback(() => MatchsRepository.getAllMatchs(), []);

  const getMatch = useCallback(async (id: number) => {
    const match = await MatchsRepository.getMatch(id);
    console.log(match);
    return toMatchmodel(match);
    //const terrain = MatchsRepository.getMatch(id);
  }, []);

  const deleteMatch = useCallback(
    (id: number) => MatchsRepository.deleteMatch(id),
    [],
  );

  const updateScore = useCallback(
    (id: number, score1: number, score2: number) =>
      MatchsRepository.updateScore(id, score1, score2),
    [],
  );

  return { getAllMatchs, getMatch, deleteMatch, updateScore };
}

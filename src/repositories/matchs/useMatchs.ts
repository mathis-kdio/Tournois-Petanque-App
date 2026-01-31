import { useCallback, useMemo } from 'react';
import { MatchsRepository } from './matchsRepository';
import { Match } from '@/db/schema/match';
import { MatchModel } from '@/types/interfaces/matchModel';
import { Equipe, Terrain } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

function toMatchmodel(
  match: Match,
  equipe1: Equipe,
  equipe2: Equipe,
  terrain: Terrain,
): MatchModel {
  return {
    id: match.id,
    score1: match.score1 ?? undefined,
    score2: match.score2 ?? undefined,
    manche: parseInt(match.tour),
    mancheName: '',
    equipe: [
      [-1, -1, -1, -1],
      [-1, -1, -1, -1],
    ],
    terrain: terrain,
  };
}

export const useMatchsV2 = (matchId: number) => {
  /*const { data: data1 } = useLiveQuery(MatchsRepository.getAllMatchsV2());
  const allMatchsVM = useMemo(
    () => data1?.[0] && toMatchmodel(data1[0]),
    [data1],
  );*/

  const { data: data2 } = useLiveQuery(
    MatchsRepository.getFullMatchV2(matchId),
    [matchId],
  );
  const matchVM = useMemo(
    () =>
      data2?.[0] &&
      toMatchmodel(
        data2[0].match,
        data2[0].equipe,
        data2[0].equipe,
        data2[0].terrains,
      ),
    [data2],
  );

  const deleteMatch = (id: number) => MatchsRepository.deleteMatchV2(id);

  const updateScore = async (id: number, score1: number, score2: number) => {
    await MatchsRepository.updateScoreV2(id, score1, score2);
  };

  const resetScore = async (id: number) => {
    await MatchsRepository.resetScoreV2(id);
  };

  return {
    //allMatchs: allMatchsVM,
    match: matchVM,
    deleteMatch,
    updateScore,
    resetScore,
  };
};

export function useMatchs() {
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

  const resetScore = useCallback(
    (id: number) => MatchsRepository.resetScore(id),
    [],
  );

  return { getAllMatchs, getMatch, deleteMatch, updateScore, resetScore };
}

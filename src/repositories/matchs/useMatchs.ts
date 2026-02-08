import { useMemo } from 'react';
import { MatchsRepository } from './matchsRepository';
import { Match, NewMatch } from '@/db/schema/match';
import { MatchModel } from '@/types/interfaces/matchModel';
import { Equipe, Terrain } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

function toNewMatch(
  matchModel: MatchModel,
  matchId: number,
  tournoiId: number,
): NewMatch {
  const { manche, mancheName, terrain } = matchModel;

  return {
    matchId: matchId,
    tournoiId: tournoiId,
    tourId: manche,
    tourName: mancheName,
    equipe1: 0,
    equipe2: 0,
    terrainId: terrain?.id,
  };
}

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
    manche: match.tourId,
    mancheName: match.tourName ?? undefined,
    equipe: [
      [-1, -1, -1, -1],
      [-1, -1, -1, -1],
    ],
    terrain: terrain,
  };
}

export const useMatchs = (matchId: number) => {
  const { data: data2 } = useLiveQuery(MatchsRepository.getFullMatch(matchId), [
    matchId,
  ]);
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

  const addMatchs = async (matchs: MatchModel[], tournoiId: number) => {
    const a = matchs.map((match, index) => toNewMatch(match, index, tournoiId));
    //TODO
    await MatchsRepository.insertMatch(a[0]);
  };

  const deleteMatch = (id: number) => MatchsRepository.deleteMatch(id);

  const updateScore = async (id: number, score1: number, score2: number) => {
    await MatchsRepository.updateScore(id, score1, score2);
  };

  const resetScore = async (id: number) => {
    await MatchsRepository.resetScore(id);
  };

  return {
    match: matchVM,
    addMatchs,
    deleteMatch,
    updateScore,
    resetScore,
  };
};

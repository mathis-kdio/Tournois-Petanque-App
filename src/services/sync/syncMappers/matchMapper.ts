import { Match, NewMatch } from '@/db/schema';

export interface MatchPostgresRow {
  id: string;
  match_id: number;
  tournoi_id: string;
  tour_id: number;
  tour_name: string | null;
  equipe1_id: string;
  equipe2_id: string;
  score1: number | null;
  score2: number | null;
  terrain_id: string | null;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function matchToPostgres(
  row: Match,
  userId: string,
): Omit<MatchPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    match_id: row.matchId,
    tournoi_id: row.tournoiId,
    tour_id: row.tourId,
    tour_name: row.tourName ?? null,
    equipe1_id: row.equipe1,
    equipe2_id: row.equipe2,
    score1: row.score1 ?? null,
    score2: row.score2 ?? null,
    terrain_id: row.terrainId ?? null,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function matchFromPostgres(row: MatchPostgresRow): NewMatch {
  return {
    id: row.id,
    matchId: row.match_id,
    tournoiId: row.tournoi_id,
    tourId: row.tour_id,
    tourName: row.tour_name ?? undefined,
    equipe1: row.equipe1_id,
    equipe2: row.equipe2_id,
    score1: row.score1 ?? undefined,
    score2: row.score2 ?? undefined,
    terrainId: row.terrain_id ?? undefined,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

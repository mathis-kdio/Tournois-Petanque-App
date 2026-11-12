import { JoueursSuggestion, NewJoueursSuggestion } from '@/db/schema';

export interface JoueursSuggestionPostgresRow {
  id: string;
  name: string;
  occurence: number;
  cacher: boolean;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function joueursSuggestionToPostgres(
  row: JoueursSuggestion,
  userId: string,
): Omit<JoueursSuggestionPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    name: row.name,
    occurence: row.occurence,
    cacher: row.cacher ?? false,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function joueursSuggestionFromPostgres(
  row: JoueursSuggestionPostgresRow,
): NewJoueursSuggestion {
  return {
    id: row.id,
    name: row.name,
    occurence: row.occurence,
    cacher: row.cacher,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

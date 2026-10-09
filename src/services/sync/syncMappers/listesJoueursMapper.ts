import { ListesJoueurs, NewListesJoueurs } from '@/db/schema';

export interface ListesJoueursPostgresRow {
  id: string;
  name: string | null;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function listesJoueursToPostgres(
  row: ListesJoueurs,
  userId: string,
): Omit<ListesJoueursPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    name: row.name ?? null,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function listesJoueursFromPostgres(
  row: ListesJoueursPostgresRow,
): NewListesJoueurs {
  return {
    id: row.id,
    name: row.name ?? undefined,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

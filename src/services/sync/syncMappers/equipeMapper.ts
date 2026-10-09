import { Equipe, NewEquipe } from '@/db/schema';

export interface EquipePostgresRow {
  id: string;
  equipe_id: number;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function equipeToPostgres(
  row: Equipe,
  userId: string,
): Omit<EquipePostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    equipe_id: row.equipeId,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function equipeFromPostgres(row: EquipePostgresRow): NewEquipe {
  return {
    id: row.id,
    equipeId: row.equipe_id,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

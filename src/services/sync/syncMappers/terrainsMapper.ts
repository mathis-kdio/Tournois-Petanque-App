import { NewTerrain, Terrain } from '@/db/schema';

export interface TerrainsPostgresRow {
  id: string;
  name: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function terrainsToPostgres(
  row: Terrain,
  userId: string,
): Omit<TerrainsPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    name: row.name,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function terrainsFromPostgres(row: TerrainsPostgresRow): NewTerrain {
  return {
    id: row.id,
    name: row.name,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

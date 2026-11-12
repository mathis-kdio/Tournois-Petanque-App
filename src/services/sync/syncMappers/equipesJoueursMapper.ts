import { EquipesJoueurs, NewEquipesJoueurs } from '@/db/schema';

export interface EquipesJoueursPostgresRow {
  id: string;
  joueur_id: string;
  equipe_id: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function equipesJoueursToPostgres(
  row: EquipesJoueurs,
  userId: string,
): Omit<EquipesJoueursPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    joueur_id: row.joueurId,
    equipe_id: row.equipeId,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function equipesJoueursFromPostgres(
  row: EquipesJoueursPostgresRow,
): NewEquipesJoueurs {
  return {
    id: row.id,
    joueurId: row.joueur_id,
    equipeId: row.equipe_id,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

import { Joueur, NewJoueur } from '@/db/schema';

export interface JoueursPostgresRow {
  id: string;
  joueur_id: number;
  name: string;
  type: string | null;
  equipe: number | null;
  is_checked: boolean;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function joueursToPostgres(
  row: Joueur,
  userId: string,
): Omit<JoueursPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    joueur_id: row.joueurId,
    name: row.name,
    type: row.type ?? null,
    equipe: row.equipe ?? null,
    is_checked: row.isChecked ?? false,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function joueursFromPostgres(row: JoueursPostgresRow): NewJoueur {
  return {
    id: row.id,
    joueurId: row.joueur_id,
    name: row.name,
    type: (row.type as NewJoueur['type']) ?? undefined,
    equipe: row.equipe ?? undefined,
    isChecked: row.is_checked,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

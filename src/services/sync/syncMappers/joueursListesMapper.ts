import { JoueursListes, NewJoueursListes } from '@/db/schema';

export interface JoueursListesPostgresRow {
  id: string;
  joueur_id: string;
  liste_id: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function joueursListesToPostgres(
  row: JoueursListes,
  userId: string,
): Omit<JoueursListesPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    joueur_id: row.joueurId,
    liste_id: row.listeId,
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function joueursListesFromPostgres(
  row: JoueursListesPostgresRow,
): NewJoueursListes {
  return {
    id: row.id,
    joueurId: row.joueur_id,
    listeId: row.liste_id,
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}

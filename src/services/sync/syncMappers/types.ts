/**
 * Types communs pour les mappers de synchronisation.
 *
 * Une ligne Postgres distante contient les colonnes métier (snake_case) plus
 * les colonnes serveur (user_id, updated_at, deleted, deleted_at,
 * server_updated_at). Une ligne SQLite locale contient les colonnes métier
 * (camelCase via Drizzle) plus synced, updated_at, deleted.
 *
 * Le mapper :
 *  - push : SQLite → Postgres  (ajoute user_id, supprime synced, convertit
 *    updated_at Date → ISO string pour supabase-js) ;
 *  - pull : Postgres → SQLite  (supprime user_id / deleted_at /
 *    server_updated_at, force synced = true, convertit updated_at et create_at
 *    ISO string → Date).
 */

/** Ligne Postgres distante générique (avant typage par table). */
export interface PostgresRowBase {
  id: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

/** Ligne SQLite locale prête à être insérée après un pull (synced = true). */
export interface SqliteUpsertBase {
  synced: boolean;
}

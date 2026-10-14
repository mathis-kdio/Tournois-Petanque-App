import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Table locale de suivi de la synchronisation.
 * Une seule ligne par compte (userId = id du compte Supabase).
 */
export const syncState = sqliteTable('sync_state', {
  userId: text('user_id').primaryKey(),
  lastPulledAt: integer('last_pulled_at'),
  clockOffset: integer('clock_offset'),
  purgedAt: integer('purged_at'),
});

export type SyncState = typeof syncState.$inferSelect;
export type NewSyncState = typeof syncState.$inferInsert;

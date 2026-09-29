import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { equipe } from './equipe';
import { terrains } from './terrain';
import { tournoi } from './tournoi';

export const match = sqliteTable('match', {
  id: text('id').primaryKey(),
  matchId: integer('match_id').notNull(),
  tournoiId: text('tournoi_id')
    .references(() => tournoi.id)
    .notNull(),
  tourId: integer('tour_id').notNull(),
  tourName: text('tour_name'),
  equipe1: text('equipe1_id')
    .references(() => equipe.id)
    .notNull(),
  equipe2: text('equipe2_id')
    .references(() => equipe.id)
    .notNull(),
  score1: integer('score1'),
  score2: integer('score2'),
  terrainId: text('terrain_id').references(() => terrains.id),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type Match = typeof match.$inferSelect;
export type NewMatch = typeof match.$inferInsert;

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { equipe } from './equipe';
import { terrains } from './terrain';
import { tournoi } from './tournoi';

export const match = sqliteTable('match', {
  id: integer('id').primaryKey(),
  matchId: integer('match_id').notNull(),
  tournoiId: integer('tournoi_id')
    .references(() => tournoi.id)
    .notNull(),
  tourId: integer('tour_id').notNull(),
  tourName: text('tour_name'),
  equipe1: integer('equipe1_id')
    .references(() => equipe.id)
    .notNull(),
  equipe2: integer('equipe2_id')
    .references(() => equipe.id)
    .notNull(),
  score1: integer('score1'),
  score2: integer('score2'),
  terrainId: integer('terrain_id').references(() => terrains.id),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Match = typeof match.$inferSelect;
export type NewMatch = typeof match.$inferInsert;

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { terrain } from './terrain';
import { equipe } from './equipe';
import { tournoi } from './tournoi';

export const match = sqliteTable('match', {
  id: integer('id').primaryKey(),
  matchId: integer('match_id'),
  tournoiId: integer('tournoi_id').references(() => tournoi.id),
  tour: text('tour'),
  equipe1: integer('equipe1_id').references(() => equipe.id),
  equipe2: integer('equipe2_id').references(() => equipe.id),
  score1: integer('score1'),
  score2: integer('score2'),
  terrainId: integer('terrain_id').references(() => terrain.id),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Match = typeof match.$inferSelect;
export type NewMatch = typeof match.$inferInsert;

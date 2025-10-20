import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tournoi = sqliteTable('tournoi', {
  id: integer('id').primaryKey(),
  name: text('name'),
  option1: text('option1'),
  option2: text('option2'),
  option3: text('option3'),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Tournoi = typeof tournoi.$inferSelect;
export type NewTournoi = typeof tournoi.$inferInsert;

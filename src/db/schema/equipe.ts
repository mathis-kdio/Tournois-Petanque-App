import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';

export const equipe = sqliteTable('equipe', {
  id: integer('id').primaryKey(),
  equipeId: integer('equipe_id'),
  joueurId: integer('joueur_id').references(() => joueurs.id),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Equipe = typeof equipe.$inferSelect;
export type NewEquipe = typeof equipe.$inferInsert;

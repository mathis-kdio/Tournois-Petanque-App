import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { equipe } from './equipe';
import { joueurs } from './joueurs';

export const equipesJoueurs = sqliteTable('equipes_joueurs', {
  id: integer('id').primaryKey(),
  joueurId: integer('joueur_id')
    .references(() => joueurs.id)
    .notNull(),
  equipeId: integer('equipe_id')
    .references(() => equipe.id)
    .notNull(),
});

export type EquipesJoueurs = typeof equipesJoueurs.$inferSelect;
export type NewEquipesJoueurs = typeof equipesJoueurs.$inferInsert;

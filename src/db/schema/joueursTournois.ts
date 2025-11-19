import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { tournoi } from './tournoi';

export const joueursTournois = sqliteTable('joueurs_tournois', {
  id: integer('id').primaryKey(),
  joueurId: integer('joueur_id').references(() => joueurs.id),
  listeId: integer('tournoi_id').references(() => tournoi.id),
});

export type JoueursTournois = typeof joueursTournois.$inferSelect;
export type NewJoueursTournois = typeof joueursTournois.$inferInsert;

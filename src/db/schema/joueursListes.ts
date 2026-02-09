import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { listesJoueurs } from './listesJoueurs';

export const joueursListes = sqliteTable('joueurs_listes', {
  id: integer('id').primaryKey(),
  joueurId: integer('joueur_id').references(() => joueurs.id),
  listeId: integer('liste_id').references(() => listesJoueurs.id),
});

export type JoueursListes = typeof joueursListes.$inferSelect;
export type NewJoueursListes = typeof joueursListes.$inferInsert;

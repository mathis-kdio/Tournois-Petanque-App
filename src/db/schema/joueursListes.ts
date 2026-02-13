import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { listesJoueurs } from './listesJoueurs';

export const joueursListes = sqliteTable('joueurs_listes', {
  id: integer('id').primaryKey(),
  joueurId: integer('joueur_id')
    .references(() => joueurs.id)
    .notNull(),
  listeId: integer('liste_id')
    .references(() => listesJoueurs.id)
    .notNull(),
});

export type JoueursListes = typeof joueursListes.$inferSelect;
export type NewJoueursListes = typeof joueursListes.$inferInsert;

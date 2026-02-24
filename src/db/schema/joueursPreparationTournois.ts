import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { preparationTournoi } from './preparationTournoi';

export const joueursPreparationTournois = sqliteTable(
  'joueurs_preparation_tournois',
  {
    id: integer('id').primaryKey(),
    joueurId: integer('joueur_id')
      .references(() => joueurs.id)
      .notNull(),
    preparationTournoiId: integer('preparation_tournoi_id')
      .references(() => preparationTournoi.id)
      .notNull(),
  },
);

export type JoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferSelect;
export type NewJoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferInsert;

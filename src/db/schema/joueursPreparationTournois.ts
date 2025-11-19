import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { preparationTournoi } from './preparationTournoi';

export const joueursPreparationTournois = sqliteTable(
  'joueurs_prepration_tournois',
  {
    id: integer('id').primaryKey(),
    joueurId: integer('joueur_id').references(() => joueurs.id),
    preparationTournoiId: integer('preparation_tournoi_id').references(
      () => preparationTournoi.id,
    ),
  },
);

export type JoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferSelect;
export type NewJoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferInsert;

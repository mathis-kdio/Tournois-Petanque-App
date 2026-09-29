import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { preparationTournoi } from './preparationTournoi';

export const joueursPreparationTournois = sqliteTable(
  'joueurs_preparation_tournois',
  {
    id: text('id').primaryKey(),
    joueurId: text('joueur_id')
      .references(() => joueurs.id)
      .notNull(),
    preparationTournoiId: text('preparation_tournoi_id')
      .references(() => preparationTournoi.id)
      .notNull(),
    synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
  },
);

export type JoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferSelect;
export type NewJoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferInsert;

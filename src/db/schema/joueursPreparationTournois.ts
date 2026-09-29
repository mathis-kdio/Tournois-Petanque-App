import { uuidv7 } from '@/utils/uuid/uuidv7';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { preparationTournoi } from './preparationTournoi';

export const joueursPreparationTournois = sqliteTable(
  'joueurs_preparation_tournois',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    joueurId: text('joueur_id')
      .references(() => joueurs.id)
      .notNull(),
    preparationTournoiId: text('preparation_tournoi_id')
      .references(() => preparationTournoi.id)
      .notNull(),
  },
);

export type JoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferSelect;
export type NewJoueursPreparationTournois =
  typeof joueursPreparationTournois.$inferInsert;

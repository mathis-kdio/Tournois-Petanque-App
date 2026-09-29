import { uuidv7 } from '@/utils/uuid/uuidv7';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { preparationTournoi } from './preparationTournoi';
import { terrains } from './terrain';

export const terrainsPreparationTournois = sqliteTable(
  'terrains_preparation_tournois',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    terrainId: text('terrain_id')
      .references(() => terrains.id)
      .notNull(),
    preparationTournoiId: text('preparation_tournoi_id')
      .references(() => preparationTournoi.id)
      .notNull(),
  },
);

export type TerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferSelect;
export type NewTerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferInsert;

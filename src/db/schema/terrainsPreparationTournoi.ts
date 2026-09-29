import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { preparationTournoi } from './preparationTournoi';
import { terrains } from './terrain';

export const terrainsPreparationTournois = sqliteTable(
  'terrains_preparation_tournois',
  {
    id: text('id').primaryKey(),
    terrainId: text('terrain_id')
      .references(() => terrains.id)
      .notNull(),
    preparationTournoiId: text('preparation_tournoi_id')
      .references(() => preparationTournoi.id)
      .notNull(),
    synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
  },
);

export type TerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferSelect;
export type NewTerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferInsert;

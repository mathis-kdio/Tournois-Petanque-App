import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { preparationTournoi } from './preparationTournoi';
import { terrains } from './terrain';

export const terrainsPreparationTournois = sqliteTable(
  'terrains_preparation_tournois',
  {
    id: integer('id').primaryKey(),
    terrainId: integer('terrain_id').references(() => terrains.id),
    preparationTournoiId: integer('preparation_tournoi_id').references(
      () => preparationTournoi.id,
    ),
  },
);

export type TerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferSelect;
export type NewTerrainsPreparationTournois =
  typeof terrainsPreparationTournois.$inferInsert;

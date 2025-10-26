import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const terrains = sqliteTable('terrains', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Terrain = typeof terrains.$inferSelect;
export type NewTerrain = typeof terrains.$inferInsert;

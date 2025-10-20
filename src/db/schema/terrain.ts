import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const terrain = sqliteTable('terrain', {
  id: integer('id').primaryKey(),
  name: text('name'),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type Terrain = typeof terrain.$inferSelect;
export type NewTerrain = typeof terrain.$inferInsert;

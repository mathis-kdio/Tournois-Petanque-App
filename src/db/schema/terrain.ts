import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const terrains = sqliteTable('terrains', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type Terrain = typeof terrains.$inferSelect;
export type NewTerrain = typeof terrains.$inferInsert;

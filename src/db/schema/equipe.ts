import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const equipe = sqliteTable('equipe', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  equipeId: integer('equipe_id').notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type Equipe = typeof equipe.$inferSelect;
export type NewEquipe = typeof equipe.$inferInsert;

import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const listesJoueurs = sqliteTable('listes_joueurs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name'),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type ListesJoueurs = typeof listesJoueurs.$inferSelect;
export type NewListesJoueurs = typeof listesJoueurs.$inferInsert;

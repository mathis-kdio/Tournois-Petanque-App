import { uuidv7 } from '@/utils/uuid/uuidv7';
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const joueursSuggestion = sqliteTable(
  'joueurs_suggestion',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: text('name').notNull(),
    occurence: integer('occurence').notNull(),
    cacher: integer('cacher', { mode: 'boolean' }).default(false),
    synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date(Date.now())),
    deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
  },
  (table) => [uniqueIndex('nameUniqueIndex').on(table.name)],
);

export type JoueursSuggestion = typeof joueursSuggestion.$inferSelect;
export type NewJoueursSuggestion = typeof joueursSuggestion.$inferInsert;

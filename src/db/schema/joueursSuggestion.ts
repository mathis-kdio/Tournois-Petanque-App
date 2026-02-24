import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const joueursSuggestion = sqliteTable(
  'joueurs_suggestion',
  {
    id: integer().primaryKey(),
    name: text().notNull(),
    occurence: integer().notNull(),
    cacher: integer({ mode: 'boolean' }).default(false),
  },
  (table) => [uniqueIndex('nameUniqueIndex').on(table.name)],
);

export type JoueursSuggestion = typeof joueursSuggestion.$inferSelect;
export type NewJoueursSuggestion = typeof joueursSuggestion.$inferInsert;

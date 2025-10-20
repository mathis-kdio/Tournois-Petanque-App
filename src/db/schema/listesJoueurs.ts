import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const listesJoueurs = sqliteTable('listes_joueurs', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  updatedAt: integer('updated_at'),
  synced: integer('synced').default(0),
});

export type ListesJoueurs = typeof listesJoueurs.$inferSelect;
export type NewListesJoueurs = typeof listesJoueurs.$inferInsert;

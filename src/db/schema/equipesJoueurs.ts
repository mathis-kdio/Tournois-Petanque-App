import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { equipe } from './equipe';
import { joueurs } from './joueurs';

export const equipesJoueurs = sqliteTable('equipes_joueurs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  joueurId: text('joueur_id')
    .references(() => joueurs.id)
    .notNull(),
  equipeId: text('equipe_id')
    .references(() => equipe.id)
    .notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type EquipesJoueurs = typeof equipesJoueurs.$inferSelect;
export type NewEquipesJoueurs = typeof equipesJoueurs.$inferInsert;

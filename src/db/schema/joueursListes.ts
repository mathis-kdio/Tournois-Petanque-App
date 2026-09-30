import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { joueurs } from './joueurs';
import { listesJoueurs } from './listesJoueurs';

export const joueursListes = sqliteTable('joueurs_listes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  joueurId: text('joueur_id')
    .references(() => joueurs.id)
    .notNull(),
  listeId: text('liste_id')
    .references(() => listesJoueurs.id)
    .notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type JoueursListes = typeof joueursListes.$inferSelect;
export type NewJoueursListes = typeof joueursListes.$inferInsert;

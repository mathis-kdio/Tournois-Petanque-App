import { JoueurType } from '@/types/enums/joueurType';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const joueurs = sqliteTable('joueurs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  joueurId: integer('joueur_id').notNull(),
  name: text('name').notNull(),
  type: text('type').$type<JoueurType>(),
  equipe: integer('equipe'),
  isChecked: integer('isChecked', { mode: 'boolean' }).default(false),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type Joueur = typeof joueurs.$inferSelect;
export type NewJoueur = typeof joueurs.$inferInsert;

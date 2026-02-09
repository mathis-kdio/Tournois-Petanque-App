import { JoueurType } from '@/types/enums/joueurType';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const joueurs = sqliteTable('joueurs', {
  id: integer().primaryKey(),
  joueurId: integer('joueur_id').notNull(),
  name: text().notNull(),
  type: text().$type<JoueurType>(),
  equipe: integer(),
  isChecked: integer({ mode: 'boolean' }).default(false),
});

export type Joueur = typeof joueurs.$inferSelect;
export type NewJoueur = typeof joueurs.$inferInsert;

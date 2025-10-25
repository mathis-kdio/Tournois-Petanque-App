import { JoueurType } from '@/types/enums/joueurType';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const joueurs = sqliteTable('joueurs', {
  id: integer('id').primaryKey(),
  joueurId: integer('joueur_id').notNull(),
  name: text('name').notNull(),
  type: text('type').$type<JoueurType>(),
  equipe: integer('equipe'),
});

export type Joueur = typeof joueurs.$inferSelect;
export type NewJoueur = typeof joueurs.$inferInsert;

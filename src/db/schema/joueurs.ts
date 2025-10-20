import { JoueurType } from '@/types/enums/joueurType';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const joueurs = sqliteTable('joueurs', {
  id: integer('id').primaryKey(),
  joueurId: text('joueur_id'),
  name: text('name'),
  type: text('type').$type<JoueurType>(),
  equipe: text('equipe'),
});

export type Joueur = typeof joueurs.$inferSelect;
export type NewJoueur = typeof joueurs.$inferInsert;

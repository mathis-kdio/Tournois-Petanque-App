import { Complement } from '@/types/enums/complement';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const preparationTournoi = sqliteTable('preparation_tournoi', {
  id: integer('id').primaryKey(),
  nbTours: integer(),
  nbPtVictoire: integer(),
  speciauxIncompatibles: integer({ mode: 'boolean' }),
  memesEquipes: integer({ mode: 'boolean' }),
  memesAdversaires: integer().$type<MemesAdversairesType>(),
  typeTournoi: text().$type<TypeTournoi>(),
  typeEquipes: text().$type<TypeEquipes>(),
  mode: text().$type<ModeTournoi>(),
  modeCreationEquipes: text().$type<ModeCreationEquipes>(),
  complement: text().$type<Complement>(),
  avecTerrains: integer({ mode: 'boolean' }).default(false).notNull(),
});

export type PreparationTournoi = typeof preparationTournoi.$inferSelect;
export type NewPreparationTournoi = typeof preparationTournoi.$inferInsert;

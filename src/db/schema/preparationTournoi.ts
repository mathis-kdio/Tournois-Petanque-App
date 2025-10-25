import { Complement } from '@/types/enums/complement';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const preparationTournoi = sqliteTable('preparationTournoi', {
  id: integer('id').primaryKey(),
  nbTours: integer(),
  nbPtVictoire: integer(),
  speciauxIncompatibles: integer({ mode: 'boolean' }),
  memesEquipes: integer({ mode: 'boolean' }),
  memesAdversaires: integer(),
  typeTournoi: text().$type<TypeTournoi>(),
  typeEquipes: text().$type<TypeEquipes>(),
  mode: text().$type<ModeTournoi>(),
  modeCreationEquipes: text().$type<ModeCreationEquipes>(),
  complement: text().$type<Complement>(),
  avecTerrains: integer({ mode: 'boolean' }),
});

export type PreparationTournoi = typeof preparationTournoi.$inferSelect;
export type NewPreparationTournoi = typeof preparationTournoi.$inferInsert;

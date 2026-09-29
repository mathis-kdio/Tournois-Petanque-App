import { Complement } from '@/types/enums/complement';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const preparationTournoi = sqliteTable('preparation_tournoi', {
  id: text('id').primaryKey(),
  nbTours: integer('nbTours'),
  nbPtVictoire: integer('nbPtVictoire'),
  speciauxIncompatibles: integer('speciauxIncompatibles', { mode: 'boolean' }),
  memesEquipes: integer('memesEquipes', { mode: 'boolean' }),
  memesAdversaires: integer('memesAdversaires').$type<MemesAdversairesType>(),
  typeTournoi: text('typeTournoi').$type<TypeTournoi>(),
  typeEquipes: text('typeEquipes').$type<TypeEquipes>(),
  mode: text('mode').$type<ModeTournoi>(),
  modeCreationEquipes: text('modeCreationEquipes').$type<ModeCreationEquipes>(),
  complement: text('complement').$type<Complement>(),
  avecTerrains: integer('avecTerrains', { mode: 'boolean' })
    .default(false)
    .notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type PreparationTournoi = typeof preparationTournoi.$inferSelect;
export type NewPreparationTournoi = typeof preparationTournoi.$inferInsert;

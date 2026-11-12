import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tournoi = sqliteTable('tournoi', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  nbTours: integer('nbTours').notNull(),
  nbMatchs: integer('nbMatchs').notNull(),
  nbPtVictoire: integer('nbPtVictoire').notNull(),
  speciauxIncompatibles: integer('speciauxIncompatibles', {
    mode: 'boolean',
  }).notNull(),
  memesEquipes: integer('memesEquipes', { mode: 'boolean' }).notNull(),
  memesAdversaires: integer('memesAdversaires')
    .$type<MemesAdversairesType>()
    .notNull(),
  typeEquipes: text('typeEquipes', {
    enum: [TypeEquipes.DOUBLETTE, TypeEquipes.TETEATETE, TypeEquipes.TRIPLETTE],
  }).notNull(),
  typeTournoi: text('typeTournoi', {
    enum: [
      TypeTournoi.CHAMPIONNAT,
      TypeTournoi.COUPE,
      TypeTournoi.MELEDEMELE,
      TypeTournoi.MELEE,
      TypeTournoi.MULTICHANCES,
    ],
  }).notNull(),
  avecTerrains: integer('avecTerrains', { mode: 'boolean' }).notNull(),
  mode: text('mode', {
    enum: [ModeTournoi.AVECEQUIPES, ModeTournoi.AVECNOMS, ModeTournoi.SANSNOMS],
  }).notNull(),
  estTournoiActuel: integer('estTournoiActuel', { mode: 'boolean' }).notNull(),
  createAt: integer('create_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  synced: integer('synced', { mode: 'boolean' }).default(false).notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).default(false).notNull(),
});

export type Tournoi = typeof tournoi.$inferSelect;
export type NewTournoi = typeof tournoi.$inferInsert;

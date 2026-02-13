import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tournoi = sqliteTable('tournoi', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  nbTours: integer().notNull(),
  nbMatchs: integer().notNull(),
  nbPtVictoire: integer().notNull(),
  speciauxIncompatibles: integer({ mode: 'boolean' }).notNull(),
  memesEquipes: integer({ mode: 'boolean' }).notNull(),
  memesAdversaires: integer().$type<MemesAdversairesType>().notNull(),
  typeEquipes: text({
    enum: [TypeEquipes.DOUBLETTE, TypeEquipes.TETEATETE, TypeEquipes.TRIPLETTE],
  }).notNull(),
  typeTournoi: text({
    enum: [
      TypeTournoi.CHAMPIONNAT,
      TypeTournoi.COUPE,
      TypeTournoi.MELEDEMELE,
      TypeTournoi.MELEE,
      TypeTournoi.MULTICHANCES,
    ],
  }).notNull(),
  avecTerrains: integer({ mode: 'boolean' }).notNull(),
  mode: text({
    enum: [ModeTournoi.AVECEQUIPES, ModeTournoi.AVECNOMS, ModeTournoi.SANSNOMS],
  }).notNull(),
  createAt: integer('create_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Tournoi = typeof tournoi.$inferSelect;
export type NewTournoi = typeof tournoi.$inferInsert;

import { equipe, equipesJoueurs, joueurs, terrains } from '@/db/schema';
import { match, NewMatch } from '@/db/schema/match';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { and, eq, inArray, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

export type FullMatch = {
  m_id: number;
  m_matchId: number;
  m_tournoiId: number;
  m_tourId: number;
  m_tourName: string | null;
  m_equipe1: number;
  m_equipe2: number;
  m_score1: number | null;
  m_score2: number | null;
  m_terrainId: number | null;
  m_updatedAt: number | null;
  m_synced: number | null;
  e1_id: number;
  e2_id: number;
} & FullMatchTerrain;

export type FullMatchTerrain = {
  t_id: number | null;
  t_name: string | null;
  t_updatedAt: number | null;
  t_synced: number | null;
};

export interface JoueursTournoi {
  j_id: number;
  j_joueurId: number;
  j_name: string;
  j_type: string | null;
  j_equipe: number | null;
  j_isChecked: number | null;
}

export const MatchsRepository = {
  get(tournoiId: number, matchId: number) {
    return getDrizzleDb()
      .select()
      .from(match)
      .where(and(eq(match.tournoiId, tournoiId), eq(match.matchId, matchId)));
  },

  getFullMatchsTournoi(tournoiId: number) {
    const equipe1 = alias(equipe, 'equipe1');
    const equipe2 = alias(equipe, 'equipe2');
    return getDrizzleDb()
      .select({
        m_id: sql<number>`${match.id}`.as('m_id'),
        m_matchId: sql<number>`${match.matchId}`.as('m_matchId'),
        m_tournoiId: sql<number>`${match.tournoiId}`.as('m_tournoiId'),
        m_tourId: sql<number>`${match.tourId}`.as('m_tourId'),
        m_tourName: sql<string | null>`${match.tourName}`.as('m_tourName'),
        m_equipe1: sql<number>`${match.equipe1}`.as('m_equipe1'),
        m_equipe2: sql<number>`${match.equipe2}`.as('m_equipe2'),
        m_score1: sql<number | null>`${match.score1}`.as('m_score1'),
        m_score2: sql<number | null>`${match.score2}`.as('m_score2'),
        m_terrainId: sql<number | null>`${match.terrainId}`.as('m_terrainId'),
        m_updatedAt: sql<number | null>`${match.updatedAt}`.as('m_updatedAt'),
        m_synced: sql<number | null>`${match.synced}`.as('m_synced'),
        e1_id: sql<number>`${equipe1.id}`.as('e1_id'),
        e2_id: sql<number>`${equipe2.id}`.as('e2_id'),
        t_id: sql<number | null>`${terrains.id}`.as('t_id'),
        t_name: sql<string | null>`${terrains.name}`.as('t_name'),
        t_synced: sql<number | null>`${terrains.synced}`.as('t_synced'),
        t_updatedAt: sql<number | null>`${terrains.updatedAt}`.as(
          't_updatedAt',
        ),
      })
      .from(match)
      .where(eq(match.tournoiId, tournoiId))
      .innerJoin(equipe1, eq(equipe1.id, match.equipe1))
      .innerJoin(equipe2, eq(equipe2.id, match.equipe2))
      .leftJoin(terrains, eq(terrains.id, match.terrainId));
  },

  getJoueursTournoi(tournoiId: number) {
    const e1 = alias(equipe, 'e1');
    const e2 = alias(equipe, 'e2');

    return getDrizzleDb()
      .selectDistinct({
        j_id: sql<number>`${joueurs.id}`.as('j_id'),
        j_joueurId: sql<number>`${joueurs.joueurId}`.as('j_joueurId'),
        j_name: sql<string>`${joueurs.name}`.as('j_name'),
        j_type: sql<string | null>`${joueurs.type}`.as('j_type'),
        j_equipe: sql<number | null>`${joueurs.equipe}`.as('j_equipe'),
        j_isChecked: sql<number | null>`${joueurs.isChecked}`.as('j_isChecked'),
      })
      .from(match)
      .where(eq(match.tournoiId, tournoiId))
      .innerJoin(e1, eq(e1.id, match.equipe1))
      .innerJoin(e2, eq(e2.id, match.equipe2))
      .innerJoin(
        equipesJoueurs,
        or(
          eq(equipesJoueurs.equipeId, e1.id),
          eq(equipesJoueurs.equipeId, e2.id),
        ),
      )
      .innerJoin(joueurs, eq(joueurs.id, equipesJoueurs.joueurId));
  },

  insertMatch(newMatchs: NewMatch[]) {
    return getDrizzleDb().insert(match).values(newMatchs).returning();
  },

  delete(idlist: number[]) {
    return getDrizzleDb().delete(match).where(inArray(match.id, idlist));
  },

  deleteAll() {
    return getDrizzleDb().delete(match);
  },

  updateScore(id: number, score1: number, score2: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1, score2 })
      .where(eq(match.id, id));
  },

  updateMatchNext(
    tournoiId: number,
    equipeId: number,
    matchId: number,
    nextEquipeNumber: 0 | 1,
  ) {
    const fieldToUpdate = nextEquipeNumber === 0 ? 'equipe1' : 'equipe2';
    return getDrizzleDb()
      .update(match)
      .set({ [fieldToUpdate]: equipeId })
      .where(and(eq(match.tournoiId, tournoiId), eq(match.matchId, matchId)));
  },

  resetScore(id: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1: null, score2: null })
      .where(eq(match.id, id));
  },
};

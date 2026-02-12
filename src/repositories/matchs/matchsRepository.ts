import { equipe, terrains } from '@/db/schema';
import { match, NewMatch } from '@/db/schema/match';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

export type FullMatch = {
  match: {
    id: number;
    matchId: number;
    tournoiId: number;
    tourId: number;
    tourName: string | null;
    equipe1: number;
    equipe2: number;
    score1: number | null;
    score2: number | null;
    terrainId: number | null;
    updatedAt: number | null;
    synced: number | null;
  };
  equipe1: {
    id: number;
    equipeId: number;
    updatedAt: number | null;
    synced: number | null;
  };
  equipe2: {
    id: number;
    equipeId: number;
    updatedAt: number | null;
    synced: number | null;
  };
  terrains: {
    id: number;
    name: string;
    updatedAt: number | null;
    synced: number | null;
  } | null;
};

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
      .select()
      .from(match)
      .where(eq(match.tournoiId, tournoiId))
      .innerJoin(equipe1, eq(equipe1.id, match.equipe1))
      .innerJoin(equipe2, eq(equipe2.id, match.equipe2))
      .leftJoin(terrains, eq(terrains.id, match.terrainId));
  },

  insertMatch(newMatchs: NewMatch[]) {
    return getDrizzleDb().insert(match).values(newMatchs).returning();
  },

  deleteMatch(id: number) {
    return getDrizzleDb().delete(match).where(eq(match.id, id));
  },

  updateScore(id: number, score1: number, score2: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1, score2 })
      .where(eq(match.id, id));
  },

  resetScore(id: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1: null, score2: null })
      .where(eq(match.id, id));
  },
};

import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { match, NewMatch } from '@/db/schema/match';
import { equipe, terrains, tournoi } from '@/db/schema';
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
  getFullMatch(id: number) {
    const equipe1 = alias(equipe, 'equipe1');
    const equipe2 = alias(equipe, 'equipe2');
    return getDrizzleDb()
      .select()
      .from(match)
      .where(eq(match.id, id))
      .innerJoin(tournoi, eq(match.tournoiId, tournoi.id))
      .innerJoin(equipe1, eq(match.equipe1, equipe1.id))
      .innerJoin(equipe2, eq(match.equipe2, equipe2.id))
      .leftJoin(terrains, eq(match.terrainId, terrains.id));
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

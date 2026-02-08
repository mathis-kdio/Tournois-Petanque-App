import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { match, NewMatch } from '@/db/schema/match';
import { equipe, terrains, tournoi } from '@/db/schema';

export const MatchsRepository = {
  getFullMatch(id: number) {
    return getDrizzleDb()
      .select()
      .from(match)
      .where(eq(match.id, id))
      .innerJoin(tournoi, eq(match.tournoiId, tournoi.id))
      .innerJoin(equipe, eq(match.equipe1, equipe.id))
      .innerJoin(equipe, eq(match.equipe2, equipe.id))
      .innerJoin(terrains, eq(match.terrainId, terrains.id));
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

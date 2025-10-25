import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { Match, match, NewMatch } from '@/db/schema/match';

export const MatchsRepository = {
  async getAllMatchs(): Promise<Match[]> {
    return await getDrizzleDb().select().from(match);
  },

  async getMatch(id: number): Promise<Match> {
    const res = await getDrizzleDb()
      .select()
      .from(match)
      .where(eq(match.id, id));
    return res[0];
  },

  async insertMatch(newMatch: NewMatch): Promise<Match[]> {
    return await getDrizzleDb().insert(match).values(newMatch).returning();
  },

  async deleteMatch(id: number): Promise<void> {
    await getDrizzleDb().delete(match).where(eq(match.id, id));
  },

  async updateScore(id: number, score1: number, score2: number): Promise<void> {
    await getDrizzleDb()
      .update(match)
      .set({ score1, score2 })
      .where(eq(match.id, id));
  },
};

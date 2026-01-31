import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { Match, match, NewMatch } from '@/db/schema/match';
import { equipe, terrains, tournoi } from '@/db/schema';

export const MatchsRepository = {
  async getAllMatchs(): Promise<Match[]> {
    return await getDrizzleDb().select().from(match);
  },

  getAllMatchsV2() {
    return getDrizzleDb().select().from(match);
  },

  async getMatch(id: number): Promise<Match> {
    const res = await getDrizzleDb()
      .select()
      .from(match)
      .where(eq(match.id, id));
    return res[0];
  },

  getFullMatchV2(id: number) {
    return getDrizzleDb()
      .select()
      .from(match)
      .where(eq(match.id, id))
      .innerJoin(tournoi, eq(match.tournoiId, tournoi.id))
      .innerJoin(equipe, eq(match.equipe1, equipe.id))
      .innerJoin(equipe, eq(match.equipe2, equipe.id))
      .innerJoin(terrains, eq(match.terrainId, terrains.id));
  },

  async insertMatch(newMatch: NewMatch): Promise<Match[]> {
    return await getDrizzleDb().insert(match).values(newMatch).returning();
  },

  insertMatchV2(newMatch: NewMatch) {
    return getDrizzleDb().insert(match).values(newMatch).returning();
  },

  async deleteMatch(id: number): Promise<void> {
    await getDrizzleDb().delete(match).where(eq(match.id, id));
  },

  deleteMatchV2(id: number) {
    return getDrizzleDb().delete(match).where(eq(match.id, id));
  },

  async updateScore(id: number, score1: number, score2: number): Promise<void> {
    await getDrizzleDb()
      .update(match)
      .set({ score1, score2 })
      .where(eq(match.id, id));
  },

  updateScoreV2(id: number, score1: number, score2: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1, score2 })
      .where(eq(match.id, id));
  },

  async resetScore(id: number): Promise<void> {
    await getDrizzleDb()
      .update(match)
      .set({ score1: null, score2: null })
      .where(eq(match.id, id));
  },

  resetScoreV2(id: number) {
    return getDrizzleDb()
      .update(match)
      .set({ score1: null, score2: null })
      .where(eq(match.id, id));
  },
};

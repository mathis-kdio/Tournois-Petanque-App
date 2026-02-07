import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { NewTournoi, Tournoi, tournoi } from '@/db/schema/tournoi';

export const TournoisRepository = {
  async getAllTournois(): Promise<Tournoi[]> {
    const a = await getDrizzleDb().select().from(tournoi);
    return a;
  },

  getAllTournoisV2() {
    return getDrizzleDb().select().from(tournoi);
  },

  async getTournoi(): Promise<Tournoi | undefined> {
    const result = await getDrizzleDb().select().from(tournoi);
    return result[0];
  },

  getTournoiV2() {
    return getDrizzleDb().select().from(tournoi);
  },

  async insertTournoi(newTournoi: NewTournoi): Promise<Tournoi[]> {
    return await getDrizzleDb().insert(tournoi).values(newTournoi).returning();
  },

  async deleteTournoi(id: number): Promise<void> {
    await getDrizzleDb().delete(tournoi).where(eq(tournoi.id, id));
  },

  deleteTournoiV2(id: number) {
    return getDrizzleDb().delete(tournoi).where(eq(tournoi.id, id));
  },

  async renameTournoi(id: number, name: string): Promise<void> {
    await getDrizzleDb()
      .update(tournoi)
      .set({ name })
      .where(eq(tournoi.id, id));
  },

  async renameTournoiV2(id: number, name: string) {
    return await getDrizzleDb()
      .update(tournoi)
      .set({ name })
      .where(eq(tournoi.id, id));
  },
};

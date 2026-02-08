import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { desc, eq } from 'drizzle-orm';
import { NewTournoi, tournoi } from '@/db/schema/tournoi';

export const TournoisRepository = {
  getAllTournois() {
    return getDrizzleDb().select().from(tournoi);
  },

  getTournoi() {
    return getDrizzleDb().select().from(tournoi).orderBy(desc(tournoi.id));
  },

  insertTournoi(newTournoi: NewTournoi) {
    return getDrizzleDb().insert(tournoi).values(newTournoi).returning();
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

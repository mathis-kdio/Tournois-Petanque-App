import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { NewTournoi, Tournoi, tournoi } from '@/db/schema/tournoi';

export const TournoisRepository = {
  async getAllTournois(): Promise<Tournoi[]> {
    console.log(getDrizzleDb())
    const a = await getDrizzleDb().select().from(tournoi);
    console.log(a)
    return a;
  },

  async getTournoi(): Promise<Tournoi> {
    const result = await getDrizzleDb().select().from(tournoi);
    return result[0];
  },

  async insertTournoi(newTournoi: NewTournoi): Promise<Tournoi[]> {
    return await getDrizzleDb().insert(tournoi).values(newTournoi).returning();
  },

  async deleteTournoi(id: number): Promise<void> {
    await getDrizzleDb().delete(tournoi).where(eq(tournoi.id, id));
  },

  async renameTournoi(id: number, name: string): Promise<void> {
    await getDrizzleDb()
      .update(tournoi)
      .set({ name })
      .where(eq(tournoi.id, id));
  },
};

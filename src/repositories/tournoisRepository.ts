import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { NewTournoi, Tournoi, tournoi } from '@/db/schema/tournoi';
import { TournoiModel } from '@/types/interfaces/tournoi';

function formatListesJoueurs(lJ: Tournoi): TournoiModel {
  return {
    tournoiId: lJ.id,
    name: lJ.name || undefined,
    creationDate: lJ.updatedAt,
    updateDate: lJ.updatedAt,
    tournoi: lJ.updatedAt,
  };
}

export const TournoisRepository = {
  async getAllTournois(): Promise<TournoiModel[]> {
    const result = await getDrizzleDb().select().from(tournoi);
    return result.map(formatListesJoueurs);
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

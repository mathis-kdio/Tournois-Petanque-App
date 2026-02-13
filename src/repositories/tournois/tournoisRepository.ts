import { NewTournoi, tournoi } from '@/db/schema/tournoi';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { desc, eq } from 'drizzle-orm';

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

  deleteTournoi(id: number) {
    return getDrizzleDb().delete(tournoi).where(eq(tournoi.id, id));
  },

  renameTournoi(id: number, name: string) {
    return getDrizzleDb()
      .update(tournoi)
      .set({ name })
      .where(eq(tournoi.id, id));
  },
};

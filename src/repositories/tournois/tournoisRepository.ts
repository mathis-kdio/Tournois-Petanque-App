import { NewTournoi, tournoi } from '@/db/schema/tournoi';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { desc, eq } from 'drizzle-orm';

export const TournoisRepository = {
  getAllTournois() {
    return getDrizzleDb()
      .select()
      .from(tournoi)
      .where(eq(tournoi.deleted, false));
  },

  getTournois() {
    return getDrizzleDb()
      .select()
      .from(tournoi)
      .where(eq(tournoi.deleted, false))
      .orderBy(desc(tournoi.id));
  },

  insertTournoi(newTournoi: NewTournoi) {
    return getDrizzleDb()
      .insert(tournoi)
      .values({ ...newTournoi, id: uuidv7(), ...stampForSync() })
      .returning();
  },

  deleteTournoi(id: string) {
    return getDrizzleDb()
      .update(tournoi)
      .set(stampForDelete())
      .where(eq(tournoi.id, id));
  },

  deleteAll() {
    return getDrizzleDb().delete(tournoi);
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(tournoi)
      .set(stampForDelete())
      .where(eq(tournoi.deleted, false));
  },

  setActualTournoi(id: string, estTournoiActuel: boolean) {
    return getDrizzleDb()
      .update(tournoi)
      .set({ estTournoiActuel, ...stampForSync() })
      .where(eq(tournoi.id, id));
  },

  renameTournoi(id: string, name: string) {
    return getDrizzleDb()
      .update(tournoi)
      .set({ name, ...stampForSync() })
      .where(eq(tournoi.id, id));
  },
};

import { listesJoueurs, NewListesJoueurs } from '@/db/schema/listesJoueurs';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

export const ListesJoueursRepository = {
  getAllListesJoueurs() {
    return getDrizzleDb().select().from(listesJoueurs);
  },

  insertListeJoueurs(newListesJoueurs: NewListesJoueurs) {
    return getDrizzleDb()
      .insert(listesJoueurs)
      .values(newListesJoueurs)
      .returning();
  },

  deleteListeJoueurs(id: number) {
    return getDrizzleDb().delete(listesJoueurs).where(eq(listesJoueurs.id, id));
  },

  renameListeJoueurs(id: number, name: string) {
    return getDrizzleDb()
      .update(listesJoueurs)
      .set({ name })
      .where(eq(listesJoueurs.id, id));
  },
};

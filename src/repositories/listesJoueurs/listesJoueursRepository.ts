import { listesJoueurs, NewListesJoueurs } from '@/db/schema/listesJoueurs';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { eq } from 'drizzle-orm';

export const ListesJoueursRepository = {
  getAllListesJoueurs() {
    return getDrizzleDb()
      .select()
      .from(listesJoueurs)
      .where(eq(listesJoueurs.deleted, false));
  },

  insertListeJoueurs(newListesJoueurs: Omit<NewListesJoueurs, 'id'>) {
    return getDrizzleDb()
      .insert(listesJoueurs)
      .values({ ...newListesJoueurs, id: uuidv7(), ...stampForSync() })
      .returning();
  },

  deleteListeJoueurs(id: string) {
    return getDrizzleDb()
      .update(listesJoueurs)
      .set(stampForDelete())
      .where(eq(listesJoueurs.id, id));
  },

  renameListeJoueurs(id: string, name: string) {
    return getDrizzleDb()
      .update(listesJoueurs)
      .set({ name, ...stampForSync() })
      .where(eq(listesJoueurs.id, id));
  },

  deleteAll() {
    return getDrizzleDb().delete(listesJoueurs);
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(listesJoueurs)
      .set(stampForDelete())
      .where(eq(listesJoueurs.deleted, false));
  },
};

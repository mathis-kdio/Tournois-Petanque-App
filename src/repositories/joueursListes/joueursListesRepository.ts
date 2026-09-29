import { joueursListes, NewJoueursListes } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { and, eq } from 'drizzle-orm';

export const JoueursListesRepository = {
  insert(newJoueursListes: NewJoueursListes) {
    return getDrizzleDb()
      .insert(joueursListes)
      .values({ ...newJoueursListes, id: uuidv7(), ...stampForSync() });
  },

  insertMultiple(newJoueursListes: NewJoueursListes[]) {
    const now = new Date();
    const values = newJoueursListes.map((j) => ({
      ...j,
      id: uuidv7(),
      updatedAt: now,
      synced: false,
    }));
    return getDrizzleDb().insert(joueursListes).values(values);
  },

  getInList(listeId: string) {
    return getDrizzleDb()
      .select()
      .from(joueursListes)
      .where(
        and(
          eq(joueursListes.listeId, listeId),
          eq(joueursListes.deleted, false),
        ),
      );
  },

  removeJoueurId(joueurId: string) {
    return getDrizzleDb()
      .update(joueursListes)
      .set(stampForDelete())
      .where(eq(joueursListes.joueurId, joueurId));
  },

  removeAllInList(listeId: string) {
    return getDrizzleDb()
      .update(joueursListes)
      .set(stampForDelete())
      .where(eq(joueursListes.listeId, listeId));
  },

  deleteAll() {
    return getDrizzleDb().delete(joueursListes);
  },
};

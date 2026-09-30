import { joueursListes, NewJoueursListes } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { and, eq } from 'drizzle-orm';

export const JoueursListesRepository = {
  insert(newJoueursListes: NewJoueursListes) {
    return getDrizzleDb()
      .insert(joueursListes)
      .values({ ...newJoueursListes, ...stampForSync() });
  },

  insertMultiple(newJoueursListes: NewJoueursListes[]) {
    const values = newJoueursListes.map((j) => ({
      ...j,
      ...stampForSync(),
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

  softDeleteAll() {
    return getDrizzleDb()
      .update(joueursListes)
      .set(stampForDelete())
      .where(eq(joueursListes.deleted, false));
  },
};

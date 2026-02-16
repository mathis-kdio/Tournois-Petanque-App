import { joueursListes, NewJoueursListes } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

export const JoueursListesRepository = {
  insert(newJoueursListes: NewJoueursListes) {
    return getDrizzleDb().insert(joueursListes).values(newJoueursListes);
  },

  getInList(listeId: number) {
    return getDrizzleDb()
      .select()
      .from(joueursListes)
      .where(eq(joueursListes.listeId, listeId));
  },

  removeJoueurId(joueurId: number) {
    return getDrizzleDb()
      .delete(joueursListes)
      .where(eq(joueursListes.joueurId, joueurId));
  },

  removeAllInList(listeId: number) {
    return getDrizzleDb()
      .delete(joueursListes)
      .where(eq(joueursListes.listeId, listeId));
  },

  deleteAll() {
    return getDrizzleDb().delete(joueursListes);
  },
};

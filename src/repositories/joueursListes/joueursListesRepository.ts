import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { joueursListes, NewJoueursListes } from '@/db/schema';

export const JoueursListesRepository = {
  insert(newJoueursListes: NewJoueursListes[]) {
    return getDrizzleDb().insert(joueursListes).values(newJoueursListes);
  },
};

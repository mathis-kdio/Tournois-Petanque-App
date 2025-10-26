import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { joueursListes, NewJoueursListes } from '@/db/schema';

export function saveJoueursListes(newJoueursListes: NewJoueursListes[]): void {
  getDrizzleDb().insert(joueursListes).values(newJoueursListes);
}

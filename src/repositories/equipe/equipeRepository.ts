import { Equipe, equipe, NewEquipe } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { inArray } from 'drizzle-orm';

export const EquipeRepository = {
  async insert(newEquipe: NewEquipe): Promise<Equipe> {
    return (
      await getDrizzleDb().insert(equipe).values(newEquipe).returning()
    )[0];
  },

  delete(idlist: number[]) {
    return getDrizzleDb().delete(equipe).where(inArray(equipe.id, idlist));
  },

  deleteAll() {
    return getDrizzleDb().delete(equipe);
  },
};

import { Equipe, equipe, NewEquipe } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';

export const EquipeRepository = {
  async insert(newEquipe: NewEquipe): Promise<Equipe> {
    return (
      await getDrizzleDb().insert(equipe).values(newEquipe).returning()
    )[0];
  },
};

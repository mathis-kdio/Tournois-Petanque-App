import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { Equipe, equipe, NewEquipe } from '@/db/schema';

export const EquipeRepository = {
  async insert(newEquipe: NewEquipe): Promise<Equipe> {
    return (
      await getDrizzleDb().insert(equipe).values(newEquipe).returning()
    )[0];
  },
};

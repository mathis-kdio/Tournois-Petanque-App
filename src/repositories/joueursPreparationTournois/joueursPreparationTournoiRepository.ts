import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  joueursPreparationTournois,
  JoueursPreparationTournois,
} from '@/db/schema/joueursPreparationTournois';

export const JoueursPreparationTournoisRepository = {
  async getPreparationTournoi(): Promise<JoueursPreparationTournois[]> {
    return await getDrizzleDb().select().from(joueursPreparationTournois);
  },
};

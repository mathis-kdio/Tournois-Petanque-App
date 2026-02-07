import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  NewPreparationTournoi,
  preparationTournoi,
} from '@/db/schema/preparationTournoi';

export const PreparationTournoisRepository = {
  getPreparationTournoi() {
    return getDrizzleDb().select().from(preparationTournoi);
  },

  async updatePreparationTournoi(
    updatedPreparationTournoi: NewPreparationTournoi,
  ): Promise<void> {
    await getDrizzleDb()
      .insert(preparationTournoi)
      .values(updatedPreparationTournoi)
      .onConflictDoUpdate({
        target: preparationTournoi.id,
        set: updatedPreparationTournoi,
      });
  },
};

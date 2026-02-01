import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  NewPreparationTournoi,
  preparationTournoi,
  PreparationTournoi,
} from '@/db/schema/preparationTournoi';

export const PreparationTournoisRepository = {
  getPreparationTournoi() {
    return getDrizzleDb().select().from(preparationTournoi);
  },

  async insertPreparationTournoi(
    newPreparationTournoi: NewPreparationTournoi,
  ): Promise<PreparationTournoi[]> {
    return await getDrizzleDb()
      .insert(preparationTournoi)
      .values(newPreparationTournoi)
      .returning();
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

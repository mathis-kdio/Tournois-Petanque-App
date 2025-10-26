import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  NewPreparationTournoi,
  preparationTournoi,
  PreparationTournoi,
} from '@/db/schema/preparationTournoi';

export const PreparationTournoisRepository = {
  async getPreparationTournoi(): Promise<PreparationTournoi> {
    const result = await getDrizzleDb().select().from(preparationTournoi);
    return result[0];
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
    updatedPreparationTournoi: PreparationTournoi,
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

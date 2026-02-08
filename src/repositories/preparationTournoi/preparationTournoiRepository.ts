import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  NewPreparationTournoi,
  preparationTournoi,
} from '@/db/schema/preparationTournoi';
import { eq } from 'drizzle-orm';

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

  delete() {
    return getDrizzleDb()
      .delete(preparationTournoi)
      .where(eq(preparationTournoi.id, 0));
  },
};

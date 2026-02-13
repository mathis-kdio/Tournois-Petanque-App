import {
  NewPreparationTournoi,
  preparationTournoi,
} from '@/db/schema/preparationTournoi';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

export const PreparationTournoisRepository = {
  getPreparationTournoi() {
    return getDrizzleDb().select().from(preparationTournoi);
  },

  updatePreparationTournoi(updatedPreparationTournoi: NewPreparationTournoi) {
    return getDrizzleDb()
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

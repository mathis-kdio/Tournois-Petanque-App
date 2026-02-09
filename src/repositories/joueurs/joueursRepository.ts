import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { joueurs, NewJoueur } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const JoueursRepository = {
  async insert(newJoueur: NewJoueur) {
    const result = (
      await getDrizzleDb().insert(joueurs).values(newJoueur).returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  delete(joueurIds: number[]) {
    return getDrizzleDb().delete(joueurs).where(inArray(joueurs.id, joueurIds));
  },

  updateName(id: number, name: string) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ name })
      .where(eq(joueurs.id, id));
  },

  updateCheck(id: number, isChecked: boolean) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ isChecked })
      .where(eq(joueurs.id, id));
  },

  async select(joueurId: number) {
    const result = (
      await getDrizzleDb()
        .select()
        .from(joueurs)
        .where(eq(joueurs.joueurId, joueurId))
    ).at(0);
    if (!result) {
      throw new Error('Joueur not found');
    }
    return result;
  },
};

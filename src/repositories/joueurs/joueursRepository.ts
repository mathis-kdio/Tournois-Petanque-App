import { equipesJoueurs, joueurs, NewJoueur } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
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

  insertMultiples(newJoueurs: NewJoueur[]) {
    return getDrizzleDb().insert(joueurs).values(newJoueurs).returning();
  },

  delete(id: number[]) {
    return getDrizzleDb().delete(joueurs).where(inArray(joueurs.id, id));
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

  async select(uniqueBDDId: number) {
    const result = (
      await getDrizzleDb()
        .select()
        .from(joueurs)
        .where(eq(joueurs.id, uniqueBDDId))
    ).at(0);
    if (!result) {
      throw new Error('Joueur not found');
    }
    return result;
  },

  getEquipes(equipeIds: number[]) {
    return getDrizzleDb()
      .select()
      .from(joueurs)
      .where(inArray(equipesJoueurs.equipeId, equipeIds))
      .innerJoin(equipesJoueurs, eq(equipesJoueurs.joueurId, joueurs.id));
  },
};

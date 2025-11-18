import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { Joueur, joueurs, NewJoueur } from '@/db/schema';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { eq, inArray } from 'drizzle-orm';

export const JoueursRepository = {
  toNewJoueur(joueur: JoueurModel): NewJoueur {
    return {
      joueurId: joueur.id,
      name: joueur.name,
      type: joueur.type,
      equipe: joueur.equipe,
      isChecked: joueur.isChecked,
    };
  },

  toJoueurModel(joueur: Joueur): JoueurModel {
    return {
      id: joueur.joueurId,
      name: joueur.name,
      type: joueur.type ?? undefined,
      equipe: joueur.equipe ?? undefined,
      isChecked: false,
    };
  },

  async insert(newJoueur: NewJoueur): Promise<Joueur> {
    const result = (
      await getDrizzleDb().insert(joueurs).values(newJoueur).returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  async delete(joueurIds: number[]): Promise<void> {
    await getDrizzleDb().delete(joueurs).where(inArray(joueurs.id, joueurIds));
  },

  async updateName(id: number, name: string): Promise<void> {
    await getDrizzleDb()
      .update(joueurs)
      .set({ name })
      .where(eq(joueurs.id, id));
  },

  async updateCheck(id: number, isChecked: boolean): Promise<void> {
    await getDrizzleDb()
      .update(joueurs)
      .set({ isChecked })
      .where(eq(joueurs.id, id));
  },

  async select(joueurId: number): Promise<Joueur> {
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

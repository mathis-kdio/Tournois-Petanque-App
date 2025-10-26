import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { Joueur, joueurs, NewJoueur } from '@/db/schema';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { inArray } from 'drizzle-orm';

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
};

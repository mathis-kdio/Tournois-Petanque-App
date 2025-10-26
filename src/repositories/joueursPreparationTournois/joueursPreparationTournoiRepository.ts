import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  joueursPreparationTournois,
  JoueursPreparationTournois,
  NewJoueursPreparationTournois,
} from '@/db/schema/joueursPreparationTournois';
import { Joueur, joueurs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type JoueursPreparationTournoisWithJoueur = {
  joueurs_prepration_tournois: JoueursPreparationTournois;
  joueurs: Joueur;
};

export const JoueursPreparationTournoisRepository = {
  async getJoueursPreparationTournoi(
    preparationTournoiId: number,
  ): Promise<JoueursPreparationTournoisWithJoueur[]> {
    const a = await getDrizzleDb()
      .select()
      .from(joueursPreparationTournois)
      .innerJoin(joueurs, eq(joueursPreparationTournois.id, joueurs.joueurId))
      .where(
        eq(
          joueursPreparationTournois.preparationTournoiId,
          preparationTournoiId,
        ),
      );
    console.log(a);
    return a;
  },

  async insert(
    newJoueursPreparationTournois: NewJoueursPreparationTournois,
  ): Promise<void> {
    await getDrizzleDb()
      .insert(joueursPreparationTournois)
      .values(newJoueursPreparationTournois);
  },
};

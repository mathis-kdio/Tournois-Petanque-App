import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  joueursPreparationTournois,
  JoueursPreparationTournois,
  NewJoueursPreparationTournois,
} from '@/db/schema/joueursPreparationTournois';
import { Joueur, joueurs } from '@/db/schema';
import { eq, inArray, sql } from 'drizzle-orm';

export type JoueursPreparationTournoisWithJoueur = {
  joueurs_prepration_tournois: JoueursPreparationTournois;
  joueurs: Joueur;
};

export const JoueursPreparationTournoisRepository = {
  getEmpty() {
    return getDrizzleDb()
      .select()
      .from(joueursPreparationTournois)
      .where(sql`1 = 0`);
  },

  getMany(preparationTournoiId?: number) {
    return getDrizzleDb()
      .select()
      .from(joueursPreparationTournois)
      .innerJoin(joueurs, eq(joueursPreparationTournois.joueurId, joueurs.id))
      .where(
        preparationTournoiId
          ? eq(
            joueursPreparationTournois.preparationTournoiId,
            preparationTournoiId,
          )
          : sql`0 = 1`,
      );
  },

  async insert(
    newJoueursPreparationTournois: NewJoueursPreparationTournois,
  ): Promise<void> {
    await getDrizzleDb()
      .insert(joueursPreparationTournois)
      .values(newJoueursPreparationTournois);
  },

  async delete(joueurIds: number[]): Promise<void> {
    await getDrizzleDb()
      .delete(joueursPreparationTournois)
      .where(inArray(joueursPreparationTournois.joueurId, joueurIds));
  },

  async deleteAll(): Promise<void> {
    await getDrizzleDb()
      .delete(joueursPreparationTournois)
      .where(eq(joueursPreparationTournois.preparationTournoiId, 0));
  },
};

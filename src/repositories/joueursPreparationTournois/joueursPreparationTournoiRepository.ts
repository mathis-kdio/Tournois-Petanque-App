import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  joueursPreparationTournois,
  JoueursPreparationTournois,
  NewJoueursPreparationTournois,
} from '@/db/schema/joueursPreparationTournois';
import { Joueur, joueurs } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export type JoueursPreparationTournoisWithJoueur = {
  joueurs_preparation_tournois: JoueursPreparationTournois;
  joueurs: Joueur;
};

export const JoueursPreparationTournoisRepository = {
  getMany() {
    return getDrizzleDb()
      .select()
      .from(joueursPreparationTournois)
      .innerJoin(joueurs, eq(joueursPreparationTournois.joueurId, joueurs.id))
      .where(eq(joueursPreparationTournois.preparationTournoiId, 0));
  },

  insert(newJoueursPreparationTournois: NewJoueursPreparationTournois) {
    return getDrizzleDb()
      .insert(joueursPreparationTournois)
      .values(newJoueursPreparationTournois);
  },

  delete(joueurIds: number[]) {
    return getDrizzleDb()
      .delete(joueursPreparationTournois)
      .where(inArray(joueursPreparationTournois.joueurId, joueurIds));
  },

  deleteAll() {
    return getDrizzleDb()
      .delete(joueursPreparationTournois)
      .where(eq(joueursPreparationTournois.preparationTournoiId, 0));
  },
};

import { Joueur, joueurs } from '@/db/schema';
import {
  joueursPreparationTournois,
  JoueursPreparationTournois,
  NewJoueursPreparationTournois,
} from '@/db/schema/joueursPreparationTournois';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { and, eq, inArray } from 'drizzle-orm';

export type JoueursPreparationTournoisWithJoueur = {
  joueurs_preparation_tournois: JoueursPreparationTournois;
  joueurs: Joueur;
};

export const JoueursPreparationTournoisRepository = {
  getAll() {
    return getDrizzleDb()
      .select()
      .from(joueursPreparationTournois)
      .where(eq(joueursPreparationTournois.deleted, false));
  },

  getMany() {
    return getDrizzleDb()
      .select({
        equipe: joueurs.equipe,
        id: joueurs.id,
        isChecked: joueurs.isChecked,
        joueurId: joueurs.joueurId,
        name: joueurs.name,
        type: joueurs.type,
      })
      .from(joueursPreparationTournois)
      .innerJoin(joueurs, eq(joueursPreparationTournois.joueurId, joueurs.id))
      .where(
        and(
          eq(joueursPreparationTournois.deleted, false),
          eq(joueurs.deleted, false),
        ),
      );
  },

  insert(newJoueursPreparationTournois: NewJoueursPreparationTournois[]) {
    const now = new Date();
    const values = newJoueursPreparationTournois.map((j) => ({
      ...j,
      id: uuidv7(),
      updatedAt: now,
      synced: false,
    }));
    return getDrizzleDb().insert(joueursPreparationTournois).values(values);
  },

  delete(joueurIds: string[]) {
    return getDrizzleDb()
      .update(joueursPreparationTournois)
      .set(stampForDelete())
      .where(inArray(joueursPreparationTournois.joueurId, joueurIds));
  },

  deleteAll() {
    return getDrizzleDb()
      .update(joueursPreparationTournois)
      .set(stampForDelete());
  },
};

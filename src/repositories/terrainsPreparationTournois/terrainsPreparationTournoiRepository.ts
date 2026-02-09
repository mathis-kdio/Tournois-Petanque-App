import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { Joueur } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  NewTerrainsPreparationTournois,
  terrainsPreparationTournois,
  TerrainsPreparationTournois,
} from '@/db/schema/terrainsPreparationTournoi';

export type TerrainsPreparationTournoisWithJoueur = {
  terrains_preparation_tournois: TerrainsPreparationTournois;
  terrains: Joueur;
};

export const TerrainsPreparationTournoisRepository = {
  getIdsInPreparation(preparationId: number) {
    return getDrizzleDb()
      .select({ terrainId: terrainsPreparationTournois.terrainId })
      .from(terrainsPreparationTournois)
      .where(
        eq(terrainsPreparationTournois.preparationTournoiId, preparationId),
      );
  },

  insert(newTerrainsPreparationTournois: NewTerrainsPreparationTournois) {
    return getDrizzleDb()
      .insert(terrainsPreparationTournois)
      .values(newTerrainsPreparationTournois);
  },

  delete(terrainId: number) {
    return getDrizzleDb()
      .delete(terrainsPreparationTournois)
      .where(eq(terrainsPreparationTournois.terrainId, terrainId));
  },

  deleteAll() {
    return getDrizzleDb()
      .delete(terrainsPreparationTournois)
      .where(eq(terrainsPreparationTournois.preparationTournoiId, 0));
  },
};

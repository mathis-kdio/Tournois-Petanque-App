import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { Joueur, terrains } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
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
  getMany() {
    return getDrizzleDb()
      .select()
      .from(terrainsPreparationTournois)
      .innerJoin(
        terrains,
        eq(terrainsPreparationTournois.terrainId, terrains.id),
      )
      .where(eq(terrainsPreparationTournois.preparationTournoiId, 0));
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
};

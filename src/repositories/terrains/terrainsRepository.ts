import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';
import { NewTerrain, Terrain, terrains } from '@/db/schema';

export const TerrainsRepository = {
  async getTerrains(): Promise<Terrain[]> {
    const result = await getDrizzleDb().select().from(terrains);
    return result;
  },

  async insertTerrains(terrain: NewTerrain): Promise<Terrain[]> {
    return await getDrizzleDb().insert(terrains).values(terrain).returning();
  },

  async updateTerrain(terrain: Terrain): Promise<void> {
    await getDrizzleDb()
      .update(terrains)
      .set(terrain)
      .where(eq(terrains.id, terrain.id));
  },
};

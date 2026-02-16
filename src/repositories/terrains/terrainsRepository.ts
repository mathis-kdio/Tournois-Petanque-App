import { NewTerrain, terrains } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

export const TerrainsRepository = {
  getAll() {
    return getDrizzleDb().select().from(terrains);
  },

  async insert(terrain: NewTerrain) {
    const result = (
      await getDrizzleDb().insert(terrains).values(terrain).returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  delete(terrainId: number) {
    return getDrizzleDb().delete(terrains).where(eq(terrains.id, terrainId));
  },

  deleteAll() {
    return getDrizzleDb().delete(terrains);
  },

  rename(terrainId: number, name: string) {
    return getDrizzleDb()
      .update(terrains)
      .set({ name })
      .where(eq(terrains.id, terrainId));
  },
};

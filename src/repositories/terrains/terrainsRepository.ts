import { NewTerrain, terrains } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { eq, inArray } from 'drizzle-orm';

export const TerrainsRepository = {
  getAll() {
    return getDrizzleDb()
      .select()
      .from(terrains)
      .where(eq(terrains.deleted, false));
  },

  async insert(terrain: NewTerrain) {
    const result = (
      await getDrizzleDb()
        .insert(terrains)
        .values({ ...terrain, id: uuidv7(), ...stampForSync() })
        .returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  delete(idlist: string[]) {
    return getDrizzleDb()
      .update(terrains)
      .set(stampForDelete())
      .where(inArray(terrains.id, idlist));
  },

  deleteAll() {
    return getDrizzleDb().delete(terrains);
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(terrains)
      .set(stampForDelete())
      .where(eq(terrains.deleted, false));
  },

  rename(terrainId: string, name: string) {
    return getDrizzleDb()
      .update(terrains)
      .set({ name, ...stampForSync() })
      .where(eq(terrains.id, terrainId));
  },
};

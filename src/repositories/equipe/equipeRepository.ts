import { Equipe, equipe, NewEquipe } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { eq, inArray } from 'drizzle-orm';

export const EquipeRepository = {
  async insert(newEquipe: NewEquipe): Promise<Equipe> {
    return (
      await getDrizzleDb()
        .insert(equipe)
        .values({ ...newEquipe, id: uuidv7(), ...stampForSync() })
        .returning()
    )[0];
  },

  delete(idlist: string[]) {
    return getDrizzleDb()
      .update(equipe)
      .set(stampForDelete())
      .where(inArray(equipe.id, idlist));
  },

  deleteAll() {
    return getDrizzleDb().delete(equipe);
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(equipe)
      .set(stampForDelete())
      .where(eq(equipe.deleted, false));
  },
};

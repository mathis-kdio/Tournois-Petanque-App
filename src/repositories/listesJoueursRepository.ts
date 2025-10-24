import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import {
  ListesJoueurs,
  listesJoueurs,
  NewListesJoueurs,
} from '@/db/schema/listesJoueurs';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

function formatListesJoueurs(lJ: ListesJoueurs): ListeJoueursInfos {
  return {
    listId: lJ.id,
    name: lJ.name,
  };
}

export const ListesJoueursRepository = {
  async getAllListesJoueurs(): Promise<ListeJoueursInfos[]> {
    const result = await getDrizzleDb().select().from(listesJoueurs);
    return result.map(formatListesJoueurs);
  },

  async insertListeJoueurs(
    newListesJoueurs: NewListesJoueurs,
  ): Promise<ListesJoueurs[]> {
    return await getDrizzleDb()
      .insert(listesJoueurs)
      .values(newListesJoueurs)
      .returning();
  },

  async deleteListeJoueurs(id: number): Promise<void> {
    await getDrizzleDb().delete(listesJoueurs).where(eq(listesJoueurs.id, id));
  },

  async renameListeJoueurs(id: number, name: string): Promise<void> {
    await getDrizzleDb()
      .update(listesJoueurs)
      .set({ name })
      .where(eq(listesJoueurs.id, id));
  },
};

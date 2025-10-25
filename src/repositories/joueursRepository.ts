import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { joueurs, NewJoueur } from '@/db/schema';

export async function saveJoueurs(
  newJoueur: NewJoueur[],
): Promise<NewJoueur[]> {
  return await getDrizzleDb().insert(joueurs).values(newJoueur).returning();
}

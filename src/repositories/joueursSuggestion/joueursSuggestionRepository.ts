import { joueursSuggestion, NewJoueursSuggestion } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { desc, eq, sql } from 'drizzle-orm';

export const JoueursSuggestionRepository = {
  get() {
    return getDrizzleDb()
      .select()
      .from(joueursSuggestion)
      .where(eq(joueursSuggestion.cacher, false))
      .orderBy(desc(joueursSuggestion.occurence));
  },

  insertOrUpdateOccurence(newJoueursSuggestion: NewJoueursSuggestion) {
    return getDrizzleDb()
      .insert(joueursSuggestion)
      .values(newJoueursSuggestion)
      .onConflictDoUpdate({
        target: joueursSuggestion.name,
        set: { occurence: sql`${joueursSuggestion.occurence} + 1` },
      });
  },

  cacherSuggestion(id: number) {
    return getDrizzleDb()
      .update(joueursSuggestion)
      .set({ cacher: true })
      .where(eq(joueursSuggestion.id, id));
  },

  deleteAll() {
    return getDrizzleDb().delete(joueursSuggestion);
  },
};

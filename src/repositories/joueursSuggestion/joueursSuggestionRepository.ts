import { joueursSuggestion, NewJoueursSuggestion } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { and, desc, eq, sql } from 'drizzle-orm';

export const JoueursSuggestionRepository = {
  get() {
    return getDrizzleDb()
      .select()
      .from(joueursSuggestion)
      .where(
        and(
          eq(joueursSuggestion.cacher, false),
          eq(joueursSuggestion.deleted, false),
        ),
      )
      .orderBy(desc(joueursSuggestion.occurence));
  },

  insertOrUpdateOccurence(newJoueursSuggestion: NewJoueursSuggestion) {
    // Un seul stamp (et donc une seule notification) partagé par les deux branches.
    const stamp = stampForSync();
    return getDrizzleDb()
      .insert(joueursSuggestion)
      .values({ ...newJoueursSuggestion, ...stamp })
      .onConflictDoUpdate({
        target: joueursSuggestion.name,
        set: {
          occurence: sql`${joueursSuggestion.occurence} + 1`,
          ...stamp,
        },
      });
  },

  cacherSuggestion(id: string) {
    return getDrizzleDb()
      .update(joueursSuggestion)
      .set({ cacher: true, ...stampForSync() })
      .where(eq(joueursSuggestion.id, id));
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(joueursSuggestion)
      .set(stampForDelete())
      .where(eq(joueursSuggestion.deleted, false));
  },
};

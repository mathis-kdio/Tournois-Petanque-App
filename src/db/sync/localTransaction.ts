/**
 * Transactions internes à la synchronisation (pull, purges).
 *
 * Le miroir Supabase n'a pas de contraintes FK entre les tables miroir :
 * une ligne enfant peut y exister sans son parent (tombstone purgée,
 * parent poussé sans ses enfants, etc.). L'application locale de l'état
 * distant — source de vérité — ne doit donc pas être bloquée par les FK
 * SQLite : elles sont désactivées le temps de l'écriture, puis réactivées.
 *
 * Les écritures UI passent toujours par les repositories, hors de ces
 * helpers — les FK restent actives pour elles.
 */

import { sql } from 'drizzle-orm';

/**
 * Connexion Drizzle (expo-sqlite natif ou proxy web). `run` retourne un
 * résultat synchrone côté natif et une Promise sur le proxy web — les
 * deux sont `await`ables, on type donc largement.
 */
type DbLike = { run: (...args: any[]) => any };

/**
 * Exécute `fn` avec les contraintes FK désactivées, puis les réactive
 * quoi qu'il arrive (finally). Le PRAGMA est appliqué hors transaction :
 * c'est un no-op à l'intérieur d'une transaction SQLite.
 */
export async function withForeignKeysDisabled<T>(
  db: DbLike,
  fn: () => Promise<T>,
): Promise<T> {
  await db.run(sql`PRAGMA foreign_keys = OFF`);
  try {
    return await fn();
  } finally {
    try {
      await db.run(sql`PRAGMA foreign_keys = ON`);
    } catch {
      // La réouverture de la base réactivera les FK (défaut expo-sqlite).
    }
  }
}

/**
 * Exécute `fn` dans une transaction SQLite unique (BEGIN/COMMIT), avec
 * les FK désactivées. En cas d'erreur : ROLLBACK puis réactivation des
 * FK — jamais de PRAGMA à l'intérieur d'une transaction ouverte.
 */
export async function runInBulkTransaction<T>(
  db: DbLike,
  fn: () => Promise<T>,
): Promise<T> {
  return withForeignKeysDisabled(db, async () => {
    await db.run(sql`BEGIN`);
    try {
      const result = await fn();
      await db.run(sql`COMMIT`);
      return result;
    } catch (err) {
      try {
        await db.run(sql`ROLLBACK`);
      } catch {
        // La transaction est déjà fermée — rien à annuler.
      }
      throw err;
    }
  });
}

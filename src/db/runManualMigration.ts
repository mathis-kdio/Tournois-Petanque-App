import { SQLiteDatabase } from 'expo-sqlite';
import migrationFile from '../../drizzle/20260420212648_tiny_molten_man/migration.sql';

export default async function runManualMigration(
  db: SQLiteDatabase,
): Promise<SQLiteDatabase> {
  // 1. On découpe le fichier selon le séparateur de Drizzle
  const statements = migrationFile.split('--> statement-breakpoint');

  // 2. On exécute tout dans une transaction pour garantir la cohérence
  await db.withTransactionAsync(async () => {
    await db.execAsync('PRAGMA foreign_keys = OFF;');

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed.length > 0) {
        try {
          await db.execAsync(trimmed);
        } catch (e: any) {
          // On vérifie si l'erreur concerne une table déjà existante
          if (e.message.includes('already exists')) {
            console.log(
              'Table déjà présente, on ignore :',
              trimmed.substring(0, 30) + '...',
            );
          } else {
            // Si c'est une autre erreur (syntaxe, etc.), on relance l'erreur
            console.error('Erreur critique sur :', trimmed);
            throw e;
          }
        }
      }
    }

    await db.execAsync('PRAGMA foreign_keys = ON;');
  });

  console.log('Migration manuelle terminée avec succès.');
  return db;
}

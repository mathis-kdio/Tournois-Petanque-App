import { SQLiteDatabase } from 'expo-sqlite';
import migrations from '../../drizzle/migrations';

export default async function runManualMigration(db: SQLiteDatabase) {
  // 1. Initialiser la table de suivi des migrations si elle n'existe pas
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "hash" TEXT NOT NULL,
      "created_at" INTEGER
    );
  `);

  // 2. Récupérer les migrations déjà exécutées en base
  const executedMigrations = await db.getAllAsync<{ hash: string }>(
    'SELECT hash FROM "__drizzle_migrations";',
  );
  const executedHashes = new Set(executedMigrations.map((m) => m.hash));

  // 3. Récupérer la liste des migrations disponibles directement depuis l'objet
  // On cible "migrations.migrations" qui contient vos fichiers SQL
  const migrationEntries = Object.entries(migrations.migrations);

  console.log(
    `🔍 Vérification des migrations (${migrationEntries.length} trouvées)...`,
  );

  // 4. Parcourir chaque migration dans l'ordre
  for (const [migrationName, sqlContent] of migrationEntries) {
    // Si la migration est déjà passée, on passe à la suivante
    if (executedHashes.has(migrationName)) {
      continue;
    }

    console.log(`🚀 Application de la migration : ${migrationName}`);

    // 5. On découpe les instructions selon le séparateur de Drizzle
    const statements = sqlContent.split('--> statement-breakpoint');

    // 6. Exécution sécurisée dans une transaction dédiée à cette migration
    await db.withTransactionAsync(async () => {
      await db.execAsync('PRAGMA foreign_keys = OFF;');

      for (const statement of statements) {
        const trimmed = statement.trim();
        if (trimmed.length > 0) {
          try {
            await db.execAsync(trimmed);
          } catch (e: any) {
            // Sécurité additionnelle pour éviter les blocages sur doublons d'éléments
            if (e.message.includes('already exists')) {
              console.log(
                `ℹ️ Élément déjà présent (ignoré) : ${trimmed.substring(0, 40)}...`,
              );
            } else {
              console.error(
                `❌ Erreur critique dans ${migrationName} sur :`,
                trimmed,
              );
              throw e;
            }
          }
        }
      }

      // Sauvegarde du succès de la migration dans l'historique local
      await db.runAsync(
        'INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?);',
        [migrationName, Date.now()],
      );

      await db.execAsync('PRAGMA foreign_keys = ON;');
    });

    console.log(`✅ Migration ${migrationName} appliquée avec succès.`);
  }

  console.log("🎉 Toutes les migrations de l'historique sont à jour.");
  return db;
}

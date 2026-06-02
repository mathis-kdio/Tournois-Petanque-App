import { EmptyRelations } from 'drizzle-orm';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';
import migrations from 'drizzle/migrations';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import runManualMigration from './runManualMigration';

type drizzleExpoSQLiteDatabase = ExpoSQLiteDatabase<
  Record<string, never>,
  EmptyRelations
> & {
  $client: SQLiteDatabase;
};

let drizzleDbInstance: drizzleExpoSQLiteDatabase | null = null;

const DATABASE_NAME = 'database';

export function useDatabaseMigrations() {
  const [sqliteDatabase, setSqliteDatabase] = useState<SQLiteDatabase | null>(
    null,
  );

  const [databaseMigrationDone, setDatabaseMigrationDone] = useState(false);

  useEffect(() => {
    openDatabaseAsync(DATABASE_NAME, { enableChangeListener: true })
      .then(async (sqliteDatabase) => {
        setSqliteDatabase(sqliteDatabase);
        // Drizzle expo-sqlite ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
        if (Platform.OS === 'web') {
          await runManualMigration(sqliteDatabase);
          // On crée un proxy asynchrone pour Drizzle sur le Web
          return drizzleProxy(async (sql, params) => {
            const result = await sqliteDatabase.getAllAsync(sql, params);
            return { rows: result.map((row) => Object.values(row)) };
          }) as any;
        } else {
          // Sur Mobile, on garde l'implémentation native ultra-rapide
          return drizzle(sqliteDatabase);
        }
      })
      .then((expoSQLiteDatabase) => {
        drizzleDbInstance = expoSQLiteDatabase;
        if (Platform.OS !== 'web') {
          return migrate(expoSQLiteDatabase, migrations);
        }
      })
      .then(() => setDatabaseMigrationDone(true));
  }, []);

  return { sqliteDatabase, databaseMigrationDone };
}

export function getDrizzleDb(): ExpoSQLiteDatabase {
  if (!drizzleDbInstance) {
    throw new Error("La base de données n'est pas initialisée.");
  }
  return drizzleDbInstance;
}

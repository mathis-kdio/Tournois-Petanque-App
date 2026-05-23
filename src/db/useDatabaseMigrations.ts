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
      .then((sqliteDatabase) => {
        setSqliteDatabase(sqliteDatabase);
        if (Platform.OS === 'web') {
          // ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
          return runManualMigration(sqliteDatabase);
        }
        return sqliteDatabase;
      })
      .then((sqliteDatabase) => {
        if (Platform.OS === 'web') {
          // On crée un proxy asynchrone pour Drizzle sur le Web
          // Plus aucun appel synchrone ne sera fait -> PLUS BESOIN de SharedArrayBuffer !
          return drizzleProxy(async (sql, params, method) => {
            try {
              // executeAsync ou une méthode équivalente selon expo-sqlite
              const isReader = method === 'all' || method === 'get';
              const result = await sqliteDatabase.getAllAsync(sql, params);
              return { rows: result.map((row) => Object.values(row)) };
            } catch (e) {
              console.error('Erreur Query Proxy:', e);
              return { rows: [] };
            }
          }) as any;
        } else {
          // Sur Mobile, on garde l'implémentation native ultra-rapide
          return drizzle(sqliteDatabase);
        }
      })
      .then((expoSQLiteDatabase) => {
        drizzleDbInstance = expoSQLiteDatabase;
        if (Platform.OS !== 'web') {
          // TODO ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
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

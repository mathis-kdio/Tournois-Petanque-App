import { useEffect, useState } from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from 'drizzle/migrations';

let drizzleDbInstance: any = null;

const DATABASE_NAME = 'database';

export function useDatabaseMigrations() {
  const [sqliteDatabase, setSqliteDatabase] = useState<SQLiteDatabase | null>(
    null,
  );
  const [expoSQLiteDatabase, setExpoSQLiteDatabase] =
    useState<ExpoSQLiteDatabase | null>(null);

  useEffect(() => {
    openDatabaseAsync(DATABASE_NAME)
      .then((sqliteDatabase) => {
        setSqliteDatabase(sqliteDatabase);
        return drizzle(sqliteDatabase);
      })
      .then((expoSQLiteDatabase) => {
        drizzleDbInstance = expoSQLiteDatabase;
        setExpoSQLiteDatabase(expoSQLiteDatabase);
        migrate(expoSQLiteDatabase, migrations); // TODO ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
      });
  }, []);

  return { sqliteDatabase, expoSQLiteDatabase };
}

export function getDrizzleDb(): ExpoSQLiteDatabase {
  if (!drizzleDbInstance) {
    throw new Error("La base de données n'est pas initialisée.");
  }
  return drizzleDbInstance;
}

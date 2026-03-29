import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from 'drizzle/migrations';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';

let drizzleDbInstance: any = null;

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
        return drizzle(sqliteDatabase);
      })
      .then((expoSQLiteDatabase) => {
        drizzleDbInstance = expoSQLiteDatabase;
        return migrate(expoSQLiteDatabase, migrations); // TODO ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
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

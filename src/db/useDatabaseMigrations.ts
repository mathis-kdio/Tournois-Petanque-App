import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from 'drizzle/migrations';

let drizzleDbInstance: any = null;

const DATABASE_NAME = 'database';

export function useDatabaseMigrations() {
  const [db, setDb] = useState<any | null>(null);

  useEffect(() => {
    openDatabaseAsync(DATABASE_NAME)
      .then((sqliteDatabase) => drizzle(sqliteDatabase))
      .then((expoSQLiteDatabase) => {
        drizzleDbInstance = expoSQLiteDatabase;
        setDb(expoSQLiteDatabase);
        migrate(expoSQLiteDatabase, migrations); // TODO ne fonctionne pas sur WEB https://github.com/drizzle-team/drizzle-orm/issues/1009
      });
  }, []);

  return { db };
}

export function getDrizzleDb() {
  if (!drizzleDbInstance) {
    throw new Error("La base de données n'est pas initialisée.");
  }
  return drizzleDbInstance;
}

import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';

export let drizzleDb: ExpoSQLiteDatabase;

export function setDatabaseInstance(newDb: SQLiteDatabase): Promise<void> {
  return new Promise((resolve) => {
    drizzleDb = drizzle(newDb);
    resolve();
  });
}

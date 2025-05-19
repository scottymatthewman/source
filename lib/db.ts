import type { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { createSongsTable } from './schema'; // Import the SQL for creating the table

// Utility to run SQL with async/await
export async function executeSqlAsync(
  db: SQLiteDatabase,
  sql: string,
  params: any[] = []
) {
  return db.runAsync(sql, params);
}

// Export a singleton database instance
export const db: Promise<SQLiteDatabase> = SQLite.openDatabaseAsync('wright.db')
  .then(async db => {
    try {
      await executeSqlAsync(db, createSongsTable);
      console.log('Songs table created or already exists.');
    } catch (error) {
      console.error('Failed to create songs table:', error);
    }
    return db;
  })
  .catch(error => {
    console.error('Failed to open database:', error);
    throw error; // Re-throw the error to prevent further execution with a broken db connection
  });
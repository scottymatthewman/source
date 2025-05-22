import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoldersProvider } from '../context/folderContext';
import { SongsProvider } from '../context/songContext';
import './globals.css';

export default function RootLayout() {
  return (
    <SQLiteProvider 
     databaseName="songs"
     options={{
      libSQLOptions: {
        url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
        authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
      }
     }}
     onInit={async (db:SQLiteDatabase) => {
        try {
          await db.syncLibSQL();
        } catch (error) {
          console.error(error);
        }

        // Define the target database version
        const DATABASE_VERSION = 3;

        // PRAGMA is a special command in SQLite used to query or modify database settings. For example, PRAGMA user_version retrieves or sets a custom schema version number, helping you track migrations.
        // Retrieve the current database version using PRAGMA.
        let result = await db.getFirstAsync<{
          user_version: number;
        } | null>('PRAGMA user_version');
        let currentDbVersion = result?.user_version ?? 0;

        // If the current version is already equal or newer, no migration is needed.
        if (currentDbVersion >= DATABASE_VERSION) {
          console.log('No migration needed, DB version:', currentDbVersion);
          return;
        }

        // For a new or uninitialized database (version 0), apply the initial migration.
        if (currentDbVersion === 0) {
          // Note: libSQL does not support WAL (Write-Ahead Logging) mode.
          // await db.execAsync(`PRAGMA journal_mode = 'wal';`);

          // Create the 'notes' table with three columns:
          // - id: an integer primary key that cannot be null.
          // - title: a text column.
          // - content: a text column.
          // - modifiedDate: a text column.
          await db.execAsync(
            `CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, content TEXT, modifiedDate TEXT, folder_id INTEGER);`
          );
          await db.execAsync(
            `CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, date_modified TEXT);`
          );
          console.log(
            'Initial migration applied, DB version:',
            DATABASE_VERSION
          );
          // Update the current version after applying the initial migration.
          currentDbVersion = 1;
        }

        // Migration for version 1: Add folders table
        if (currentDbVersion === 1) {
          console.log('Applying migration for version 1: Adding folders table');
          await db.execAsync(
            `CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, date_modified TEXT);`
          );
          currentDbVersion = 2;
        }

        // Migration for version 2: Add folder_id to songs table
        if (currentDbVersion === 2) {
          console.log('Applying migration for version 2: Adding folder_id to songs table');
          await db.execAsync(
            `ALTER TABLE songs ADD COLUMN folder_id INTEGER;`
          );
          currentDbVersion = 3;
        }

        // Set the database version to the target version after migration.
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
      }}
    >
      <SafeAreaProvider>
        <SongsProvider>
          <FoldersProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </FoldersProvider>
        </SongsProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}

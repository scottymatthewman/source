import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
        const DATABASE_VERSION = 1;

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
            `CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, content TEXT, modifiedDate TEXT);`
          );
          console.log(
            'Initial migration applied, DB version:',
            DATABASE_VERSION
          );
          // Update the current version after applying the initial migration.
          currentDbVersion = 1;
        } else {
          console.log('DB version:', currentDbVersion);
        }

        // Future migrations for later versions can be added here.
        // Example:
        // if (currentDbVersion === 1) {
        //   // Add migration steps for upgrading from version 1 to a higher version.
        // }

        // Set the database version to the target version after migration.
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
      }}
    >
      <SafeAreaProvider>
        <SongsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'Home',
              }} 
            />
            <Stack.Screen 
              name="newSong" 
              options={{ 
                title: 'New Song',
              }} 
            />
          </Stack>
        </SongsProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}

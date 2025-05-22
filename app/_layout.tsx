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
          // Create tables with latest schema
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS songs (
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              title TEXT,
              content TEXT,
              date_modified TEXT,
              folder_id INTEGER,
              key TEXT
            );
          `);

          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS folders (
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              title TEXT,
              date_modified TEXT
            );
          `);

          // Set version to latest
          await db.execAsync(`PRAGMA user_version = 3`);

          // Temporarily disabled sync
          // try {
          //   await db.syncLibSQL();
          // } catch (syncError) {
          //   console.warn('Sync disabled:', syncError);
          // }
        } catch (error) {
          console.error('Database initialization error:', error);
        }
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

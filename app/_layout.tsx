import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClipsProvider } from '../context/clipContext';
import { ColorProvider } from '../context/colorContext';
import { FoldersProvider } from '../context/folderContext';
import { SongsProvider } from '../context/songContext';
import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';

export default function RootLayout() {
  return (
    <ThemeProvider>
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
              key TEXT,
              bpm INTEGER
            );
          `);

          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS folders (
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              title TEXT,
              date_modified TEXT
            );
          `);

          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS clips (
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              title TEXT,
              uri TEXT NOT NULL,
              file_path TEXT NOT NULL,
              file_name TEXT NOT NULL,
              date_created TEXT,
              duration INTEGER,
              mime_type TEXT NOT NULL,
              size INTEGER NOT NULL,
              metadata TEXT
            );
          `);

          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS song_clip_rel (
              song_id INTEGER NOT NULL,
              clip_id INTEGER NOT NULL,
              PRIMARY KEY (song_id, clip_id),
              FOREIGN KEY (song_id) REFERENCES songs(id),
              FOREIGN KEY (clip_id) REFERENCES clips(id)
            );
          `);

          // Set version to latest
          await db.execAsync(`PRAGMA user_version = 4`);

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
            <ClipsProvider>
              <ColorProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen 
                    name="index" 
                    options={{ 
                      title: 'Songs',
                      headerShown: false 
                    }} 
                  />
                  <Stack.Screen 
                    name="song/[id]" 
                    options={{ 
                      title: 'Song Details',
                      headerShown: false 
                    }} 
                  />
                  <Stack.Screen 
                    name="newSong" 
                    options={{ 
                      title: 'New Song',
                      headerShown: false,
                      gestureEnabled: false
                    }} 
                  />
                </Stack>
              </ColorProvider>
            </ClipsProvider>
          </FoldersProvider>
        </SongsProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
    </ThemeProvider>
  );
}

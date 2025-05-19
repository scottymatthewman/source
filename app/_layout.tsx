import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './globals.css';

export default function RootLayout() {
  return (
    <SQLiteProvider 
      databaseName="wright.db"
      onInit={async (db) => {
        // Create table files if it doesn't exist
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
          )
        `);
        console.log('Database initialized');
      }}
    >
      <SafeAreaProvider>
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
     </SafeAreaProvider>
    </SQLiteProvider>
  );
}
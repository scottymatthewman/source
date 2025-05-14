import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import NewSongForm from './newSongForm';

export default function App() {
  return (
    <SQLiteProvider 
        databaseName="userDatabase.db"
        onInit={async (db) => {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL
                )
            `);
        }}
        options={{useNewConnection: false}}
    >
      <NewSongForm />
    </SQLiteProvider>
  );
}
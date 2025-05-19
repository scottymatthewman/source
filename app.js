import * as SQLite from 'expo-sqlite';
import React from 'react';
import { createSongsTable } from './lib/schema';
import NewSongForm from './newSongForm';

export default function App() {
  return (
    <SQLite.SQLiteProvider 
        databaseName="wright.db"
        onInit={async (db) => {
            // Drop the existing table and recreate it with the correct schema
            await db.execAsync(`DROP TABLE IF EXISTS songs;`);
            await db.execAsync(createSongsTable);
            
            // If you want to keep existing data, you'd need a more complex migration strategy
            // This approach will delete all existing data
        }}
        options={{useNewConnection: false}}
    >
      <NewSongForm />
    </SQLite.SQLiteProvider>
  );
}
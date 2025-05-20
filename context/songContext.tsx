import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

if (
  !process.env.EXPO_PUBLIC_TURSO_DB_URL ||
  !process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN
) {
  throw new Error('Turso DB URL and Auth Token must be set in .env.local');
}
export interface Song {
  id: string;
  title: string | null;
  content: string | null;
  modifiedDate: Date | null;
}

export const DB_NAME = 'local.db'; // Turso db name

export const tursoOptions = {
  url: process.env.EXPO_PUBLIC_TURSO_DB_URL,
  authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN,
};

interface SongsContextType {
  songs: Song[];
  createSong: () => Promise<Song | undefined>;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  syncSongs: () => void;
  toggleSync: (enabled: boolean) => void;
  isSyncing: boolean;
}

const SongsContext = createContext<SongsContextType | null>(null);

export function SongsProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchSongs();
  }, [db]);

  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  const fetchSongs = useCallback(async () => {
    const songs = await db.getAllAsync<Song>(
      'SELECT * FROM songs ORDER BY modifiedDate DESC'
    );
    setSongs(songs);
  }, [db]);

  const syncSongs = useCallback(async () => {
    console.log('Syncing songs with Turso DB...');

    try {
      await db.syncLibSQL();
      await fetchSongs();
      console.log('Synced songs with Turso DB');
    } catch (e) {
      console.log(e);
    }
  }, [db, fetchSongs]);

  const toggleSync = useCallback(
    async (enabled: boolean) => {
      setIsSyncing(enabled);
      if (enabled) {
        console.log('Starting sync interval...');
        await syncSongs(); // Sync immediately when enabled
        syncIntervalRef.current = setInterval(syncSongs, 2000);
      } else if (syncIntervalRef.current) {
        console.log('Stopping sync interval...');
        clearInterval(syncIntervalRef.current);
      }
    },
    [syncSongs]
  );

  const createSong = async () => {
    const newSong = {
      title: '',
      content: '',
      modifiedDate: new Date(),
    };

    try {
      const result = await db.runAsync(
        'INSERT INTO songs (title, content, modifiedDate) VALUES (?, ?, ?)',
        newSong.title,
        newSong.content,
        newSong.modifiedDate.toISOString()
      );
      fetchSongs();
      return { ...newSong, id: result.lastInsertRowId.toString() };
    } catch (e) {
      console.log(e);
    }
  };

  const updateSong = async (id: string, updates: Partial<Song>) => {
    // First get the existing note
    const existingSong = await db.getFirstAsync<Song>(
      'SELECT * FROM songs WHERE id = ?',
      [id]
    );

    if (!existingSong) return;

    // Merge existing values with updates
    const updatedSong = {
      title: updates.title ?? existingSong.title,
      content: updates.content ?? existingSong.content,
      modifiedDate: updates.modifiedDate ?? new Date(),
    };

    await db.runAsync(
      'UPDATE songs SET title = ?, content = ?, modifiedDate = ? WHERE id = ?',
      updatedSong.title,
      updatedSong.content,
      updatedSong.modifiedDate.toISOString(),
      id
    );
    fetchSongs();
  };
  const deleteSong = (id: string) => {
    db.runAsync('DELETE FROM songs WHERE id = ?', id);
    fetchSongs();
  };

  return (
    <SongsContext.Provider
      value={{
        songs,
        createSong,
        updateSong,
        deleteSong,
        syncSongs,
        toggleSync,
        isSyncing,
      }}
    >
      {children}
    </SongsContext.Provider>
  );
}

export function useSongs() {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
}
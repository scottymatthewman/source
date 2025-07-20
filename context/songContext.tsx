import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MusicalKey } from '../constants/musicalKeys';

export interface Song {
  id: string;
  title: string | null;
  content: string | null;
  date_modified: Date | null;
  folder_id: string | null;
  key: MusicalKey | null;
  bpm: number | null;
}

interface SongsContextType {
  songs: Song[];
  createSong: () => Promise<Song | undefined>;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
}

const SongsContext = createContext<SongsContextType | null>(null);

export function SongsProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetchSongs();
  }, [db]);

  const fetchSongs = useCallback(async () => {
    const songs = await db.getAllAsync<Song>(
      'SELECT * FROM songs ORDER BY date_modified DESC'
    );
    setSongs(songs);
  }, [db]);

  const createSong = async () => {
    const newSong = {
      title: '',
      content: '',
      date_modified: new Date(),
      folder_id: null,
      key: null,
      bpm: null,
    };

    try {
      const result = await db.runAsync(
        'INSERT INTO songs (title, content, date_modified, folder_id, key, bpm) VALUES (?, ?, ?, ?, ?, ?)',
        newSong.title,
        newSong.content,
        newSong.date_modified.toISOString(),
        newSong.folder_id,
        newSong.key,
        newSong.bpm
      );
      fetchSongs();
      return { ...newSong, id: result.lastInsertRowId.toString() };
    } catch (e) {
      console.log(e);
    }
  };

  const updateSong = async (id: string, updates: Partial<Song>) => {
    const existingSong = await db.getFirstAsync<Song>(
      'SELECT * FROM songs WHERE id = ?',
      [id]
    );

    if (!existingSong) return;

    const updatedSong = {
      title: updates.title ?? existingSong.title,
      content: updates.content ?? existingSong.content,
      date_modified: updates.date_modified ?? new Date(),
      folder_id: updates.folder_id ?? existingSong.folder_id,
      key: updates.key ?? existingSong.key,
      bpm: updates.bpm ?? existingSong.bpm,
    };

    console.log('Updating song in DB:', updatedSong, id);
    await db.runAsync(
      'UPDATE songs SET title = ?, content = ?, date_modified = ?, folder_id = ?, key = ?, bpm = ? WHERE id = ?',
      updatedSong.title,
      updatedSong.content,
      updatedSong.date_modified.toISOString(),
      updatedSong.folder_id,
      updatedSong.key,
      updatedSong.bpm,
      id
    );
    console.log('DB update complete');
    fetchSongs();
  };

  const deleteSong = async (id: string) => {
    try {
      // First, get all clip IDs associated with this song
      const clipRelations = await db.getAllAsync<{ clip_id: string }>(
        'SELECT clip_id FROM song_clip_rel WHERE song_id = ?',
        [id]
      );

      // Delete the relationships first
      await db.runAsync('DELETE FROM song_clip_rel WHERE song_id = ?', id);

      // Delete each associated clip
      for (const relation of clipRelations) {
        // Get the clip details to delete the file
        const clip = await db.getFirstAsync<{ file_path: string }>(
          'SELECT file_path FROM clips WHERE id = ?',
          [relation.clip_id]
        );

        if (clip) {
          // Delete the audio file
          await FileSystem.deleteAsync(clip.file_path, { idempotent: true });
          
          // Delete the clip record
          await db.runAsync('DELETE FROM clips WHERE id = ?', relation.clip_id);
        }
      }

      // Finally, delete the song
      await db.runAsync('DELETE FROM songs WHERE id = ?', id);
      fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <SongsContext.Provider
      value={{
        songs,
        createSong,
        updateSong,
        deleteSong,
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
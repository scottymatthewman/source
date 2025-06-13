import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Clip {
  id: string;
  title: string | null;
  file_path: string;
  file_name: string;
  date_created: Date | null;
  duration: number | null;
  mime_type: string;
  size: number;
  metadata: string | null;
}

interface ClipsContextType {
  clips: Clip[];
  createClip: (audioUri: string, title: string, duration: number) => Promise<Clip | undefined>;
  updateClip: (id: string, updates: Partial<Clip>) => Promise<void>;
  deleteClip: (id: string) => Promise<void>;
  getClip: (id: string) => Promise<Clip | null>;
}

const ClipsContext = createContext<ClipsContextType | null>(null);

export function ClipsProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [clips, setClips] = useState<Clip[]>([]);

  useEffect(() => {
    fetchClips();
  }, [db]);

  const fetchClips = useCallback(async () => {
    const clips = await db.getAllAsync<Clip>(
      'SELECT * FROM clips ORDER BY date_created DESC'
    );
    setClips(clips);
  }, [db]);

  const createClip = async (audioUri: string, title: string, duration: number) => {
    try {
      // Generate a unique filename
      const fileExtension = audioUri.split('.').pop() || 'm4a';
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = `${FileSystem.documentDirectory}clips/${fileName}`;

      // Ensure the clips directory exists
      const clipsDir = `${FileSystem.documentDirectory}clips`;
      const dirInfo = await FileSystem.getInfoAsync(clipsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(clipsDir, { intermediates: true });
      }

      // Copy the audio file to our app's storage
      await FileSystem.copyAsync({
        from: audioUri,
        to: filePath
      });

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) throw new Error('Failed to save audio file');

      const newClip = {
        title,
        file_path: filePath,
        file_name: fileName,
        date_created: new Date(),
        duration,
        mime_type: `audio/${fileExtension}`,
        size: fileInfo.size || 0,
        metadata: null
      };

      const result = await db.runAsync(
        `INSERT INTO clips (
          title, uri, file_path, file_name, date_created, duration, 
          mime_type, size, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newClip.title,
        filePath,
        filePath,
        newClip.file_name,
        newClip.date_created.toISOString(),
        newClip.duration,
        newClip.mime_type,
        newClip.size,
        newClip.metadata
      );

      await fetchClips();
      return { ...newClip, id: result.lastInsertRowId.toString() };
    } catch (error) {
      console.error('Error creating clip:', error);
    }
  };

  const updateClip = async (id: string, updates: Partial<Clip>) => {
    const existingClip = await db.getFirstAsync<Clip>(
      'SELECT * FROM clips WHERE id = ?',
      [id]
    );

    if (!existingClip) return;

    const updatedClip = {
      title: updates.title ?? existingClip.title,
      file_path: updates.file_path ?? existingClip.file_path,
      file_name: updates.file_name ?? existingClip.file_name,
      date_created: updates.date_created ?? existingClip.date_created,
      duration: updates.duration ?? existingClip.duration,
      mime_type: updates.mime_type ?? existingClip.mime_type,
      size: updates.size ?? existingClip.size,
      metadata: updates.metadata ?? existingClip.metadata,
    };

    await db.runAsync(
      `UPDATE clips SET 
        title = ?, file_path = ?, file_name = ?, date_created = ?, 
        duration = ?, mime_type = ?, size = ?, metadata = ? 
        WHERE id = ?`,
      updatedClip.title,
      updatedClip.file_path,
      updatedClip.file_name,
      updatedClip.date_created ? updatedClip.date_created.toISOString() : null,
      updatedClip.duration,
      updatedClip.mime_type,
      updatedClip.size,
      updatedClip.metadata,
      id
    );
    await fetchClips();
  };

  const deleteClip = async (id: string) => {
    try {
      // Get the clip to delete
      const clip = await db.getFirstAsync<Clip>(
        'SELECT * FROM clips WHERE id = ?',
        [id]
      );

      if (clip) {
        // Delete the audio file
        await FileSystem.deleteAsync(clip.file_path, { idempotent: true });
        
        // Delete the database record
        await db.runAsync('DELETE FROM clips WHERE id = ?', id);
        
        // Delete any song relationships
        await db.runAsync('DELETE FROM song_clip_rel WHERE clip_id = ?', id);
        
        await fetchClips();
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const getClip = async (id: string) => {
    return await db.getFirstAsync<Clip>(
      'SELECT * FROM clips WHERE id = ?',
      [id]
    );
  };

  return (
    <ClipsContext.Provider
      value={{
        clips,
        createClip,
        updateClip,
        deleteClip,
        getClip,
      }}
    >
      {children}
    </ClipsContext.Provider>
  );
}

export function useClips() {
  const context = useContext(ClipsContext);
  if (!context) {
    throw new Error('useClips must be used within a ClipsProvider');
  }
  return context;
} 
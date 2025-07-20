import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Folder {
  id: string;
  title: string | null;
  date_modified: Date | null;
}

interface FoldersContextType {
  folders: Folder[];
  createFolder: (title: string) => Promise<Folder | undefined>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  syncFolders: () => Promise<void>;
}

const FoldersContext = createContext<FoldersContextType | null>(null);

export function FoldersProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    fetchFolders();
  }, [db]);

  const fetchFolders = useCallback(async () => {
    const folders = await db.getAllAsync<Folder>(
      'SELECT * FROM folders ORDER BY date_modified DESC'
    );
    setFolders(folders);
  }, [db]);

  const syncFolders = useCallback(async () => {
    console.log('Syncing folders...');
    try {
      await fetchFolders();
      console.log('Synced folders');
    } catch (e) {
      console.error('Error syncing folders:', e);
    }
  }, [fetchFolders]);

  const createFolder = async (title: string) => {
    const newFolder = {
      title,
      date_modified: new Date(),
    };

    try {
      const result = await db.runAsync(
        'INSERT INTO folders (title, date_modified) VALUES (?, ?)',
        newFolder.title,
        newFolder.date_modified.toISOString()
      );
      console.log('Folder created:', newFolder);
      await fetchFolders();
      console.log('Folders after fetch:', folders);
      return { ...newFolder, id: result.lastInsertRowId.toString() };
    } catch (e) {
      console.error('Error creating folder:', e);
    }
  };

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    // First get the existing folder
    const existingFolder = await db.getFirstAsync<Folder>(
      'SELECT * FROM folders WHERE id = ?',
      [id]
    );

    if (!existingFolder) return;

    // Merge existing values with updates
    const updatedFolder = {
      title: updates.title ?? existingFolder.title,
      date_modified: updates.date_modified ?? new Date(),
    };

    await db.runAsync(
      'UPDATE folders SET title = ?, date_modified = ? WHERE id = ?',
      updatedFolder.title,
      updatedFolder.date_modified.toISOString(),
      id
    );
    await fetchFolders();
  };

  const deleteFolder = async (id: string) => {
    try {
      await db.runAsync('DELETE FROM folders WHERE id = ?', id);
      await fetchFolders();
    } catch (e) {
      console.error('Error deleting folder:', e);
    }
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        createFolder,
        updateFolder,
        deleteFolder,
        syncFolders,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
} 
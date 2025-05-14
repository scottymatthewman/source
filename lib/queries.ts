import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

// TypeScript interface for your file object
interface File {
  id: string;
  title: string | null;
  content: string | null;
  date_created: number;
  date_edited: number;
}

// Returns all files from the files table as an array
export const getAllFiles = async (dbPromise: Promise<SQLiteDatabase>): Promise<File[]> => {
  const db = await dbPromise;
  let resultRows: File[] = [];
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.runAsync('SELECT * FROM files;');
      console.log('SQL Query Result:', result);
      if (result && Array.isArray(result)) {
        resultRows = result.map(row => ({
          id: row.id,
          title: row.title,
          content: row.content,
          date_created: row.date_created,
          date_edited: row.date_edited,
        }));
      }
    });
  } catch (error) {
    console.error('Error fetching all files:', error);
    return [];
  }
  console.log('Fetched rows:', resultRows);
  return resultRows;
};

// Inserts a new file into the files table
export const insertFile = async (
  dbPromise: Promise<SQLiteDatabase>,
  file: Omit<File, 'id' | 'date_created' | 'date_edited'>
): Promise<string | null> => {
  const db = await dbPromise;
  const id = uuidv4();
  const now = Date.now();
  let insertResult: string | null = null;
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        'INSERT INTO files (id, title, content, date_created, date_edited) VALUES (?, ?, ?, ?, ?);',
        [id, file.title, file.content, now, now]
      );
      if ((result as unknown as any).rowsAffected > 0) {
        insertResult = id;
      }
    });
    console.log('Inserting file:', { title: file.title, content: file.content });
  } catch (error) {
    console.error('Error inserting file:', error);
    return null;
  }
  return insertResult;
};

// Updates an existing file in the files table
export const updateFile = async (
  dbPromise: Promise<SQLiteDatabase>,
  file: File
): Promise<boolean> => {
  const db = await dbPromise;
  const now = Date.now();
  let updateResult = false;
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        'UPDATE files SET title = ?, content = ?, date_edited = ? WHERE id = ?;',
        [file.title, file.content, now, file.id]
      );
      updateResult = (result as unknown as any).rowsAffected > 0;
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return false;
  }
  return updateResult;
};
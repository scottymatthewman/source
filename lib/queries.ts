import type { SQLiteDatabase } from 'expo-sqlite';

// TypeScript interface for your file object
interface Songs {
  id: string;
  title: string | null;
  content: string | null;
  date_created: number;
  date_edited: number;
}

// Returns all files from the files table as an array
export const getAllSongs = async (dbPromise: Promise<SQLiteDatabase>): Promise<Songs[]> => {
  const db = await dbPromise;
  console.log('getting all songs');
  const result = await db.getAllAsync('SELECT * FROM songs');
  
 
  console.log('Fetched rows:', result);
  return result as Songs[];
};

// Inserts a new song into the songs table
export const insertSong = async (
  dbPromise: Promise<SQLiteDatabase>,
  song: Omit<Songs, 'id' | 'date_created' | 'date_edited'>
): Promise<number | null> => {
  const db = await dbPromise;
  const now = Date.now();
  let insertResult: number | null = null;
  try {
    console.log('trying to insert song');
    await db.withTransactionAsync(async () => {
      console.log('Running SQL Insert Query');
      // Don't include id in the INSERT - SQLite will auto-generate it
      const result = await db.runAsync(
        'INSERT INTO songs (title, content, date_created, date_edited) VALUES (?, ?, ?, ?);',
        [song.title, song.content, now, now]
      );
      console.log('SQL Insert Result:', result);
      if (result.changes > 0) {
        // Get the auto-generated ID
        const lastIdResult = await db.runAsync('SELECT last_insert_rowid() as id');
        if (lastIdResult && Array.isArray(lastIdResult) && lastIdResult.length > 0) {
          insertResult = lastIdResult[0].id;
        }
        console.log('generated id:', insertResult);
      } else {
        console.error('Insert failed, no rows affected.');
      }
    });
    console.log('Inserting song:', { title: song.title, content: song.content });
  } catch (error) {
    console.error('Error inserting song:', error);
    return null;
  }
  console.log('inserted song');
  return insertResult;
};

// Updates an existing song in the songs table
export const updateSong = async (
  dbPromise: Promise<SQLiteDatabase>,
  song: Songs
): Promise<boolean> => {
  const db = await dbPromise;
  const now = Date.now();
  let updateResult = false;
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        'UPDATE songs SET title = ?, content = ?, date_edited = ? WHERE id = ?;',
        [song.title, song.content, now, song.id]
      );
      updateResult = (result as unknown as any).rowsAffected > 0;
    });
  } catch (error) {
    console.error('Error updating song:', error);
    return false;
  }
  return updateResult;
};
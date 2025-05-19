export const createSongsTable = `
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date_created INTEGER NOT NULL,
    date_edited INTEGER NOT NULL
  );
`;
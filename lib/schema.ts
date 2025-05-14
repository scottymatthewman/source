export const createFilesTable = `
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT,
    content TEXT,
    date_created INTEGER NOT NULL,
    date_edited INTEGER NOT NULL
  );
`;
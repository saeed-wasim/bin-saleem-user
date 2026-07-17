import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to admin database to share categories
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '..', '..', '..', 'bin-saleem-jewellery', 'database.sqlite');

console.log('Database path:', dbPath);

export const db = new Database(dbPath, { verbose: console.log });

if (!db) {
  throw new Error('SQLite database connection failed');
}

export function initializeDatabase() {
  db.pragma('journal_mode = WAL');
  
  // Ensure categories table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      image TEXT
    );
  `);
}

initializeDatabase();

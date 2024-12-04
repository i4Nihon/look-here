import Database from "better-sqlite3";

export const sqlite = new Database("testWatchtime.db");
sqlite.pragma("journal_mode = WAL");

sqlite
  .prepare(
    "CREATE TABLE IF NOT EXISTS users (nick TEXT PRIMARY KEY, SEWatchtime INTEGER NOT NULL, myWatchtime INTEGER DEFAULT 1)"
  )
  .run();

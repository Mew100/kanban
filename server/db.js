const Database = require('better-sqlite3');
const db = new Database('kanban.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT null,
        description TExt DEFAULT '',
        column_name TEXT NOT NULL DEFAULT 'todo',
        label TEXT DEFAULT '',
        due_date TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
    )
`);

module.exports = db;

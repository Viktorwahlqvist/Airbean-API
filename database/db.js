import Database from "better-sqlite3";

const db = new Database("./database/database.db", { verbose: console.log });

// Skapa users-tabell
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users(
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `
).run();

// Skapa orders-tabell
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS orders(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT NOT NULL,
      order_status TEXT NOT NULL DEFAULT 'pending',
      delivery DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `
).run();

// Skapa user_auth-tabell för autentisering
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS user_auth(
      id INTEGER PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DEFAULT CURRENT_TIMESTAMP,
      updated_at DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `
).run();

// Skapa order_items-tabell
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS order_items(
      order_id INTEGER,
      item_id INTEGER NOT NULL,
      quantity INTEGER,
      PRIMARY KEY (order_id, item_id),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )
  `
).run();

// Trigger för att ta bort order om inga order_items finns kvar
db.prepare(
  `
    CREATE TRIGGER IF NOT EXISTS  delete_order_if_no_items_left
    AFTER DELETE ON order_items
    FOR EACH ROW
    BEGIN
      DELETE FROM orders 
      WHERE id = OLD.order_id 
      AND NOT EXISTS (
        SELECT 1 FROM order_items WHERE order_id = OLD.order_id
      );
    END;
  `
).run();

// Skapa items-tabell
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS items(
      id INTEGER NOT NULL PRIMARY KEY,
      title TEXT,
      desc TEXT,
      price INTEGER,
      in_stock BOOLEAN,
      is_cold BOOLEAN,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    )
  `
).run();

// Skapa category-tabell för produktkategorier
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS category(
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    )
  `
).run();

export default db;

import Database from "better-sqlite3";

const db = new Database("./database/database.db", { verbose: console.log });

//Users table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    order_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL)
`
).run();


//Orders table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS orders(
    id INTEGER NOT NULL PRIMARY KEY,
    order_date INTEGER NOT NULL,
    order_status TEXT NOT NULL DEFAULT 'pending'
    )
`
).run();

//User_auth table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS user_auth(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)
`
).run();

//Order_item table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS order_items(
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE)
`
).run();

//items table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS items(
    id INTEGER NOT NULL PRIMARY KEY,
    title TEXT,
    desc TEXT,
    price INTEGER,
    in_stock BOOLEAN,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE)
`
).run();

//category table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS category(
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT)
`
).run();

export default db;

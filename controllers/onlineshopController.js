import db from "../database/db.js";
// Controllers för *menyn*

// (GET) Hämta menyn.
export const getMenu = (req, res) => {
  try {
    const stmt = db.prepare(`
        SELECT title, desc, price FROM items WHERE in_stock = 1 `);
    const result = stmt.all();
    if (result.length === 0) {
      return res.status(404).json({ message: `No items in stock` });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// (POST) Lägga till i menyn
export const addToMenu = (req, res) => {
  const { title, desc, price, in_stock, category_id } = req.body;
  // Innan detta ska allt valideras med middleware.
  try {
    const stmt = db.prepare(`
        INSERT INTO items (title, desc, price, in_stock, category_id) VALUES
        (?, ?, ?, ?, ?)`);
    const result = stmt.run(title, desc, price, in_stock, category_id);
    // Om det inte blev tillagt så är result.changes eftersom in ändringar gjordes.
    if (!result.changes) {
      return res.status(404).json({ error: `Couldn't add new item...` });
    }
    res.status(201).json({
      message: `${title} got successfully added with ID ${result.lastInsertRowid}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//  (PATCH) controller för att ändra en eller flera saker i menyn men inte hela.
export const patchMenu = (req, res) => {
  const { title, desc, price, in_stock, category_id } = req.body;
  const { id } = req.params;
  // Validering kommer med middleware.
  //array för det som updateras.
  const updates = [];
  const params = [];

  if (title.trim() !== "" && typeof title === "string") {
    updates.push("title = ?");
    params.push(title);
  }
  if (desc.trim() !== "" && typeof desc === "strin") {
    updates.push("desc = ?");
    params.push(desc);
  }
  if (price != null && typeof number === "number") {
    updates.push("price = ?");
    params.push(price);
  }
  if (in_stock != null && typeof in_stock === "boolean") {
    updates.push("in_stock = ?");
    params.push(in_stock);
  }
  if (category_id != null && typeof category_id === "number") {
    updates.push("category_id = ?");
    params.push(category_id);
  }
  params.push(id);
  try {
    const stmt = db.prepare(
      `UPDATE cars SET ${updates.join(", ")} WHERE id = ?`
    );
    const result = stmt.run(...params);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// (PUT) Ersätta hela (kaffe sorten) i menyn.
export const putMenu = (req, res) => {};

//  (DELETE) ta bort från menyn med id
export const deleteMenu = (req, res) => {
  // Skapa en validering i middlewares för alla ID och skapa req.id
  if (!req.id) {
    return res.status(400).json({ error: `No ID` });
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM items WHERE id = ?`);
    const result = stmt.run(req.id);
    if (!result.changes) {
      return res.status(404).json({ error: `No item with ID ${req.id}` });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controllers för *Cateories*

// (GET) Controllers för hämta alla categories, eller visa alla produkter med en viss kateori.
export const getCategories = (req, res) => {
  const query = req.params.q;

  if (query.trim() !== "" || query) {
    try {
      const stmt = db.prepare(`
        SELECT items.title, items.desc, items.price, category.name 
        FROM items
        JOIN category ON items.category_id = category.id
        WHERE category.name = ?
    `);
      const result = stmt.all(query);
      if (result.length === 0) {
        return res.status(400).json({ error: "No result with that category" });
      }
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const stmt = db.prepare(`
        SELECT * FROM category`);
      const result = stmt.all();

      if (result.length === 0) {
        return res.status(400).json({ error: `No categorys` });
      }
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.messag });
    }
  }
};

// (POST) Controller för att lägga till i categories
export const addToCategories = (req, res) => {
  const { name } = req.body;
  // Liten validering här
  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ error: "Category name is required and must be a string" });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO categories (name) VALUES (?)`);
    const result = stmt.run(name);
    // Om det inte blev tillagt så är result.changes eftersom in ändringar gjordes.
    if (!result.changes) {
      return res.status(400).json({ error: `Couldn't add new category...` });
    }
    res.status(201).json({
      message: `${name} got succesffully added with ID ${result.lastInsertRowid}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// (PATCH) controller för att ändra en eller flera saker i categories men inte hela.
export const patchCategories = (req, res) => {
  // Middleware validering och parse för ID
  const { name } = req.body;
  if (!req.id) {
    return res.status(400).json({ error: `No ID` });
  }
  if (!name || name.trim() !== "" || typeof name !== "string") {
    return res
      .status(400)
      .json({ error: `Name is required and must be a string` });
  }
  try {
    const stmt = db.prepare(`
      UPDATE category SET name = ? WHERE id = ?`);
    const result = stmt.run(name, req.id);

    if (!result.changes) {
      return res
        .status(404)
        .json({ error: `Couldn't update category with ID ${req.id}` });
    }
    res
      .status(200)
      .json({ message: `Category with ID ${req.id} succesfully updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// (DELETE) controller för att ta bort en kategori
export const deleteCategories = (req, res) => {
  // Skapa en validering i middlewares för alla ID och skapa req.id
  if (!req.id) {
    return res.status(400).json({ error: `No ID` });
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM category WHERE id = ?`);
    const result = stmt.run(req.id);
    if (!result.changes) {
      return res.status(404).json({ error: `No category with ID ${req.id}` });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controllers för *cold*

// (GET) controller för att hämta alla kalla drycker.
export const getCold = (req, res) => {};

// Controllers för *hot*

// (GET) controller för att hämta alla varma drycker.
export const getHot = (req, res) => {};

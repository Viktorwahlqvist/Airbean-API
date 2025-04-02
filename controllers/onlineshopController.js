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
  const { title, desc, price, in_stock, is_cold, category_id } = req.body;
  // Innan detta ska allt valideras med middleware.
  try {
    const stmt = db.prepare(`
        INSERT INTO items (title, desc, price, in_stock, is_cold, category_id) VALUES
        (?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(title, desc, price, in_stock, is_cold, category_id);
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
  // Id validering middleware, tillfällig för test
  const { id } = req.params;
  // Validering kommer med middleware.
  //array för det som updateras.
  const updates = [];
  const params = [];

  if (title && typeof title === "string" && title.trim() !== "") {
    updates.push("title = ?");
    params.push(title);
  }
  if (desc && typeof desc === "string" && desc.trim() !== "") {
    updates.push("desc = ?");
    params.push(desc);
  }
  if (price && price != null && typeof price === "number") {
    updates.push("price = ?");
    params.push(price);
  }
  if (in_stock && in_stock != null && typeof in_stock === "boolean") {
    updates.push("in_stock = ?");
    params.push(in_stock);
  }
  if (category_id && category_id != null && typeof category_id === "number") {
    updates.push("category_id = ?");
    params.push(category_id);
  }
  params.push(id);
  try {
    const stmt = db.prepare(
      `UPDATE items SET ${updates.join(", ")} WHERE id = ?`
    );
    const result = stmt.run(...params);
    if (!result.changes) {
      res.status(400).json({ error: `Error patching` });
    }
    res
      .status(200)
      .json({ message: `Item with ID ${id} succesfully updated.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// (PUT) Ersätta hela (kaffe sorten) i menyn.
export const putMenu = (req, res) => {
  // Validering i middleware samma som addtoMenu
  // id middleware lägger till en för test
  const { id } = req.params;
  const { title, desc, price, in_stock, is_cold, category_id } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE items SET title = ?, desc = ?, price = ?, in_stock = ?, is_cold = ?, category_id = ?
      WHERE id = ?`);
    const result = stmt.run(
      title,
      desc,
      price,
      in_stock,
      is_cold,
      category_id,
      id
    );
    if (!result.changes) {
      return res
        .status(404)
        .json({ error: `Couldn¨t update item with ID ${id}` });
    }
    res
      .status(200)
      .json({ message: `Ìtem with ID ${id} sucessfully updated ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//  (DELETE) ta bort från menyn med id
export const deleteMenu = (req, res) => {
  // Skapa en validering i middlewares för alla ID och skapa req.id
  // Tillfällig id för test
  req.id = req.params.id;
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
  const query = req.query.q;

  console.log(`type `, typeof query);

  if (query && query.trim() !== "") {
    try {
      const stmt = db.prepare(`
        SELECT items.title, items.desc, items.price, category.name 
        FROM items
        JOIN category ON items.category_id = category.id
        WHERE category.name = ?
    `);
      const result = stmt.all(query.trim());
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
      res.status(200).json(result);
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
      INSERT INTO category (name) VALUES (?)`);
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
  // Lägger till req.id för test.
  req.id = req.params.id;
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
export const getCold = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT title, desc, price, category.name AS category FROM items
      JOIN category ON items.category_id = category.id
      WHERE is_cold = 1 AND in_stock = 1`);
    const result = stmt.all();
    if (result.length === 0) {
      return res.status(400).json({ error: `No Cold drinks available.` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controllers för *hot*

// (GET) controller för att hämta alla varma drycker.
export const getHot = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT title, desc, price, category.name AS category FROM items
      JOIN category ON items.category_id = category.id
      WHERE is_cold = 0 AND in_stock = 1`);
    const result = stmt.all();
    if (result.length === 0) {
      return res.status(400).json({ error: `No Hot drinks available.` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

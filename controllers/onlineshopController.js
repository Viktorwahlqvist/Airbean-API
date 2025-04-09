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
  const updates = [];
  const params = [];
  // Validering från bodyn om den ska ändras.
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
  params.push(req.id);
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
      req.id
    );
    if (!result.changes) {
      return res
        .status(404)
        .json({ error: `Couldn¨t update item with ID ${req.id}` });
    }
    res
      .status(200)
      .json({ message: `Ìtem with ID ${req.id} sucessfully updated ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//  (DELETE) ta bort från menyn med id
export const deleteMenu = (req, res) => {
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

// Controllerför varukorg
export const getCart = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT orders.id, strftime('%Y-%m-%d %H:%M:%S', orders.order_date, 'unixepoch') AS order_date,
      orders.order_status, items.title, order_items.quantity
      FROM users
      JOIN orders ON users.id = orders.user_id
      JOIN order_items ON orders.id = order_items.order_id
      JOIN items ON order_items.item_id = items.id
      WHERE users.id = ?`);

    const result = stmt.all(req.user_id);

    if (result.length === 0) {
      return res
        .status(400)
        .json({ error: `No active orderes for ID: ${req.user_id}` });
    }
    res.status(200).json({ Orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controller för lägga till vara i varukorgen.
export const addItemToCart = (req, res) => {
  // Tillfällig tills vi har en middlware
  const { user_id, items } = req.body;

  /* Validering för att koll så användaren har skickat in 
     ett user_id samt en array med items som ska innehålla item_id + quantity*/
  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: `User_id is required and items as an array` });
  }

  // Kolla om det finns en order redan med pending så vi inte skapar en ny.
  const checkOrder = db.prepare(`
    SELECT id from orders WHERE user_id = ? AND order_status = 'pending'`);
  const resultCheckOrder = checkOrder.get(user_id);
  console.log("resultCheckOrder:", resultCheckOrder);
  /* förbereder 2 statement så vi kan köra med transaction. eftersom att vi vill
  kunna få rollback om en av insert inte går igenom. */
  const stmtOrder = db.prepare(`
    INSERT INTO orders (order_date, user_id) VALUES (strftime('%s','now'), ?)`);

  const stmtItems = db.prepare(`
    INSERT INTO order_items (order_id, item_id, quantity) VALUES(?, ?, ?)`);

  const transaction = (db.transaction = (user_id, items) => {
    let orderId;
    // Kollar om en order redan finns och är pending.
    console.log(resultCheckOrder);

    if (resultCheckOrder) orderId = resultCheckOrder.id;
    // Om inte order finns skapa ny order.
    else {
      const result = stmtOrder.run(user_id);
      orderId = result.lastInsertRowid;
    }

    /*Valde det skulle vara en array så vi kunde mappa igenom varje object även 
    det bara är ett objekt så ska det ligga i en array.*/
    items.map((item) => {
      // Om någon av items id eller item quatity i ett objekt så skrivs fel ut.
      if (!item.item_id || !item.quantity) {
        return res.status(400).json({ error: `Missin item or quantity.` });
      }
      // Annars läggs varje object till tills vi har mappat igenom alla.
      const resultItems = stmtItems.run(orderId, item.item_id, item.quantity);
    });
    // Return orderId så vi kan spara orderid när vi kör våran transaction.
    return orderId;
  });
  try {
    const newOrderId = transaction(user_id, items);

    res
      .status(201)
      .json({ message: `Order succesffully created, Order ID: ${newOrderId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controller för att ändra i varukorgen.

export const patchItemInCart = (req, res) => {
  const { orderId, itemId } = req.params;
  const { quantity } = req.body;

  if (!orderId || !itemId) {
    return res.status(400).json({ error: `Missing order id or item id` });
  }

  if (typeof quantity !== "number") {
    return res.status(400).json({ error: `Quantity must be of type Number` });
  }
  if (quantity < 0) {
    res
      .status(400)
      .json({ error: `Can't update Quantity to a negative number.` });
  }
  try {
    if (quantity === 0) {
      const stmt = db.prepare(`DELETE FROM order_items WHERE item_id = ?`);
      const result = stmt.run(itemId);
      if (!result.changes) {
        return res.status(404).json({
          error: `Couldn't update quantity for item with ID: ${itemId}`,
        });
      }
      return res.status(204).send();
    }
    const stmt = db.prepare(`
      UPDATE order_items SET quantity = ? WHERE item_id = ?`);
    const result = stmt.run(itemId, quantity);

    if (!result.changes) {
      return res
        .status(404)
        .json({ error: `Couldn't update quantity With ID ${itemId}` });
    }
    res
      .status(200)
      .json({ message: `Updated Item ID: ${itemId}, Quantity : ${quantity}` });
  } catch (error) {
    console.error(error);
  }
};

// Controller för att ta bort en vara i ordern.

export const deleteItemFromCart = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  if (!itemId) {
    return res.status(400).json({ error: `Missing item id` });
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM order_items WHERE item_id = ?`);

    const result = stmt.run(itemId);

    if (!result.changes) {
      return res.status(404).json({
        error: `Couldnt Delete item from order with item ID: ${itemId}`,
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.messag });
  }
};

// Controller för att slutföra beställning
export const postCheckout = (req, res) => {
  const stmtCheckout = db.prepare(`
    SELECT orders.id, items.title, order_items.quantity, items.price
    FROM users
    JOIN orders ON users.id = orders.user_id
    JOIN order_items ON orders.id = order_items.order_id
    JOIN items ON order_items.item_id = items.id
    WHERE users.id = ?;
  `);

  const stmtUpdateDelivery = db.prepare(`
    UPDATE orders
     SET delivery = DATETIME('now', '+' || (1 + (ABS(RANDOM()) % 1)) || ' days'),
     order_status = ?
     WHERE user_id = ? AND id = ?;
  `);

  // Starta transaktionen korrekt
  const transaction = db.transaction(() => {
    const resultCheckout = stmtCheckout.all(req.user_id);
    console.log(resultCheckout);

    resultCheckout.map((checkout) => {
      stmtUpdateDelivery.run(`Shipped`, req.user_id, checkout.id);
    });

    const totalPrice = resultCheckout.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    return { resultCheckout, totalPrice };
  });

  try {
    const { resultCheckout, totalPrice } = transaction();
    if (resultCheckout.length === 0) {
      return res.status(400).json({ error: "No orders found for this user" });
    }
    console.log(totalPrice);

    res.status(200).json({ resultCheckout, Totalcost: totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// Controller för att hämta information om leverans.
export const getDelivery = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT items.title, order_items.quantity, orders.delivery, orders.order_status
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      JOIN items ON order_items.item_id = items.id
      WHERE orders.user_id = ? AND orders.order_status = 'Shipped';
  `);
    const result = stmt.all(req.user_id);
    console.log(result);

    if (result.changes === 0) {
      return res.status(400).json({
        error: `No orders with user ID ${req.user_id} please visit Checkout`,
      });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

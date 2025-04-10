import db from "../database/db.js"; // Importerar databasen

// GET för att hämta alla produkter
export const getAllProducts = (req, res) => {
    try {
        const stmt = db.prepare("SELECT title, desc, price FROM items ORDER BY title ASC"); // Bokstavsordning (kategori) 
        const products = stmt.all(); // Hämtar alla produkter

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in database" });
          }

        res.json(products); 
    } catch (error) {
        res.status(500).json({ error: "Database error"});
    }

};

// POST för att lägga till en ny produkt
export const addProduct = (req, res) => {
  const { title, desc, price } = req.body; //Object

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "All fields are required. Please provide a title, description, and price."});
    }

  try {
    const stmt = db.prepare(
      "INSERT INTO items (title, desc, price) VALUES (?, ?, ?)"
    );
    const result = stmt.run(title, desc, price); //prepare för säker inmatning

        res.status(201).json({ message: "Product successfully added to the database.", productId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: "Database error"});
    }
};

// PUT för att ersätta en produkt med helt nytt innehåll
export const replaceProduct = (req, res) => {
  const { id } = req.params;
  const { title, desc, price } = req.body;

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "All fields (title, description, and price) must be provided." });
    }

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found." });
        }

        const stmt = db.prepare(
            "UPDATE items SET title = ?, `desc` = ?, price = ? WHERE id = ?"
        );
        stmt.run(title, desc, price, id);

        res.status(200).json({ message: "Product successfully replaced with the new data." });
    } catch (error) {
        res.status(500).json({ error: "Database error." });
    }
};

// PATCH för att updatera produkt via ID
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { title, desc, price } = req.body;

    if (!title && !desc && !price) {
        return res.status(400).json({ error: "At least one field (title, description, or price) must be updated." });
    }

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found." });
        }

        const stmt = db.prepare(
            "UPDATE items SET title = ?, desc = ?, price = ? WHERE id = ?"
        );
        stmt.run(title || existingProduct.title, desc || existingProduct.desc, price || existingProduct.price, id);

        res.status(200).json({ message: "Product successfully updated." });
    } catch (error) {
        res.status(500).json({ error: "Database error." });
    }
};

// DELETE för att ta bort produkt via ID
export const deleteProduct = (req, res) => {
  const { id } = req.params;

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found." });
        }

        const stmt = db.prepare("DELETE FROM items WHERE id = ?");
        stmt.run(id);

        res.status(200).json({ message: "Product successfully deleted." });
    } catch (error) {
        res.status(500).json({ error: "Database error." });
    }

};

// Kategorier, sortera
export const getSortedItems = (req, res) => {
    // Skapar ett objekt som mappar användarens val (från query-parametern) till faktiska kolumnnamn i databasen
    const sortMap = {
        title: 'items.title',
        price: 'items.price',
        category: 'category.name'
    };

    // Hämtar sorteringsparametern från querystring (t.ex. ?sort=price)
    const sortByInput = req.query.sort || "title"; // Om inget anges, sortera på "title"
    
    // Kollar om användarens val finns i vår map, annars används "items.title" som standard
    const sortBy = sortMap[sortByInput.toLowerCase()] || 'items.title';

    // Hämtar sorteringsordningen från querystring (?order=desc), annars "ASC" (stigande)
    const sortOrder = req.query.order && ['asc', 'desc'].includes(req.query.order.toLowerCase())
        ? req.query.order.toUpperCase() // Om korrekt ordning anges, använd den
        : 'ASC'; // Annars standardvärde "ASC"

    // Plockar ut filtreringsparametrar från querystring
    const { category, minPrice, maxPrice } = req.query;

    // Startar SQL-frågan med att välja data och ansluter tabellerna
    let query = `
        SELECT 
            items.title, 
            items.desc, 
            items.price, 
            category.name AS category_name
        FROM items
        JOIN category ON items.category_id = category.id
    `;

    let params = []; // Här samlar vi värdena som ska skickas till databasen
    let conditions = []; // Här bygger vi upp våra WHERE-villkor

    // Om användaren filtrerar på kategori (category), lägg till ett villkor
    if (category) {
        conditions.push("category.name = ?");
        params.push(category); // Parametriserad fråga för säkerhet (skydd mot SQL injection)
    }

    // Om minsta pris är angivet, lägg till som villkor
    if (minPrice) {
        conditions.push("items.price >= ?");
        params.push(minPrice);
    }

    // Om högsta pris är angivet, lägg till som villkor
    if (maxPrice) {
        conditions.push("items.price <= ?");
        params.push(maxPrice);
    }

    // Om några filter är satta, bygg WHERE-delen av frågan
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    // Lägg till sorteringsdelen i slutet av SQL-frågan
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    try {
        // Förbereder och kör frågan mot databasen
        const stmt = db.prepare(query);
        const items = stmt.all(...params); // Kör SQL-frågan med parametrarna

        // Om inga produkter hittades, skicka 404 som svar
        if (items.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Om produkter hittades, skicka tillbaka dem som JSON-svar
        res.json(items);
    } catch (error) {
        // Om något gick fel i databasen, skicka felmeddelande
        res.status(500).json({ error: "Database error" });
    }
};

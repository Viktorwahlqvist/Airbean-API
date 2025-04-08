import db from "../database/db.js"; // Importerar databasen


// GET för att hämta alla produkter
export const getAllProducts = (req, res) => {
    try {
        const stmt = db.prepare("SELECT title, desc, price FROM items ORDER BY title ASC"); // Bokstavsordning (kategori) 
        const products = stmt.all(); // Hämtar allar produkter

        if (products.length === 0) {
            return res.status(404).json({ message: "No products" });
          }

        res.json(products); 
    } catch (error) {
        res.status(500).json({ error: "Databasfel"});
    }
};

// POST för att lägga till en ny produkt
export const addProduct = (req, res) => {
    const { title, desc, price } = req.body; //Object

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält måste fyllas i"});
    }

    try {
        const stmt = db.prepare(
            "INSERT INTO items (title, desc, price) VALUES (?, ?, ?)"
        );
        const result = stmt.run(title, desc, price); //prepare för säker inmatning

        res.status(201).json({ message: "Produkt lagt till", productId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: "Databasfel"});
    }
};

// PUT för att ersätta en produkt med helt nytt innehåll
export const replaceProduct = (req, res) => {
    const { id } = req.params;
    const { title, desc, price } = req.body;

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara med" });
    }

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produkt hittades inte" });
        }

        const stmt = db.prepare(
            "UPDATE items SET title = ?, `desc` = ?, price = ? WHERE id = ?"
        );
        stmt.run(title, desc, price, id);

        res.status(200).json({ message: "Produkten har ersatts med ny data" });
    } catch (error) {
        res.status(500).json({ error: "Databasfel" });
    }
};


// PATCH för att updatera produkt via ID
export const updateProduct = (req, res) => {
    const { id } = req.params;
    const { title, desc, price } = req.body;

    if (!title && !desc && !price) {
        return res.status(400).json({ error: "Minst ett fält måste uppdateras" });
    }

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produkt hittades inte" });
        }

        const stmt = db.prepare(
            "UPDATE items SET title = ?, desc = ?, price = ? WHERE id = ?"
        );
        stmt.run(title || existingProduct.title, desc || existingProduct.desc, price || existingProduct.price, id);

        res.status(200).json({ message: "Produktet är uppdaterat" });
    } catch (error) {
        res.status(500).json({ error: "Databasfel" });
    }
};

// DELETE för att ta bort produkt via ID
export const deleteProduct = (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produkt hittades inte" });
        }

        const stmt = db.prepare("DELETE FROM items WHERE id = ?");
        stmt.run(id);

        res.status(200).json({ message: "Produkt raderad" });
    } catch (error) {
        res.status(500).json({ error: "Databasfel" });
    }
};


// Kategorier, sortera
export const getSortedItems = (req, res) => {
    const sortBy = req.query.sort || "title"; // Sorts by Title as default 
    const sortOrder = req.query.order && ['asc', 'desc'].includes(req.query.order.toLowerCase()) // Converts provided value to lowercase
        ? req.query.order.toUpperCase()
        : 'ASC';

    const { country, type, minPrice, maxPrice } = req.query;
    let query = "SELECT * FROM items";
    let params = [];
    let conditions = [];

    if (country) {
        conditions.push("country = ?");
        params.push(country);
    }

    if (type) {
        conditions.push("type = ?");
        params.push(type);
    }

    if (minPrice) {
        conditions.push("price >= ?");
        params.push(minPrice);
    }

    if (maxPrice) {
        conditions.push("price <= ?");
        params.push(maxPrice);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    try {
        const stmt = db.prepare(query);
        const items = stmt.all(...params); // More than one value accepted

        if (items.length === 0) {
            return res.status(404).json({ message: "Hittade inga kategorier" });
        }

        res.json(items); // Sends back response as json
    } catch (error) {
        res.status(500).json({ error: "Databasfel" });
    }
};
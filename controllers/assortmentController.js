import db from "../db.js"; // Importerar databasen 


// GET för att hämta alla produkter
export const getAllProducts = (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM items");
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
        return res.status(400).json({ error: "Alla fält måste fyllas inn"});
    }

    try {
        const stmt = db.prepare(
            "INSERT INTO products (title, desc, price) VALUES (?, ?, ?)"
        );
        const result = stmt.run(title, desc, price); //prepare för säker inmatning

        res.status(201).json({ message: "Produkt lagt till", productId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: "Databasfel"});
    }
};

// PUT 


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
            "UPDATE products SET title = ?, desc = ?, price = ? WHERE id = ?"
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
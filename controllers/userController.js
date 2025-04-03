import { nanoid } from "nanoid";
import db from "../database/db.js";

// Lägga till en ny användare
export const addUser = (req, res) => {
  const { name, email, password } = req.body;
  const userId = resultUsers.lastInsertRowId;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i" });
  }
  try {
    const stmtUsers = db.prepare(
      "INSERT INTO users (name, email) VALUES (?,?)"
    );
    const stmtUsers_auth = db.prepare(
      "INSERT INTO user_auth (user_id, password) VALUES (?,?)"
    );

    // Transaction för att göra det möjligt att ha inlogg och användarinformation på samma endpoint.
    // Transaction körs och kollar så att operationerna går ihop annars funkar det inte att lägga till användare.
    const transaction = db.transaction(() => {
      const resultUsers = stmtUsers.run(name, email);
      const resultUsers_auth = stmtUsers_auth.run(userId, password);

      // Error meddelande om användare inte kan läggas till
      if (resultUsers.changes === 0 || resultUsers_auth.changes === 0) {
        return res.status(400).json({ error: "Can not create user" }); //SKA ÄNDRAS TILL NÅGOT BÄTTRE
      }
    });
    transaction();

    res.status(201).json({ message: "Användare skapad", userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Hämta alla användare
export const getUsers = (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();

    if (users.length === 0) {
      return res.status(404).json({ message: "Inga användare hittas" });
    }
    res.json({ users });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Hämta en användare med visst ID
export const getUser = (req, res) => {};

//Ta bort en användare
export const deleteUser = (req, res) => {};

// Ändra viss information kring användare
export const patchUser = (req, res) => {};

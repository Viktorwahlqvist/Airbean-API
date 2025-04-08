import { nanoid } from "nanoid";
import db from "../database/db.js";

// Lägga till en ny användare
export const addUser = (req, res) => {
  const { name, username, email, password } = req.body;
  const userId = nanoid();

  //
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i" });
  }
  // Gör en try för att lägga till en användare i databasen
  // Där användaren som skapas i users ska kopplas ihop med den user_auth tabel.
  try {
    const stmtUsers = db.prepare(
      "INSERT INTO users (id, name, email) VALUES (?,?,?)"
    );
    const stmtUsers_auth = db.prepare(
      "INSERT INTO user_auth (user_id, username, password) VALUES (?,?,?)"
    );

    // Transaction för att göra det möjligt att ha inlogg och användarinformation på samma endpoint.
    // Transaction körs och kollar så att operationerna går ihop annars funkar det inte att lägga till användare.
    const transaction = db.transaction(() => {
      console.log(userId);

      const resultUsers = stmtUsers.run(userId, name, email);
      const resultUsers_auth = stmtUsers_auth.run(userId, username, password);

      // Error meddelande om användare inte kan läggas till
      if (resultUsers.changes === 0 || resultUsers_auth.changes === 0) {
        return res.status(400).json({ error: "Användaren kunde inte skapas" }); //SKA ÄNDRAS TILL NÅGOT BÄTTRE
      }
    });
    transaction();
    // status meddelande retunerad som JSON ifall användaren kan skapas.
    res.status(201).json({ message: "Användare skapad", userId }); //Slumpat id ges till användaren.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Hämta alla användare
export const getUsers = (req, res) => {
  try {
    const usersResult = db.prepare("SELECT * FROM users").all();
    console.log("Användare:", usersResult.length);

    //Om det inte finns någon användare i users table så skickas error meddelande tillbaka
    if (usersResult.length === 0) {
      return res.status(404).json({ message: "Inga användare hittas" });
    }
    //Retunerar ett JSON svar
    res.status(200).json(usersResult);

    // Om det inte fungerar skickas ett error meddelande om fel.
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Hämta en användare med visst ID
export const getUserById = (req, res) => {
  const userId = req.params.id;

  // En try för att kunna hämta en användare utifrån tilldelat id
  try {
    const userIdstmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const userById = userIdstmt.get(userId);

    if (userById) {
      console.log("User with id:", userById);
      res.json(userById);

      return userById;
    } else {
      res.status(404).json({ message: "User not found" });
      console.log("No user with that Id");
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Ta bort en användare
export const deleteUserById = (req, res) => {
  const userId = req.params.id;

  try {
    const deleteUserByIdstmt = db.prepare("DELETE FROM users WHERE id = ?");
    const deleteUserResult = deleteUserByIdstmt.run(userId);

    // Om ändringar kring att hämta id från user table för att radera är större än inget så kommer
    // användaren raderas ifrån databasen
    if (deleteUserResult.changes > 0) {
      console.log(`Användare med ${userId} är raderad`);
      res.status(204).json({ message: `Användare med ${userId} är raderad` });
    } else {
      // Om inte användaren med det ID man skickat med finns får man ett felmeddelande tillbaka
      console.log(`Användare med id: ${userId} hittas inte`);
      res
        .status(404)
        .json({ message: `Användare med id: ${userId} hittas inte` });
    }

    // Hämtar eventuell error om det finns någon
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "server error" });
  }
};

  // Ändra viss information kring användare
export const patchUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  //Skapar en variabel med en array för att lagra nya uppdateringar
  const userChanges = [];
  const values = [];
  // Nytt namn pushas in i arrayen
  if (name) {
    userChanges.push("name=?");
    values.push(name);
  }
  // Ny mejl pushas in i arrayen
  if (email) {
    userChanges.push("email=?");
    values.push(email);
  }
  // Om varken namn eller mail är ifyllt så retuneras ett status 400 error meddelande
  if (userChanges === 0) {
    res.status(400).json({ message: "Namn eller mejl inte ifyllt" });
  }

  // nya ändringarna pushas in på id.
  values.push(id);

  const changeStmt = `UPDATE users SET ${userChanges.join(", ")} WHERE id = ?`;

  db.run(changeStmt, values, function (error) {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Ingen användare hittas" });
    }

    res.json({ message: "Användarinformation uppdaterad" });
  });
};



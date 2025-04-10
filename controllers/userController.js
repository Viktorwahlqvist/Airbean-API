import { nanoid } from "nanoid";
import db from "../database/db.js";

// Lägga till en ny användare
export const addUser = async (req, res) => {
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

    //Skapar en krypterad verison av lösenordet. Krypterar alltså angivet lösenord samt gör 10 st salt turnes, blandar om och förvränger lösenordet.
    //Kommer alltså aldrig visa det verkliga lösenordet i databasen för användarens säkerhet.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction för att göra det möjligt att ha inlogg och användarinformation på samma endpoint.
    // Transaction körs och kollar så att operationerna går ihop annars funkar det inte att lägga till användare.
    const transaction = db.transaction(() => {
      console.log(userId);

      const resultUsers = stmtUsers.run(userId, name, email);
      const resultUsers_auth = stmtUsers_auth.run(userId, username, hashedPassword);

      // Error meddelande om användare inte kan läggas till
      if (resultUsers.changes === 0 || resultUsers_auth.changes === 0) {
        return res.status(400).json({ error: "Användaren kunde inte skapas" });
      }
    });
    transaction();
    // status meddelande retunerad som JSON ifall användaren kan skapas.
    res.status(201).json({ message: "Användare skapad", userId }); //Slumpat id ges till användaren.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gäst användare
export const guestUser = (req, res) => {
  const user_id = String(`GUEST_${nanoid()}`);
  const name = "-";
  const email = "-";

  try {
    const guestStmt = db.prepare(
      "INSERT INTO users (id, name, email) VALUES (?,?,?)"
    );

    const guestResult = guestStmt.run(user_id, name, email);

    /* Loggar dessa variabel i consolen för att se att dem är strängar och inget annat
    vilket ser att vi gör rätt när vi lägger in rätt typ vid gäst användning.*/

    console.log("user_id:", user_id, typeof user_id);
    console.log("name:", name, typeof name);
    console.log("email:", name, typeof name);

    /* If stats om något i vår skapade gäst inte stämmer, skickas tillbaka ett error meddelande med status kod*/
    if (guestResult.changes === 0) {
      return res.status(400).json({ error: "Gäst användare kan inte skapas" });
    }

    /* Vår gästanvändare skapas utan att spara i databasen*/
    res.json({ message: "Gäst skapad", user_id });
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
      res.status(201).json({ message: `Användare med ${userId} är raderad` });
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

  /* Hämtar name, username, email och password från vår db table users. Hämtar userId från URL. If sats med error status om inga fält är 
  nämnda. */
  const { name, username, email, password } = req.body;


  if(!name && !username && !email && !password) {
    res.status(400).json({error: "Inga fält specifierade"});
  }
  
  /* Ser till att updateUser har ett värde av UPDATE och ändra om till i users table. updateUserValues med en tom array för
  att pusha in ny data. Om man ändrar något av name, username, email och password så läggs det in i nya value array.*/
  let updateUser = "UPDATE users SET ";
  let updateUserValues = [];

  if(name) {
    updateUser += "name = ?, ";
    updateUserValues.push(name);
  }

  if(email) {
    updateUser += "email = ? ,";
    updateUserValues.push(email);
  }
  
  if(username) {
    updateUser += "username = ? ,";
    updateUserValues.push(username);
  }

  
  if(password) {
    updateUser += "password = ? ,";
    updateUserValues.push(password);
  }

  /* updateUser.slice visar att vi tar bort , tecknet och kan placera ett WHERE-krav för user id. För att vi ska kunna
identifiera rätt användare*/
  updateUser = updateUser.slice(0, -2);
  updateUser+= "WHERE id = ?";
// Lägger till användarens ID i slutet på vår array för att koppla uppdateringen med rätt användare. 
  updateUserValues.push(req.user_id)

  try{
    const updateUserStmt = db.prepare(updateUser);
    const updateUserResult = updateUserStmt.run(...updateUserValues);

    if(updateUserResult === 0){
      return res.status(404).json( {error: "Inga ändringar gjorda, användaren hittas inte"} );
    }
    res.json( {message: "Användarens information är uppdaterad"} );
  } catch(error) {
    res.status(500).json({error:error.message});
  }
};

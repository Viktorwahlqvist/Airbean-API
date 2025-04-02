import { nanoid } from "nanoid";
import db from "../database/db";



// Lägga till en ny användare 
export const addUser = (req,res) => {
    const { username, name, email } = req.body;
    const userId = nanoid();
  
     
    try{
        const stmtUsers = db.prepare("INSERT INTO users (username, name, email) VALUES (?,?,?,?)");
        const stmtUsers_auth = db.prepare ("INSERT INTO users_auth (user_id, username, password) VALUES (?,?,?)")
        const result = stmt.run(username, name, email);

        if(result.changes === 0){
            return res.status(400).json({error:"Kan inte skapa användare" }); //SKA ÄNDRAS TILL NÅGOT BÄTTRE
        }
           
        res
        .status(201)
        .json({message: "Användare skapad", userId }) 

    }catch(error){
        res.status(500).json({error: error.message})};
};

//Ta bort en användare
export const deleteUser = (req,res) => {

};

// Ändra viss information kring användare 
export const patchUser = (req,res) => {

};

// Hämta en användare med visst ID
export const getUser = (req,res) =>  {

};

//Hämta alla användare
export const getUsers = (req,res) => {
    try{
        const users = db.prepare("SELECT * FROM users").all();
        res.json({ users })
    } catch(error){
        res.status(500).json({error: error.message})
    }
};



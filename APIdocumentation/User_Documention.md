# API dokumentation kring USERS

- Översikt:
Går under endpoint /users och /users/:id. Under denna skapas anvädare och också för att retunera alla användare i databasen samt ändra iformation om användare.
I vårat projekt har vi använt nanoid för att generera slumpat id i string format. 
Finns också kryptering för lösenord med bcryptjs.


## POST requests
Skapa en ny användare med POST request. Hämtar namn, username, email och password ifrån users TABLE i vår database.db. 
SKapar ett unikt id som sträng med nanoid. 

Två statements gjorda för att TABLE users och TABLE users_auth (som används vid inloggning), ska gå under samma endpoint vid skapandet av en 
användare. 

bycript används för att kryptera lösenordet som skapas med användaren, en säkerhetsåtgärd för 
användaren då lösenordet inte kommer att sparas som det skapas i databasen, utan kommer att förvrängas om (vid detta fall) 10 gånger. 

- Exempel: 

BEGIN
kazDvtOc4R2oGAukRIRUk
Mittlösenord
INSERT INTO users (id, name, email) VALUES ('kazDvtOc4R2oGAukRIRUk','Sara','saragrupp3@mail.se')
INSERT INTO user_auth (user_id, username, password) VALUES ('kazDvtOc4R2oGAukRIRUk','SaraJohlu','$2b$10$OvwyCkXvbYuRjiU.xaNtdecao'/*+28 bytes*/)
COMMIT


## GET requests
Hämta alla användare och viss användare med angivet id vid registrering. 

- http:localhost:3000/users 
Hämtar alla användare som registrerats på databasen

- http://localhost:3000/users:id
Hämtar information om en användare via ID som blivit tilldelat till den personen som skapats. 

- Exempel

GET http:localhost:3000/users 

	{
		"id": "LXcK0ICCJR0iE7koauwai",
		"name": "Sara",
		"email": "saragrupp3@mail.se"
	},
	{
		"id": "5YjJdVj7eYzq-ErF1JRis",
		"name": "Madelen",
		"email": "madelengrupp3@mail.se"
	},
	{
		"id": "h6oaO9cNRYd-lqjq4MI-6",
		"name": "Viktor",
		"email": "viktorgrupp3@mail.se"
	},
	{
		"id": "XO8m8ORri8Sc7nC6MIGKR",
		"name": "Amanda",
		"email": "amandagrupp3@mail.se"
	},
	{
		"id": "0R-ZYK1f7AEU3UtvLXLoV",
		"name": "Therese",
		"email": "theresegrupp3@mail.se"
	},

GET http://localhost:3000/users/LXcK0ICCJR0iE7koauwai

{
	"id": "LXcK0ICCJR0iE7koauwai",
	"name": "Sara",
	"email": "saragrupp3@mail.se"
}

- GET request gjort för att kunna beställa kaffe även som gäst. Funktion skapad som en post men hämtas med en get request. 
- Exempel: 
GET http://localhost:3000/guest


## DELETE requests

## PATCH requests
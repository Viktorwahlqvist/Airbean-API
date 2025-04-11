# API dokumentation kring USERS
Översikt:
Går under endpoint /users. Under denna skapas anvädare, retunera användare med användning av ID, ta bort en användare och även ändra användarinformation.

Använder userValidation för att validera all kod och därför använda den i våra routes. 
- Exempel på route: 
userRoutes.post("/users", userValidation, getUserById);
På detta sätt skrivs id in i bodyn när man ska hämta eller posta en användare.  

Använt nanoid för att generera slumpat id i sträng format. 
Finns också kryptering för lösenord med bcryptjs.


## POST requests
### Skapa en ny användare med POST request. Hämtar namn, username, email och password ifrån users TABLE i vår database.db. 
Skapar ett unikt id som sträng med nanoid. 

Två statements gjorda för att TABLE users och TABLE users_auth (som används vid inloggning), ska gå under samma endpoint vid skapandet av en 
användare. 

bycript används för att kryptera lösenordet som skapas med användaren, en säkerhetsåtgärd för 
användaren då lösenordet inte kommer att sparas som det skapas i databasen, utan kommer att förvrängas om (vid detta fall) 10 gånger. 

- Exempel loggat i console:
  retunerar
**BEGIN
kazDvtOc4R2oGAukRIRUk
Mittlösenord
INSERT INTO users (id, name, email) VALUES ('kazDvtOc4R2oGAukRIRUk','Sara','saragrupp3@mail.se')
INSERT INTO user_auth (user_id, username, password) VALUES ('kazDvtOc4R2oGAukRIRUk','SaraJohlu','$2b$10$OvwyCkXvbYuRjiU.xaNtdecao'/*+28 bytes*/)
COMMIT**

- Exempel på att lägga till användare:


### En post request görs för att hämta en specifik användare med hjälp utav dess id. Är egentligen en GET request.
- Exempel på att hämta en användare med id.
http://localhost:3000/users

## GET requests
### Hämta alla användare som är registrerade på databasen.
- http://localhost:3000/users 

- Exempel på GET request

GET http://localhost:3000/users 
retunerar

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


### GET request
Mötlighet till att kunna beställa även som gäst. Funktion skapad som en post men hämtas med en get request. 
Den som beställer som gäst får ett specifikt gäst id och sparas inte i databasen men kopplas ihop med order med order id.

- Body:
{
namn: "-"
email:"-"
}

- Exempel: 
GET http://localhost:3000/guest
retuneras
{
	"message": "Gäst skapad",
	"user_id": "GUEST_zrZ9ZDR-8utZET680uh8v"
}

## DELETE requests

Att ta bort en användare hanteras likadant som att hämta en användare med id. 
http://localhost:3000/users 
userRoutes.delete("/users", userValidation, deleteUserById);
id skickas in i bodyn och retunerat svar blir 
{
	"user_id": "hkB3JTf6FMxLIQFvVlYlu"
}

Console loggas
DELETE FROM users WHERE id = 'hkB3JTf6FMxLIQFvVlYlu'
Användare med hkB3JTf6FMxLIQFvVlYlu är raderad

## PATCH requests
http://localhost:3000/api/users

Användarinformation kan ändras med patch request. 
Skickar in ny data med UPDATE för vår users TABLE. 

- Exempel på en request:
PATCH
{
	"user_id": "qaeQ9jPu8S2C4u0-tWDuL",
	"name":"Sara",
	"email": "Sara2mail@mail.se"
}
- retuneras med svar
{
	"message": "Användarens information är uppdaterad"

}

- Loggas i console 
User Id validation succesful
UPDATE users SET name = 'Sara', email = 'Sara2mail@mail.se'WHERE id = 'qaeQ9jPu8S2C4u0-tWDuL'


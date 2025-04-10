API-dokumentation för Assortments

- Översikt
Detta API möjliggör hantering av ett sortiment av produkter för Airbean API, inklusive hämting, tillägg, uppdatering och borttagning av produkter. API:et stöder olika 'query' parametrar för sortering och filtrering av produkter. 


GET /assortment
- http://localhost:3000/assortment
- Hämtar alla produkter i sortimentet, sorterade alfabetiskt efter titel

- http://localhost:3000/assortment/sorted?category=Kaffedrycker
- Hämtar alla Kaffedrycker

Exempel på anrop:
Fråmgångsrikt svar (200 OK)
{
    "menu":[
      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      }
    ]
}

Fel (500-Serverfel)
{
    "error": "Database error"
}


POST /assortment
- http://localhost:3000/assortment
- Lägger till en ny produkt i sortimentet.

Exempel på anrop:
Framgångsrikt svar (201 Created)
{
  "message": "Produkten har lagts till",
  "product": {
    "id":3,
        "title":"Cappuccino",
        "desc":"Bryggd på månadens bönor.",
        "price":49
  }
}

Fel (400- Saknade fält)
{
  "error": "All fields are required. Please provide a title, description, and price."
}


PUT /assortment/:id
- http://localhost:3000/assortment/3
- Uppdaterar en hel produkt med helt nytt innehåll

Exemel på anrop:
Framgångsrikt svar (200 OK)
{
  "message": "Produkten har uppdaterats",
  "product": {
    "id": 3,
    "title": "Cappuccino Deluxe",                                       <--
    "description": "En cappuccino med extra skummad mjölk och kanel.",  <--
    "price": 45                                                         <--
  }
}

Fel (404 - Produkten hittades inte)
{
  "error": "Product not found."
}


PATCH /assortment/:id
- http://localhost:3000/assortment/3
- Uppdaterar delar av en produkt

Exempel på anrop:
Framgångsrikt svar (200 OK)
{
  "message": "Produkten har uppdaterats",
  "product": {
    "id": 3,
    "title": "Cappuccino Deluxe",
    "description": "En cappuccino med extra skummad mjölk och kanel.",
    "price": 100                                                  <--
  }
}

Fel (400 - Ogiltigt värde)
{
    error: "At least one field (title, description, or price) must be updated."
}


DELETE /assortment/:id
- http://localhost:3000/assortment/3
- Raderar en produkt från sortiment

Exempel på anrop:
Framgångsrikt svar (200 OK)
{
    "message": Produkt raderad"
}

Fel (404 - Produkten hittades inte)
{
    "error": "Product not found."
}




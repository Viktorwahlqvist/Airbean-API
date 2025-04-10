API-dokumentation för Kontaktinformation

- Översikt
Detta API möjliggör hämtning av kontaktinformation för Airbean samt en kort presentationstext om företaget. Endpoints returnerar kontaktuppgifter såsom adress, telefonnummer, email och länkar till sociala medier. Anropet sker via en GET-request mot /about.

GET /about
- Endpoint: http://localhost:3000/about
- Beskrivning: Hämtar kontaktuppgifter och information om företaget.

Exempel på anrop:
Framgångsrikt svar (200 OK)
{
  "info": [
    {
      "adress": "123 Coffee Lane, Brew City, CA 12345",
      "telefonnummer": "+42 123 456789",
      "email": "airbean@gmail.com",
      "socialMedia": {
        "facebook": "https://www.facebook.com/airbean",
        "instagram": "https://www.instagram.com/airbean",
        "twitter": "https://www.twitter.com/airbean"
      }
    }
  ],
  "aboutus": [
    {
      "title": "About Us",
      "description": "Airbean is a coffee shop that specializes in serving high-quality coffee and providing a cozy atmosphere for our customers. Our mission is to create a welcoming space where people can come together, enjoy great coffee, and connect with one another."
    }
  ]
}


Fel (500-Serverfel)
{
    "error": "Databasfel"
}


API-dokumentation för Kontaktinformation

- Översikt
Detta API möjliggör hämtning av kontaktinformation för Airbean. Endpoints returnerar kontaktuppgifter såsom adress, telefonnummer, email och länkar till sociala medier. Anropet sker via en GET-request mot /contact.

GET /contact
- Endpoint: http://localhost:3000/contact
- Beskrivning: Hämtar kontaktinformationen för Airbean.

Exempel på anrop:
Framgångsrikt svar (200 OK)
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

Fel (500-Serverfel)
{
    "error": "Databasfel"
}


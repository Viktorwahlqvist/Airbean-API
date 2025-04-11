# Airbean-API
Examinerande projektuppgift - Backend

Projektet handlar om att skapa ett backend-API för en tjänst som erbjuder beställning av kaffe med drönarleverans. 



### Figma
---

I vårt projekt har vi använt Figma för att skapa en tydlig struktur och visualisera hur alla delar är kopplade till varandra. Vi har även inkluderat diagram som visar flödet mellan olika komponenter och tjänster, samt vår mappstruktur för att ge en överblick över hur vi har organiserat projektet.


![Screenshot 2025-04-10 123702](https://github.com/user-attachments/assets/d87bf6ed-f9ad-483e-9ff5-39b656bfc5a9)
--- 
### Trello
---
För att hantera och följa upp våra arbetsuppgifter och användarhistorier har vi använt Trello. Det har gjort det enkelt för oss att organisera och prioritera uppgifter, samt att hålla koll på vad vi har slutfört och vad som återstår att göra.



![Screenshot 2025-04-10 123848](https://github.com/user-attachments/assets/b9f30686-b192-45da-9b51-2d793244a2bf)
---

## Gör såhär för att klona och köra projektet: 

1. Klona repository i terminalen:
   git clone https://github.com/Viktorwahlqvist/Airbean-API.git

2. Installera dependancies. Navigera till projektmappen och installera alla nödvändiga npm-paket:
   cd Airbean-API
   npm install

3. Starta servern:
   npm start


### Dependencies:
- bcryptjs 
- better-sqlite3 
- cors 
- express
- nanoid / uuid
- node-fetch
---

### Dokumentation:
[APIdokumentation](routes/assortment_API.md
[APIdokumentation](routes/assortment_API.md
[APIdokumentation](routes/assortment_API.md
[APIdokumentation](routes/assortment_API.md
---


## Websockets
### Om vi skulle implementera Websockets i projektet, skulle det ge följande funktioner och mervärde:

- Live-uppdateringar av beställningar: Användaren får statusuppdateringar i realtid, t.ex. när beställningen skickas eller levereras.

- Produktuppdateringar i realtid: Förändringar i sortimentet visas direkt för alla användare.

- Supportchatt: Möjlighet till direktkommunikation med support via livechatt.
   

 ### Mervärde:
  
- Snabbare och smidigare interaktioner utan att sidan behöver laddas om.

- Mindre belastning på servern tack vare färre HTTP-förfrågningar.
  
  

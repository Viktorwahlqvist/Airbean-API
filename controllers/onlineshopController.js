// controllers/onlineshopController.js
import fetch from "node-fetch";

// Hämta hela menyn från GitHub
export const getMenu = async (req, res) => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/rachel-zocom/Airbean-API/main/menu.json");

    if (!response.ok) {
      console.error("Fetch misslyckades:", response.status);
      return res.status(500).json({ error: `Fel från GitHub: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fel vid hämtning av meny:", error);
    res.status(500).json({ error: "Kunde inte hämta menyn." });
  }
};

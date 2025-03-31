const express = require('express');
const app = express();
const PORT = 5005; // eller 3001 om du föredrar det

app.use(express.json());

// Test-rutt
app.get('/api/hej', (req, res) => {
  res.json({ message: 'Hej Tessaan! 🎉 Du är grym!' });
});

app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.send('Server KriyaGaleri berhasil berjalan!');
});

// run server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
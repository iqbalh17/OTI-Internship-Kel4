const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Koneksi idle ke Neon terputus (wajar untuk serverless):', err.message);
});

pool.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke database Neon:', err.stack);
  } else {
    console.log('Berhasil terhubung ke database Neon!');
  }
});

module.exports = pool;
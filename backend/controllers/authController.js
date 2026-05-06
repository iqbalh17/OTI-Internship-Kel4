const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { noWa, nama, asalBanjar, password } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE no_wa = $1', [noWa]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Nomor WA sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (no_wa, nama, asal_banjar, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [noWa, nama, asalBanjar, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi Berhasil!", user: newUser.rows[0].no_wa });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Gagal menyimpan data ke database" });
  }
};

const login = async (req, res) => {
  const { noWa, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE no_wa = $1', [noWa]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Nomor WA tidak ditemukan" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: "Login Berhasil",
      token,
      user: { id: user.id, nama: user.nama, banjar: user.asal_banjar }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Kesalahan server" });
  }
};

module.exports = { register, login };
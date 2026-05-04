const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Cek apakah ada token di Headers (Biasanya formatnya: "Bearer <token_acak>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token-nya saja (buang kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token dengan SECRET_KEY yang ada di file .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Simpan data ID user dari token ke dalam request (agar bisa dibaca oleh controller)
      req.user = decoded; 

      next(); // Izinkan masuk ke rute (controller) selanjutnya
    } catch (error) {
      res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Akses ditolak, tidak ada token" });
  }
};

module.exports = { protect };
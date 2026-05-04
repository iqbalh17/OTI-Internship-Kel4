const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // File disimpan di folder uploads/
  },
  filename: function (req, file, cb) {
    // Menamai file: timestamp + ekstensi asli (contoh: 16987654321-foto.jpg)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Terima segala jenis file untuk sementara (foto dan audio)
const upload = multer({ storage: storage });

module.exports = upload;
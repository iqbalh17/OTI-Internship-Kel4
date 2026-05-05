const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Konfigurasi Cloudinary dengan data dari .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup penyimpanan Multer ke Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kriyagaleri_uploads', // Nama folder yang akan otomatis dibuat di Cloudinary
    resource_type: 'auto', // PENTING: 'auto' agar bisa menerima gambar dan audio sekaligus
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp3', 'wav', 'm4a']
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
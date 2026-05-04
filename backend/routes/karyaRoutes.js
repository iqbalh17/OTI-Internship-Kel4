const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { 
  uploadKarya, 
  getBeranda, 
  getProfile, 
  getDetailKarya,
  deleteKarya 
} = require('../controllers/karyaController');

router.post('/upload', protect, upload.any(), uploadKarya);
router.delete('/:id', protect, deleteKarya);
router.get('/beranda', protect, getBeranda);
router.get('/profile/:id', protect, getProfile);
router.get('/detail/:id', protect, getDetailKarya);

module.exports = router;
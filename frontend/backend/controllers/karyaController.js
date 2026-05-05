const pool = require('../config/db');

const uploadKarya = async (req, res) => {
  const { userId, judul, visibilitas, steps } = req.body; 
  // steps akan berisi array dari frontend berupa urutan step dan teks

  try {
    // 1. Simpan data Karya utama dulu
    const karyaResult = await pool.query(
      'INSERT INTO karya (user_id, judul, visibilitas) VALUES ($1, $2, $3) RETURNING id',
      [userId, judul, visibilitas || 'publik']
    );
    const karyaId = karyaResult.rows[0].id;

    // 2. Simpan setiap step-nya
    // Karena bisa menerima banyak file (foto/audio), kita proses satu per satu
    const parsedSteps = JSON.parse(steps); // Parse teks data step
    
    for (let i = 0; i < parsedSteps.length; i++) {
      let fotoUrl = "";
      let audioUrl = "";

      // Mencari file yang sesuai dengan step ini (dicocokkan dari nama field)
      if (req.files) {
        const fotoFile = req.files.find(f => f.fieldname === `foto_step_${i}`);
        const audioFile = req.files.find(f => f.fieldname === `audio_step_${i}`);
        
        if (fotoFile) fotoUrl = fotoFile.path;
        if (audioFile) audioUrl = audioFile.path;
      }

      await pool.query(
        'INSERT INTO karya_steps (karya_id, step_number, foto_url, keterangan_teks, audio_url) VALUES ($1, $2, $3, $4, $5)',
        [karyaId, i + 1, fotoUrl, parsedSteps[i].teks, audioUrl]
      );
    }

    res.status(201).json({ message: "Karya beserta step-by-step berhasil diunggah!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengunggah karya" });
  }
};

// Fitur 1: Mengambil Data untuk Beranda (Feed)
const getBeranda = async (req, res) => {
  // Karena nanti rute ini melewati satpam JWT, kita bisa ambil ID user dari token
  const userId = req.user.id; 

  try {
    // 1. Cari tahu dulu si pembaca ini berasal dari banjar mana
    const userResult = await pool.query('SELECT asal_banjar FROM users WHERE id = $1', [userId]);
    const asalBanjarPembaca = userResult.rows[0].asal_banjar;

    // 2. Query Pintar: Ambil yang 'publik' ATAU yang 'banjar' TAPI pembuatnya dari banjar yang sama
    const query = `
      SELECT 
        k.id AS karya_id, 
        k.judul, 
        k.visibilitas,
        k.created_at, 
        u.nama AS seniman, 
        u.asal_banjar,
        (SELECT foto_url FROM karya_steps ks WHERE ks.karya_id = k.id ORDER BY step_number DESC LIMIT 1) AS thumbnail_url
      FROM karya k
      JOIN users u ON k.user_id = u.id
      WHERE k.visibilitas = 'publik' OR (k.visibilitas = 'banjar' AND u.asal_banjar = $1)
      ORDER BY k.created_at DESC
    `;
    
    // Masukkan variabel asalBanjarPembaca ke dalam $1
    const result = await pool.query(query, [asalBanjarPembaca]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data beranda" });
  }
};

// Fitur 2: Mengambil Data Profil & Karyanya
const getProfile = async (req, res) => {
  const profileUserId = req.params.id; // ID profil seniman yang sedang dilihat
  const readerId = req.user.id; // ID user yang sedang buka aplikasi (dari Token)

  try {
    // 1. Cari tahu banjar si pembaca
    const readerResult = await pool.query('SELECT asal_banjar FROM users WHERE id = $1', [readerId]);
    const readerBanjar = readerResult.rows[0].asal_banjar;

    // 2. Ambil data profil senimannya
    const userResult = await pool.query(
      'SELECT id, nama, asal_banjar, no_wa, created_at FROM users WHERE id = $1',
      [profileUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Seniman tidak ditemukan" });
    }

    // 3. Query Pintar: Filter karya berdasarkan hak akses si pembaca
    const karyaResult = await pool.query(`
      SELECT 
        k.id AS karya_id, 
        k.judul, 
        k.visibilitas, 
        k.created_at,
        (SELECT foto_url FROM karya_steps ks WHERE ks.karya_id = k.id ORDER BY step_number DESC LIMIT 1) AS thumbnail_url
      FROM karya k
      JOIN users u ON k.user_id = u.id
      WHERE k.user_id = $1 
        AND (k.visibilitas = 'publik' OR (k.visibilitas = 'banjar' AND u.asal_banjar = $2))
      ORDER BY k.created_at DESC
    `, [profileUserId, readerBanjar]);

    res.status(200).json({
      profil: userResult.rows[0],
      koleksi_karya: karyaResult.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

// Fitur 3: Mengambil Detail Karya (Sudah Aman)
const getDetailKarya = async (req, res) => {
  const { id } = req.params; 
  const readerId = req.user.id; 

  try {
    const readerResult = await pool.query('SELECT asal_banjar FROM users WHERE id = $1', [readerId]);
    const readerBanjar = readerResult.rows[0].asal_banjar;

    // Tambahkan u.no_wa di bagian SELECT
    const karyaInfo = await pool.query(`
      SELECT k.*, u.nama AS seniman, u.asal_banjar, u.no_wa 
      FROM karya k 
      JOIN users u ON k.user_id = u.id 
      WHERE k.id = $1
        AND (k.visibilitas = 'publik' OR (k.visibilitas = 'banjar' AND u.asal_banjar = $2))
    `, [id, readerBanjar]);

    if (karyaInfo.rows.length === 0) {
      return res.status(403).json({ message: "Karya tidak ditemukan atau Anda tidak memiliki akses" });
    }

    let detail = karyaInfo.rows[0];

    // Sisipkan Trik WhatsApp di sini
    let wa_format = detail.no_wa;
    if (wa_format && wa_format.startsWith('0')) {
      wa_format = '62' + wa_format.substring(1);
    }
    detail.no_wa_whatsapp = wa_format;

    const steps = await pool.query('SELECT * FROM karya_steps WHERE karya_id = $1 ORDER BY step_number ASC', [id]);

    res.status(200).json({
      detail: detail,
      steps: steps.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail karya" });
  }
};

const deleteKarya = async (req, res) => {
  const { id } = req.params;
  const cloudinary = require('cloudinary').v2; // Panggil cloudinary

  try {
    const steps = await pool.query('SELECT foto_url, audio_url FROM karya_steps WHERE karya_id = $1', [id]);

    // Hapus file dari Cloudinary
    for (const step of steps.rows) {
      if (step.foto_url) {
        // Ambil ID file dari URL Cloudinary
        const publicId = 'kriyagaleri_uploads/' + step.foto_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      if (step.audio_url) {
        const publicId = 'kriyagaleri_uploads/' + step.audio_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' }); // audio di cloudinary masuk kategori video
      }
    }

    // Hapus data dari database
    const deleteResult = await pool.query('DELETE FROM karya WHERE id = $1 RETURNING id', [id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Karya tidak ditemukan" });
    }

    res.status(200).json({ message: "Karya dan file di Cloudinary berhasil dihapus!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus karya" });
  }
};

module.exports = { 
  uploadKarya, 
  getBeranda, 
  getProfile, 
  getDetailKarya,
  deleteKarya
};
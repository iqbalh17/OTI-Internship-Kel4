'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const visibilitasList = ['Semua Orang (Publik)', 'Banjar Saja', 'Hanya Saya']
const kategoriList = ['Anyaman', 'Kayu', 'Perak', 'Tenun']

export default function Unggah() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null) // Ref untuk input audio
  
  const [judul, setJudul] = useState('')
  const [foto, setFoto] = useState<string | null>(null)
  const [cerita, setCerita] = useState('')
  const [audioUtama, setAudioUtama] = useState<string | null>(null) // State untuk Voice Note
  const [visibility, setVisibility] = useState('Semua Orang (Publik)')
  const [kategori, setKategori] = useState('Anyaman')
  const [langkah, setLangkah] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Ambil data langkah-langkah dari localstorage saat kembali dari halaman Tambah Langkah
  useEffect(() => {
    const savedLangkah = localStorage.getItem('langkah_temp')
    if (savedLangkah) {
      setLangkah(JSON.parse(savedLangkah))
    }
  }, [])

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFoto(url)
    }
  }

  // Handler untuk Voice Note
  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioUtama(url)
    }
  }

  const handleSelesai = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // 1. Text Data
      const userId = localStorage.getItem('userId') || '2' // Fallback ke ID 2
      formData.append('userId', userId)
      formData.append('judul', judul || 'Karya Tanpa Judul')
      formData.append('deskripsi', cerita) 
      
      // Mapping Visibilitas
      let visValue = 'publik'
      if (visibility === 'Banjar Saja') visValue = 'banjar'
      if (visibility === 'Hanya Saya') visValue = 'privat'
      formData.append('visibilitas', visValue)

      // Mapping Kategori
      formData.append('kategori', kategori)

      // 2. Format array steps
      const stepsArray = langkah.map((l) => ({
        teks: l.deskripsi || "" 
      }))
      formData.append('steps', JSON.stringify(stepsArray))

      // 3. Convert & Append File Gambar/Audio Langkah
      for (let i = 0; i < langkah.length; i++) {
        const l = langkah[i]
        
        if (l.img) {
          const response = await fetch(l.img)
          const blob = await response.blob()
          const file = new File([blob], `foto_step_${i}.png`, { type: blob.type })
          formData.append(`foto_step_${i}`, file)
        }

        if (l.audioUrl) {
          const response = await fetch(l.audioUrl)
          const blob = await response.blob()
          const file = new File([blob], `audio_step_${i}.mp3`, { type: blob.type })
          formData.append(`audio_step_${i}`, file)
        }
      }

      // 4. Append Foto Utama
      if (foto) {
        const response = await fetch(foto)
        const blob = await response.blob()
        const fileFotoUtama = new File([blob], 'thumbnail.png', { type: blob.type })
        formData.append('thumbnail', fileFotoUtama) 
      }

      // 5. Append Audio Utama (Voice Note)
      if (audioUtama) {
        const response = await fetch(audioUtama)
        const blob = await response.blob()
        const fileAudio = new File([blob], 'voicenote.mp3', { type: blob.type })
        // Sesuaikan nama key 'audio' dengan yang diminta oleh backend kamu
        formData.append('audio', fileAudio) 
      }

      // 6. Kirim ke API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/karya`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        localStorage.removeItem('langkah_temp')
        router.push('/beranda')
      } else {
        const errData = await res.json()
        console.error('Gagal upload:', errData)
        alert('Gagal mengunggah karya.')
      }

    } catch (error) {
      console.error('Terjadi kesalahan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pt-16 pb-24 px-5 gap-5"}>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#C04000]">Upload Karya Baru</h1>
          <p className="text-sm text-gray-600 mt-1">Bagikan proses atau hasil karya anda hari ini.</p>
        </div>

        {/* Kolom Input Judul */}
        <div>
          <p className="text-sm font-bold mb-2 text-black">Judul Karya</p>
          <div className="bg-white rounded-2xl px-4 py-3">
            <input
              type="text"
              placeholder="Masukkan judul karya..."
              className="bg-transparent text-sm outline-none w-full text-black"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
          </div>
        </div>

        {/* Input Foto */}
        <div
          className="w-full h-48 bg-gray-300 rounded-2xl overflow-hidden relative cursor-pointer border-2 border-[#C04000]/30"
          onClick={() => fileRef.current?.click()}
        >
          {foto ? (
            <Image src={foto} alt="foto karya" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <Image src="/camera.webp" alt="camera" width={28} height={28} />
              </div>
              <p className="text-sm text-gray-500">Unggah Foto Utama (Opsional)</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />

        {/* Kolom Cerita / Deskripsi & Voice Note */}
        <div>
          <p className="text-sm font-bold mb-2 text-black">Ceritakan tentang karya ini</p>
          <div className="flex flex-col bg-white rounded-2xl px-4 py-3">
            <div className="flex items-end gap-2 relative">
              <Image src="/pencil.webp" alt="pencil" width={20} height={20} className="mb-1 shrink-0" />
              <textarea
                placeholder="Masukkan deskripsi singkat..."
                className="bg-transparent text-sm outline-none w-full text-black resize-none h-16 pr-10"
                value={cerita}
                onChange={(e) => setCerita(e.target.value)}
              />
              {/* Tombol Mic Utama */}
              <button 
                type="button" 
                className="absolute right-0 bottom-0 shrink-0"
                onClick={() => audioRef.current?.click()}
              >
                <Image src="/mic.webp" alt="mic" width={32} height={32} />
              </button>
              
              {/* Input Audio Hidden */}
              <input 
                ref={audioRef} 
                type="file" 
                accept="audio/*" 
                capture="user"
                onChange={handleAudio} 
                className="hidden" 
              />
            </div>

            {/* Preview Audio jika ada Voice Note yang diunggah */}
            {audioUtama && (
              <div className="mt-3 w-full border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-1">Voice Note terlampir:</p>
                <audio controls src={audioUtama} className="w-full h-8 outline-none" />
                <button 
                  type="button" 
                  onClick={() => setAudioUtama(null)} 
                  className="text-xs text-red-500 mt-2 font-medium"
                >
                  Hapus Voice Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* List Langkah */}
        {langkah.length > 0 && (
          <div className="flex flex-col gap-2">
            {langkah.map((l, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
                {l.img && (
                  <Image src={l.img} alt="langkah" width={50} height={50} className="rounded-xl object-cover w-14 h-14" />
                )}
                <p className="text-sm text-gray-700 flex-1 line-clamp-3 ">
                  {l.deskripsi || <span className="text-gray-400 italic">Menggunakan voice note</span>}
                </p>
                <Image src="/pencil.webp" alt="edit" width={20} height={20} className="shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Tombol Tambah Langkah */}
        <button
          onClick={() => router.push('/unggah/tambah-langkah')}
          className="w-full border-2 border-[#C04000] text-black rounded-full py-3 flex items-center justify-center gap-2 text-sm"
        >
          Tambahkan Langkah-langkah
          <Image src="/plus.webp" alt="plus" width={20} height={20} />
        </button>

        {/* Visibilitas */}
        <div>
          <p className="text-sm font-bold mb-2 text-black">Siapa yang bisa melihat?</p>
          <div className="bg-white rounded-2xl px-4 py-3">
            <select
              className="bg-transparent text-sm outline-none w-full text-black"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              {visibilitasList.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <p className="text-sm font-bold mb-2 text-black">Kategori Kerajinan</p>
          <div className="bg-white rounded-2xl px-4 py-3">
            <select
              className="bg-transparent text-sm outline-none w-full text-black"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              {kategoriList.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tombol Submit */}
        <button
          onClick={handleSelesai}
          disabled={isLoading}
          className={`w-full text-white font-bold py-4 rounded-full ${isLoading ? 'bg-gray-400' : 'bg-[#C04000]'}`}
        >
          {isLoading ? 'Mengunggah...' : 'Selesai & Unggah'}
        </button>

      </div>

      {/* Navbar Bawah */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#C04000] flex justify-around items-center py-3">
        <Link href="/beranda" className="flex flex-col items-center gap-1">
          <Image src="/home.webp" alt="home" width={24} height={24} />
          <p className="text-white text-[10px]">Beranda</p>
        </Link>
        <Link href="/unggah" className="flex flex-col items-center gap-1">
          <Image src="/upload.webp" alt="unggah" width={24} height={24} />
          <p className="text-white text-[10px]">Unggah</p>
        </Link>
        <Link href="/tutorial" className="flex flex-col items-center gap-1">
          <Image src="/tutorial.webp" alt="tutorial" width={24} height={24} />
          <p className="text-white text-[10px]">Tutorial</p>
        </Link>
        <Link href="/profil" className="flex flex-col items-center gap-1">
          <Image src="/profile.webp" alt="profil" width={24} height={24} />
          <p className="text-white text-[10px]">Profil Saya</p>
        </Link>
      </div>

    </div>
  )
}
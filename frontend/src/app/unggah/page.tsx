'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const stepsData = [
  { icon: '/camera.webp', judul: '1. Foto Karya Anda', desc: 'Ambil foto karya terbaik Anda untuk ditampilkan.' },
  { icon: '/pencil.webp', judul: '2. Tulis Keterangan', desc: 'Ceritakan proses dan detail karya Anda.' },
  { icon: '/upload.webp', judul: '3. Unggah Karya Anda', desc: 'Bagikan karya Anda ke seluruh komunitas.' },
]

const visibilitasList = ['Semua Orang (Publik)', 'Banjar Saja', 'Hanya Saya']
const kategoriList = ['Anyaman', 'Kayu', 'Perak', 'Tenun']

export default function Unggah() {
  const router = useRouter()
  
  const [judul, setJudul] = useState('')
  const [visibility, setVisibility] = useState('Semua Orang (Publik)')
  const [kategori, setKategori] = useState('Anyaman')
  const [langkah, setLangkah] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const savedLangkah = localStorage.getItem('langkah_temp')
    if (savedLangkah) setLangkah(JSON.parse(savedLangkah))

    const savedJudul = localStorage.getItem('judul_temp')
    if (savedJudul) setJudul(savedJudul)

    const savedVis = localStorage.getItem('visibility_temp')
    if (savedVis) setVisibility(savedVis)

    const savedKat = localStorage.getItem('kategori_temp')
    if (savedKat) setKategori(savedKat)
  }, [])

  useEffect(() => {
    localStorage.setItem('judul_temp', judul)
  }, [judul])

  useEffect(() => {
    localStorage.setItem('visibility_temp', visibility)
  }, [visibility])

  useEffect(() => {
    localStorage.setItem('kategori_temp', kategori)
  }, [kategori])

  const handleSelesai = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      const userId = localStorage.getItem('userId') || '2'
      formData.append('userId', userId)
      formData.append('judul', judul || 'Karya Tanpa Judul')
      
      let visValue = 'publik'
      if (visibility === 'Banjar Saja') visValue = 'banjar'
      if (visibility === 'Hanya Saya') visValue = 'privat'
      formData.append('visibilitas', visValue)
      formData.append('kategori', kategori)

      const stepsArray = langkah.map((l) => ({
        teks: l.deskripsi || "" 
      }))
      formData.append('steps', JSON.stringify(stepsArray))

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

      const token = localStorage.getItem('token')

      const res = await fetch('https://oti-internship-kel4.vercel.app/api/karya/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (res.ok) {
        localStorage.removeItem('langkah_temp')
        localStorage.removeItem('judul_temp')
        localStorage.removeItem('visibility_temp')
        localStorage.removeItem('kategori_temp')
        
        router.push('/beranda')
      } else {
        const errText = await res.text()
        console.error('Gagal upload. Status:', res.status, 'Response:', errText)
        alert(`Gagal mengunggah karya. Status: ${res.status}`)
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

        <div>
          <h1 className="text-2xl font-bold text-[#C04000]">Upload Karya Baru</h1>
          <p className="text-sm text-gray-600 mt-1">Bagikan proses atau hasil karya anda hari ini.</p>
        </div>

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

        <button
          onClick={() => router.push('/unggah/tambah-langkah')}
          className="w-full border-2 border-[#C04000] text-black rounded-full py-3 flex items-center justify-center gap-2 text-sm"
        >
          Tambahkan Langkah-langkah
          <Image src="/plus.webp" alt="plus" width={20} height={20} />
        </button>

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

        <button
          onClick={handleSelesai}
          disabled={isLoading}
          className={`w-full text-white font-bold py-4 rounded-full ${isLoading ? 'bg-gray-400' : 'bg-[#C04000]'}`}
        >
          {isLoading ? 'Mengunggah...' : 'Selesai & Unggah'}
        </button>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#C04000] flex justify-around items-center py-3">
        <Link href="/beranda" className="flex flex-col items-center gap-1">
          <Image src="/home.webp" alt="home" width={24} height={24} />
          <p className="text-white text-[10px]">Beranda</p>
        </Link>
        <Link href="/unggah" className="flex flex-col items-center gap-1">
          <Image src="/upload.webp" alt="unggah" width={24} height={24} />
          <p className="text-white text-[10px]">Unggah</p>
        </Link>
        <button
          onClick={() => setShowTutorial(true)}
          className="flex flex-col items-center gap-1"
        >
          <Image src="/tutorial.webp" alt="tutorial" width={24} height={24} />
          <p className="text-white text-[10px]">Tutorial</p>
        </button>
        <Link href="/profil" className="flex flex-col items-center gap-1">
          <Image src="/profile.webp" alt="profil" width={24} height={24} />
          <p className="text-white text-[10px]">Profil Saya</p>
        </Link>
      </div>

      {showTutorial && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center px-8"
          style={{ backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setShowTutorial(false)}
        >
          <div
            className="w-full bg-white rounded-3xl px-5 py-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#C04000] rounded-2xl px-4 py-3 flex items-center gap-3">
              <Image src="/tutorial.webp" alt="tutorial" width={24} height={24} />
              <p className="text-white font-bold text-base">Cara Menggunakan</p>
            </div>

            {stepsData.map((l, i) => (
              <div key={i} className="rounded-2xl px-4 py-4 flex items-start gap-4 border border-[#C04000]/30">
                <div className="w-10 h-10 bg-[#C04000] rounded-full flex items-center justify-center shrink-0">
                  <Image src={l.icon} alt={l.judul} width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{l.judul}</p>
                  <p className="text-xs text-gray-500 mt-1">{l.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowTutorial(false)}
              className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2"
            >
              Saya Mengerti
              <Image src="/arrow-right.webp" alt="arrow" width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
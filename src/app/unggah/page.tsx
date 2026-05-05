'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const visibilitas = ['Semua Orang (Publik)', 'Hanya Saya']
const kategoriList = ['Anyaman', 'Kayu', 'Perak', 'Tenun']

export default function Unggah() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [foto, setFoto] = useState<string | null>(null)
  const [cerita, setCerita] = useState('')
  const [visibility, setVisibility] = useState('Semua Orang (Publik)')
  const [kategori, setKategori] = useState('Anyaman')
  const [langkah, setLangkah] = useState<any[]>([])

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFoto(url)
    }
  }

  const handleSelesai = () => {
    const saved = localStorage.getItem('produk')
    const existing = saved ? JSON.parse(saved) : []
    const baru = {
      id: Date.now(),
      kategori: kategori.toUpperCase(),
      nama: cerita.slice(0, 30) || 'Karya Baru',
      oleh: 'Saya',
      banjar: 'Nama Banjar #1',
      img: foto || '/placeholder.webp',
      langkah,
      whatsapp: '',
    }
    localStorage.setItem('produk', JSON.stringify([...existing, baru]))
    router.push('/beranda')
  }

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pt-16 pb-24 px-5 gap-5"}>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#C04000]">Upload Karya Baru</h1>
          <p className="text-sm text-gray-600 mt-1">Bagikan proses atau hasil karya anda hari ini.</p>
        </div>

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
              <p className="text-sm text-gray-500">Ganti Foto Karya</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />

        <div>
          <p className="text-sm font-bold mb-2 text-black">Ceritakan tentang karya ini</p>
          <div className="flex items-end gap-2 bg-white rounded-2xl px-4 py-3 relative">
            <Image src="/pencil.webp" alt="pencil" width={20} height={20} className="mb-1 shrink-0" />
            <textarea
              placeholder="Ketik atau tekan tombol mic untuk bicara"
              className="bg-transparent text-sm outline-none w-full text-black resize-none h-16 pr-10 "
              value={cerita}
              onChange={(e) => setCerita(e.target.value)}
            />
            <button className="absolute right-3 bottom-3 shrink-0">
              <Image src="/mic.webp" alt="mic" width={32} height={32} />
            </button>
          </div>
        </div>

        {langkah.length > 0 && (
          <div className="flex flex-col gap-2">
            {langkah.map((l, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
                {l.img && (
                  <Image src={l.img} alt="langkah" width={50} height={50} className="rounded-xl object-cover w-14 h-14" />
                )}
                <p className="text-sm text-gray-700 flex-1 line-clamp-3 ">{l.deskripsi}</p>
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
              {visibilitas.map((v) => (
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
          className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full"
        >
          Selesai & Unggah
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
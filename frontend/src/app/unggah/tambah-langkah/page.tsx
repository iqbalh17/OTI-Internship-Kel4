'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function TambahLangkah() {
  const router = useRouter()
  const [langkah, setLangkah] = useState([{ img: null as string | null, deskripsi: '' }])

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const updated = [...langkah]
      updated[i].img = url
      setLangkah(updated)
    }
  }

  const handleDeskripsi = (val: string, i: number) => {
    const updated = [...langkah]
    updated[i].deskripsi = val
    setLangkah(updated)
  }

  const handleTambah = () => {
    setLangkah([...langkah, { img: null, deskripsi: '' }])
  }

  const handleSelesai = () => {
    localStorage.setItem('langkah_temp', JSON.stringify(langkah))
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pt-5 pb-24 px-5 gap-5"}>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-[#C04000] text-white px-5 py-2 rounded-full font-medium text-sm w-fit"
        >
          ← Kembali
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#C04000]">Menambahkan Langkah-langkah</h1>
          <p className="text-sm text-gray-600 mt-1">Bagikan proses karya anda hari ini.</p>
        </div>

        {langkah.map((l, i) => (
          <div key={i} className="flex flex-col gap-3">

            <label className="w-full h-44 bg-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-[#C04000]">
              {l.img ? (
                <Image src={l.img} alt="langkah" width={320} height={176} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Image src="/camera.webp" alt="camera" width={40} height={40} />
                  <p className="text-sm text-gray-500 mt-2">Ganti Foto Karya</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFoto(e, i)} />
            </label>

            <div>
              <p className="text-sm font-bold mb-2">Langkah {i + 1}</p>
              <div className="flex items-start gap-2 bg-white rounded-2xl px-4 py-3">
                <Image src="/pencil.webp" alt="pencil" width={20} height={20} className="mt-1 shrink-0" />
                <textarea
                  placeholder="Ketik atau tekan tombol mic untuk bicara"
                  className="bg-transparent text-sm outline-none w-full text-gray-400 resize-none h-16"
                  value={l.deskripsi}
                  onChange={(e) => handleDeskripsi(e.target.value, i)}
                />
                <button className="shrink-0">
                  <Image src="/mic.webp" alt="mic" width={32} height={32} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSelesai}
          className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full"
        >
          Selesai
        </button>

        <button
          onClick={handleTambah}
          className="w-full border-2 border-[#C04000] text-black rounded-full py-3 flex items-center justify-center gap-2 text-sm"
        >
          Tambahkan Langkah Selanjutnya
          <Image src="/plus.webp" alt="plus" width={20} height={20} />
        </button>

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
    </div>
  )
}
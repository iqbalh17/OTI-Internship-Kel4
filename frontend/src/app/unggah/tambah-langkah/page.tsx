'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function TambahLangkah() {
  const router = useRouter()
  // State langkah dengan img, deskripsi, dan audioUrl
  const [langkah, setLangkah] = useState([{ img: null as string | null, deskripsi: '', audioUrl: null as string | null }])

  // Muat state yang tersimpan jika user sebelumnya keluar masuk halaman ini
  useEffect(() => {
    const saved = localStorage.getItem('langkah_temp')
    if (saved) {
      setLangkah(JSON.parse(saved))
    }
  }, [])

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

  // Handler untuk Audio Voice Note per langkah
  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const updated = [...langkah]
      updated[i].audioUrl = url
      setLangkah(updated)
    }
  }

  // Handler untuk menghapus Audio
  const handleHapusAudio = (i: number) => {
    const updated = [...langkah]
    updated[i].audioUrl = null
    setLangkah(updated)
  }

  // Handler untuk menambah langkah baru
  const handleTambah = () => {
    setLangkah([...langkah, { img: null, deskripsi: '', audioUrl: null }])
  }

  // Handler untuk menghapus satu blok langkah
  const handleHapusLangkah = (indexToRemove: number) => {
    const updated = langkah.filter((_, index) => index !== indexToRemove)
    setLangkah(updated)
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

            {/* Input Foto */}
            <label className="w-full h-44 bg-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-[#C04000] relative">
              {l.img ? (
                <Image src={l.img} alt={`langkah ${i}`} fill className="object-cover" />
              ) : (
                <>
                  <Image src="/camera.webp" alt="camera" width={40} height={40} />
                  <p className="text-sm text-gray-500 mt-2">Ganti Foto Karya</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFoto(e, i)} />
            </label>

            {/* Kolom Deskripsi dan Voice Note */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-black">Langkah {i + 1}</p>
                
                {/* Tombol Hapus Langkah */}
                <button
                  onClick={() => handleHapusLangkah(i)}
                  className="text-xs font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full hover:bg-red-200"
                >
                  Hapus Langkah
                </button>
              </div>

              <div className="flex flex-col bg-white rounded-2xl px-4 py-3">
                <div className="flex items-start gap-2">
                  <Image src="/pencil.webp" alt="pencil" width={20} height={20} className="mt-1 shrink-0" />
                  <textarea
                    placeholder="Ketik atau tekan tombol mic untuk bicara"
                    className="bg-transparent text-sm outline-none w-full text-black resize-none h-16"
                    value={l.deskripsi}
                    onChange={(e) => handleDeskripsi(e.target.value, i)}
                  />
                  
                  {/* Tombol Mic dibungkus label agar memicu input file di bawahnya */}
                  <label 
                    htmlFor={`audio-step-${i}`} 
                    className={`shrink-0 cursor-pointer p-1 ${l.audioUrl ? 'bg-green-100 rounded-full' : ''}`}
                  >
                    <Image src="/mic.webp" alt="mic" width={32} height={32} />
                  </label>
                  
                  <input 
                    id={`audio-step-${i}`}
                    type="file" 
                    accept="audio/*" 
                    capture="user" // Memicu perekam suara HP
                    className="hidden" 
                    onChange={(e) => handleAudio(e, i)}
                  />
                </div>

                {/* Preview Voice Note */}
                {l.audioUrl && (
                  <div className="mt-3 w-full border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Voice Note terlampir:</p>
                    <audio controls src={l.audioUrl} className="w-full h-8 outline-none" />
                    <button 
                      type="button" 
                      onClick={() => handleHapusAudio(i)} 
                      className="text-xs text-red-500 mt-2 font-medium"
                    >
                      Hapus Voice Note
                    </button>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        ))}

        <button
          onClick={handleSelesai}
          className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full mt-2"
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

      </div>
    </div>
  )
}
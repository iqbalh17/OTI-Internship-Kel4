'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { fetchApi } from '../../../utils/api'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function DetailKarya() {
  const { karya } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId'))

    const getDetailKarya = async () => {
      try {
        const response = await fetchApi(`/karya/detail/${karya}`, 'GET')
        
        const detail = response.detail
        const steps = response.steps || []

        if (!detail) return

        const formattedData = {
          id: detail.id,
          userId: String(detail.user_id),
          nama: detail.judul,
          oleh: detail.seniman,
          banjar: detail.asal_banjar,
          whatsapp: detail.no_wa_whatsapp || detail.no_wa,
          langkah: steps.map((s: any) => ({
            img: s.foto_url,
            deskripsi: s.keterangan_teks,
            step_number: s.step_number,
            audio: s.audio_url
          }))
        }

        setData(formattedData)
        console.log("ID Login di HP:", localStorage.getItem('userId'));
        console.log("ID Pemilik Karya:", detail.user_id);
      } catch (error) {
        console.error(error)
      }
    }

    if (karya) {
      getDetailKarya()
    }
  }, [karya])

  const handleDelete = async () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus karya ini?")
    if (!isConfirm) return

    try {
      await fetchApi(`/karya/${data.id}`, 'DELETE')
      router.push('/beranda')
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus karya")
    }
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pb-24"}>

        <div className="px-5 pt-8 pb-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-[#C04000] text-white px-5 py-2 rounded-full font-medium text-sm"
          >
            ← Kembali
          </button>

          {currentUserId === data.userId && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full font-medium text-sm"
            >
              Hapus
            </button>
          )}
        </div>

        <div className="px-5 mb-3">
          <h1 className="text-2xl font-bold text-[#C04000]">{data.nama}</h1>
          <p className="text-sm text-gray-500 mt-1">Karya Oleh</p>
        </div>  

        <div className="mx-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
          <div className="rounded-full bg-gray-200 overflow-hidden shrink-0">
            <Image src="/profile.webp" alt="profil" width={32} height={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-black">{data.oleh}</p>
            <div className="flex items-center gap-1">
              <Image src="/red-map.webp" alt="map" width={12} height={12} />
              <p className="text-xs text-gray-500">{data.banjar}</p>
            </div>
          </div>
        </div>

        {data.langkah && data.langkah.length > 0 && (
          <div className="px-5 flex flex-col gap-4 mb-4">
            {data.langkah.map((l: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {l.img && (
                  <Image
                    src={l.img}
                    alt={`langkah ${i + 1}`}
                    width={320}
                    height={180}
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-3">
                  <span className="text-xs border border-[#C04000] text-[#C04000] rounded-full px-3 py-1">
                    Langkah {l.step_number || i + 1}
                  </span>
                  
                  {l.deskripsi ? (
                    <p className="text-sm text-gray-700 mt-2">{l.deskripsi}</p>
                  ) : l.audio ? (
                    <div className="mt-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <audio controls className="w-full h-8">
                        <source src={l.audio} type="audio/mpeg" />
                      </audio>
                      <p className="text-[10px] text-gray-400 mt-1 text-center">Putar Voice Note</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 italic">Tidak ada keterangan.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.whatsapp && (
          <div className="px-5 mb-4">
            <Link
              href={`https://wa.me/${data.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2"
            >
              <Image src="/phone.webp" alt="wa" width={20} height={20} />
              Lanjutkan Diskusi Lewat WhatsApp
            </Link>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-[#C04000] flex justify-around items-center py-3 z-50">
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
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function DetailKarya() {
  const { karya } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('produk')
    if (saved) {
      const list = JSON.parse(saved)
      const found = list.find((p: any) => p.id === Number(karya))
      setData(found)
    }
  }, [karya])

  if (!data) return null

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pb-24"}>

        {/* Tombol Kembali */}
        <div className="px-5 pt-8 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-[#C04000] text-white px-5 py-2 rounded-full font-medium text-sm"
          >
            ← Kembali
          </button>
        </div>

        {/* Judul */}
        <div className="px-5 mb-3">
          <h1 className="text-2xl font-bold text-[#C04000]">{data.nama}</h1>
          <p className="text-sm text-gray-500 mt-1">Karya Oleh</p>
        </div>

        {/* Info Pembuat */}
        <div className="mx-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <Image src="/placeholder.webp" alt="avatar" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold">{data.oleh}</p>
            <div className="flex items-center gap-1">
              <Image src="/red-map.webp" alt="map" width={12} height={12} />
              <p className="text-xs text-gray-500">{data.banjar}</p>
            </div>
          </div>
        </div>

        {/* Langkah-langkah */}
        {data.langkah && data.langkah.length > 0 && (
          <div className="px-5 flex flex-col gap-4 mb-4">
            {data.langkah.map((l: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
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
                    Langkah {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 mt-2">{l.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol WhatsApp */}
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

        {/* Bottom Navbar */}
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
'use client'

import { useState, useEffect } from 'react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const kategori = ['Semua', 'Kayu', 'Perak', 'Tenun', 'Anyaman']

const defaultProduk = [
  { id: 1, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/barong.webp' },
  { id: 2, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/barong.webp' },
  { id: 3, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/barong.webp' },
  { id: 4, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/barong.webp' },
]

export default function Beranda() {
  const [aktif, setAktif] = useState('Semua')
  const [produk, setProduk] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('produk')
    if (saved) {
      setProduk(JSON.parse(saved))
    } else {
      setProduk(defaultProduk)
    }
  }, [])

  const produkFiltered = aktif === 'Semua'
    ? produk
    : produk.filter((p) => p.kategori.toLowerCase() === aktif.toLowerCase())

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pb-24"}>

        {/* Header */}
        <div className="px-5 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-[#C04000]">Beranda</h1>
        </div>

        {/* Filter Kategori */}
        <div className="px-5 mb-4">
          <p className="text-sm mb-2">Pilih Kategori</p>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button className="shrink-0">
              <Image src="/menu.webp" alt="menu" width={24} height={24} />
            </button>
            {kategori.map((k) => (
              <button
                key={k}
                onClick={() => setAktif(k)}
                className={
                  "shrink-0 px-4 py-1.5 rounded-full border text-sm " +
                  (aktif === k
                    ? "bg-[#C04000] text-white border-[#C04000]"
                    : "bg-transparent text-[#C04000] border-[#C04000]")
                }
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Produk */}
        {produkFiltered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Belum ada karya di kategori ini.</p>
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3">
            {produkFiltered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer active:scale-95 transition-transform"
              >
                <Image
                  src={item.img}
                  alt={item.nama}
                  width={180}
                  height={160}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-[#C04000]">{item.kategori}</p>
                  <p className="text-sm font-bold">{item.nama}</p>
                  <p className="text-xs text-[#C04000]">oleh {item.oleh}</p>
                  <div className="flex items-center gap-1 mt-1 bg-[#FFF0E8] rounded-full px-2 py-1 w-fit border border-[#C04000CC]">
                    <Image src="/red-map.webp" alt="map" width={12} height={12} />
                    <p className="text-[10px] text-[#C04000]">{item.banjar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
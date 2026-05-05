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

const stepsData = [
  { icon: '/camera.webp', judul: '1. Foto Karya Anda', desc: 'Ambil foto karya terbaik Anda untuk ditampilkan.' },
  { icon: '/pencil.webp', judul: '2. Tulis Keterangan', desc: 'Ceritakan proses dan detail karya Anda.' },
  { icon: '/upload.webp', judul: '3. Unggah Karya Anda', desc: 'Bagikan karya Anda ke seluruh komunitas.' },
]

export default function Beranda() {
  const [aktif, setAktif] = useState('Semua')
  const [produk, setProduk] = useState<any[]>([])
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('produk')
    if (saved) {
      setProduk(JSON.parse(saved))
    } else {
      const defaultData = [
        { id: 1, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/placeholder.webp', langkah: [], whatsapp: '' },
        { id: 2, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/placeholder.webp', langkah: [], whatsapp: '' },
        { id: 3, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/placeholder.webp', langkah: [], whatsapp: '' },
        { id: 4, kategori: 'KAYU', nama: 'Topeng Barong', oleh: 'I Made Widiarta', banjar: 'Nama Banjar #1', img: '/placeholder.webp', langkah: [], whatsapp: '' },
      ]
      localStorage.setItem('produk', JSON.stringify(defaultData))
      setProduk(defaultData)
    }
  }, [])

  const produkFiltered = aktif === 'Semua'
    ? produk
    : produk.filter(p => p.kategori.toLowerCase() === aktif.toLowerCase())

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pb-24"}>

        <div className="px-5 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-[#C04000]">Beranda</h1>
        </div>

        <div className="px-5 mb-4">
          <p className="text-sm mb-2 text-black">Pilih Kategori</p>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button className="shrink-0">
              <Image src="/menu.webp" alt="menu" width={24} height={24} />
            </button>
            {kategori.map(k => (
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

        {produkFiltered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Belum ada karya di kategori ini.</p>
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3">
            {produkFiltered.map(item => (
              <Link href={"/beranda/" + item.id} key={item.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer active:scale-95 transition-transform">
                  <Image
                    src={item.img}
                    alt={item.nama}
                    width={180}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#C04000]">{item.kategori}</p>
                    <p className="text-sm font-bold text-black">{item.nama}</p>
                    <p className="text-xs text-[#C04000]">oleh {item.oleh}</p>
                    <div className="flex items-center gap-1 mt-1 bg-[#FFF0E8] rounded-full px-2 py-1 w-fit border border-[#C04000CC]">
                      <Image src="/red-map.webp" alt="map" width={12} height={12} />
                      <p className="text-[10px] text-[#C04000]">{item.banjar}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

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

      {/* Modal Tutorial */}
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
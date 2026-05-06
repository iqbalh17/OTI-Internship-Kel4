'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { fetchApi } from '../../utils/api'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function Profil() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  
  const [myId, setMyId] = useState<string>('')
  const [fotoProfil, setFotoProfil] = useState<string | null>(null)
  const [nama, setNama] = useState('Memuat...')
  const [banjar, setBanjar] = useState('-')
  const [noHp, setNoHp] = useState('-')
  
  const [editMode, setEditMode] = useState(false)
  const [karyaSaya, setKaryaSaya] = useState<any[]>([])

  useEffect(() => {
    const getProfilData = async () => {
      let currentUserId = localStorage.getItem('userId')
      
      if (!currentUserId) {
        currentUserId = '2'
      }
      
      setMyId(currentUserId)

      try {
        const response = await fetchApi(`/karya/profile/${currentUserId}`, 'GET')
        
        if (response && response.profil) {
          const p = response.profil
          setNama(p.nama || 'Tanpa Nama')
          setBanjar(p.asal_banjar || 'Banjar -')
          setNoHp(p.no_wa || '-')
          setFotoProfil(p.foto_url || null)

          if (response.koleksi_karya) {
            const formattedKarya = response.koleksi_karya.map((item: any) => ({
              id: item.karya_id,
              kategori: "Karya",
              nama: item.judul,
              oleh: p.nama,
              banjar: p.asal_banjar,
              img: item.thumbnail_url || '/placeholder.webp',
            }))
            setKaryaSaya(formattedKarya)
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error)
        setNama('Gagal memuat data')
      }
    }

    getProfilData()
  }, [])

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFotoProfil(url)
    }
  }

  const handleSimpan = async () => {
    setEditMode(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    router.push('/masuk')
  }

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col pt-8 pb-24 px-5 gap-5"}>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#C04000]">Profil Saya</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white text-xs px-4 py-1.5 rounded-full font-medium active:scale-95 transition-transform"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 relative shadow-sm">
          <div
            className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shrink-0 cursor-pointer relative"
            onClick={() => editMode && fileRef.current?.click()}
          >
            {fotoProfil ? (
              <Image src={fotoProfil} alt="profil" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image src="/profile.webp" alt="profil" width={32} height={32} />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />

          <div className="flex flex-col gap-1 flex-1">
            {editMode ? (
              <>
                <input
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="text-sm font-bold text-black outline-none border-b border-gray-300 w-full"
                />
                <input
                  value={banjar}
                  onChange={e => setBanjar(e.target.value)}
                  className="text-xs outline-none border-b border-gray-300 w-full text-gray-500"
                />
                <input
                  value={noHp}
                  onChange={e => setNoHp(e.target.value)}
                  className="text-xs outline-none border-b border-gray-300 w-full text-gray-500"
                />
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-black">{nama}</p>
                <div className="flex items-center gap-1">
                  <Image src="/red-map.webp" alt="map" width={12} height={12} />
                  <p className="text-xs text-gray-500">{banjar}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/phone.webp" alt="phone" width={12} height={12} />
                  <p className="text-xs text-gray-500">{noHp}</p>
                </div>
              </>
            )}
          </div>

          {editMode ? (
            <button
              onClick={handleSimpan}
              className="absolute top-3 right-3 bg-[#C04000] text-white text-xs px-3 py-1 rounded-full"
            >
              Simpan
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#C04000] rounded-full flex items-center justify-center"
            >
              <Image src="/pencil.webp" alt="edit" width={16} height={16} className="brightness-0 invert" />
            </button>
          )}
        </div>

        <div>
          <h2 className="text-base font-bold text-[#C04000] mb-3">Karya Saya</h2>
          {karyaSaya.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada karya yang diunggah.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {karyaSaya.map((item, index) => (
                <Link href={"/beranda/" + item.id} key={item.id || index}>
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
      </div>

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
  )
}
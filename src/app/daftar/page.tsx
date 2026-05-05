'use client'

import { useState } from 'react'
import DropdownBanjar from './DropdownBanjar' 
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function DaftarAkun() {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedBanjar, setSelectedBanjar] = useState('')

  return (
    <div className="relative min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col justify-end px-9 pb-[146px]"}>

        <h1 className="text-3xl font-bold text-[#C04000] mb-5">Daftar Akun</h1>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">No. HP</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/phone.webp" alt="phone" width={24} height={24} />
              <input
                type="tel"
                placeholder="Masukkan no. HP... (cth. 081314442555)"
                className="bg-transparent text-sm outline-none w-full text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">Nama Lengkap</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/icon.webp" alt="person" width={24} height={24} />
              <input
                type="text"
                placeholder="Masukkan nama lengkap..."
                className="bg-transparent text-sm outline-none w-full text-gray-400"
              />
            </div>
          </div>

          <div onClick={() => setShowDropdown(true)} className="flex flex-col gap-1">
            <label className="text-sm text-black">Asal Banjar</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/map.webp" alt="location" width={24} height={24} />
              <input
                type="text"
                placeholder="Pilih Asal Banjar..."
                className="bg-transparent text-sm outline-none w-full text-gray-400"
              />
              <Image src="/down.webp" alt="dropdown" width={24} height={24} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">Buat Password</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/lock.webp" alt="lock" width={24} height={24} />
              <input
                type="password"
                placeholder="Masukkan password..."
                className="bg-transparent text-sm outline-none w-full text-gray-400"
              />
              <Image src="/eye.webp" alt="eye" width={24} height={24} className="cursor-pointer" />
            </div>
          </div>

        </div>

        <button onClick={() => router.push('/beranda')} className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full mt-8">
          Daftar Akun
        </button>

        <p className="text-sm text-center mt-3 text-black">
          Sudah memiliki Akun?{' '}
          <Link href="/masuk" className="font-bold underline">
            Masuk
          </Link>
        </p>

      </div>
      {showDropdown && (
      <DropdownBanjar
        selected={selectedBanjar}
        onSelect={setSelectedBanjar}
        onConfirm={() => setShowDropdown(false)}
      />
    )}
    </div>
  )
}
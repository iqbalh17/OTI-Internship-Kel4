'use client'

import { useState } from 'react'
import DropdownBanjar from './DropdownBanjar' 
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { fetchApi } from '../../utils/api' // Sesuaikan path jika posisinya berbeda

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function DaftarAkun() {
  const router = useRouter()
  
  const [noWa, setNoWa] = useState('')
  const [nama, setNama] = useState('')
  const [password, setPassword] = useState('')
  const [selectedBanjar, setSelectedBanjar] = useState('')
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!noWa || !nama || !selectedBanjar || !password) {
      alert('Mohon isi semua data terlebih dahulu!')
      return
    }

    setIsLoading(true)

    try {
      await fetchApi('/auth/register', 'POST', {
        noWa: noWa,
        nama: nama,
        asalBanjar: selectedBanjar,
        password: password
      })
 
      router.push('/masuk')

    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat mendaftar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col justify-end px-9 pb-[146px]"}>

        <h1 className="text-3xl font-bold text-[#C04000] mb-5">Daftar Akun</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">No. HP</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/phone.webp" alt="phone" width={24} height={24} />
              <input
                type="tel"
                value={noWa}
                onChange={(e) => setNoWa(e.target.value)}
                placeholder="Masukkan no. HP... (cth. 081314442555)"
                className="bg-transparent text-sm outline-none w-full text-black"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">Nama Lengkap</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/icon.webp" alt="person" width={24} height={24} />
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap..."
                className="bg-transparent text-sm outline-none w-full text-black"
              />
            </div>
          </div>

          <div onClick={() => setShowDropdown(true)} className="flex flex-col gap-1 cursor-pointer">
            <label className="text-sm text-black cursor-pointer">Asal Banjar</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/map.webp" alt="location" width={24} height={24} />
              <input
                type="text"
                value={selectedBanjar}
                readOnly 
                placeholder="Pilih Asal Banjar..."
                className="bg-transparent text-sm outline-none w-full text-black cursor-pointer"
              />
              <Image src="/down.webp" alt="dropdown" width={24} height={24} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">Buat Password</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Image src="/lock.webp" alt="lock" width={24} height={24} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="bg-transparent text-sm outline-none w-full text-black"
              />
              <Image 
                src="/eye.webp" 
                alt="eye" 
                width={24} 
                height={24} 
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-4 rounded-full mt-8 ${isLoading ? 'bg-gray-400' : 'bg-[#C04000]'}`}
          >
            {isLoading ? 'Mendaftar...' : 'Daftar Akun'}
          </button>
        </form>

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

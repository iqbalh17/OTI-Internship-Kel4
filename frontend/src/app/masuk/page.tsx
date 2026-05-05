'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { fetchApi } from '../../utils/api'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function Masuk() {
  const router = useRouter()

  const [noWa, setNoWa] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!noWa || !password) {
      alert('Mohon isi nomor HP dan password!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchApi('/auth/login', 'POST', {
        noWa: noWa,
        password: password
      })

      localStorage.setItem('token', response.token)

      alert('Berhasil masuk!')
      router.push('/beranda')

    } catch (error: any) {
      alert(error.message || 'Gagal login, periksa kembali nomor WA dan password Anda.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col justify-center px-9"}>

        <h1 className="text-3xl font-bold text-[#C04000] mb-5">Masuk</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-black">No. HP</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
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
            <label className="text-sm text-black">Password</label>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
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
            className={`w-full text-white font-bold py-4 rounded-full mt-[92px] shadow-lg ${isLoading ? 'bg-gray-400' : 'bg-[#C04000]'}`}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-sm text-center text-black mt-5">
          Belum memiliki Akun?{' '}
          <Link href="/daftar" className="font-bold underline">
            Daftar Akun
          </Link>
        </p>

      </div>
    </div>
  )
}
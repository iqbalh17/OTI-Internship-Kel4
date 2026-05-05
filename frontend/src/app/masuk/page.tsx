'use client'

import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function Masuk() {
    const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className={poppins.className + " w-[360px] min-h-screen flex flex-col justify-center px-9 gap-5"}>

        <h1 className="text-3xl font-bold text-[#C04000]">Masuk</h1>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-black">No. HP</label>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
            <Image src="/phone.webp" alt="phone" width={24} height={24} />
            <input
              type="tel"
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
              type="password"
              placeholder="Masukkan password..."
              className="bg-transparent text-sm outline-none w-full text-black"
            />
            <Image src="/eye.webp" alt="eye" width={24} height={24} className="cursor-pointer" />
          </div>
        </div>

        <button onClick={() => router.push('/beranda')} className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full mt-[92px] shadow-lg">
          Masuk
        </button>

        <p className="text-sm text-center text-black">
          Belum memiliki Akun?{' '}
          <Link href="/daftar" className="font-bold underline">
            Daftar Akun
          </Link>
        </p>

      </div>
    </div>
  )
}
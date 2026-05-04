import { Poppins, Playfair_Display } from 'next/font/google'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic'],
})

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF7E4] flex justify-center">
      <div className="w-[360px] min-h-screen flex flex-col justify-center items-center px-8 gap-6">

        <div className="text-center">
          <h1 className={`${poppins.className} text-3xl font-normal text-shadow-lg text-[#000000] `}>
            Selamat Datang di
          </h1>
          <h2 className={`${playfair.className} text-4xl font-black italic text-[#C04000] text-shadow-lg mt-2`}>
            Kicau Mania
          </h2>
          <p className={`${poppins.className} text-sm mt-2 text-neutral-900`}>
            Ruang berbagi karya dan ilmu bagi para pengrajin Bali.
          </p>
        </div>

        <div className="flex gap-3 mt-[160px]">
          <Link href="/masuk">
            <button className="px-5 py-2 rounded-full border-2 border-[#C04000] text-[#C04000] text-sm shadow-lg">
              Masuk
            </button>
          </Link>
          <Link href="/daftar">
            <button className="px-5 py-2 rounded-full bg-[#C04000] text-white text-sm shadow-lg">
              Daftar Akun
            </button>
          </Link>
        </div>

        <p className={`${poppins.className}  italic text-xs text-center text-neutral-900 `}>
          "Melestarikan Warisan, Menginspirasi Masa Depan."
        </p>

      </div>
    </div>
  )
}
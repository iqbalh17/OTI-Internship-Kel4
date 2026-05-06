'use client'

import Image from 'next/image'

const listBanjar = [
  'Banjar Tainsiat','Banjar Gerenceng','Banjar Pekambingan','Banjar Celagigendong','Banjar Umasari', 'Banjar Tegaltamu','Banjar Pagutan','Banjar Sasih','Banjar Tubuh','Banjar Telabah'
]

type Props = {
  selected: string
  onSelect: (val: string) => void
  onConfirm: () => void
}

export default function DropdownBanjar({ selected, onSelect, onConfirm }: Props) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-10">
      <div className="w-[360px] bg-white rounded-t-3xl px-6 py-5 flex flex-col gap-3 cursor-pointer border-2 border-[#C04000CC]">

        <div className="mb-1">
          <p className="font-bold text-base text-black">Pilih Asal Banjar</p>
          <p className="text-sm text-gray-500">Silahkan pilih lokasi banjar tempat tinggal atau workshop Anda.</p>
        </div>

        <div className="flex flex-col gap-2">
          {listBanjar.map((banjar) => (
            <button
              key={banjar}
              onClick={() => onSelect(banjar)}
              className={
                "flex items-center justify-between px-4 py-3 rounded-full border text-sm " +
                (selected === banjar
                  ? "border-[#C04000] bg-[#FFF0E8] text-[#C04000] font-medium"
                  : "border-gray-300 text-black")
              }
            >
              <div className="flex items-center gap-2">
                <Image src="/map.webp" alt="map" width={20} height={20} />
                {banjar}
              </div>
              {selected === banjar && (
                <span className="text-[#C04000]">✓</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onConfirm}
          className="w-full bg-[#C04000] text-white font-bold py-4 rounded-full mt-2 shadow-xl"
        >
          Konfirmasi Pilihan
        </button>

      </div>
    </div>
  )
}
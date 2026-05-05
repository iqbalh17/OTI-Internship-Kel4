import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic'],
})

export const metadata: Metadata = {
  title: 'Kicau Mania',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body style={{fontFamily: poppins.style.fontFamily}}>
        {children}
      </body>
    </html>
  )
}
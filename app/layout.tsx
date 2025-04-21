import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HomeAway',
  description: 'Feel at home, away from home.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <Navbar />
        <main className='container py-10'>{children}</main>
      </body>
    </html>
  )
}

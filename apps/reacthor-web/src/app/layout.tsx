import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import reacthorLogo from '../../public/weev-logo.svg'

const inter = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reacthor AI',
  description: ''
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

      <div key="1" className="bg-black text-white">
        <nav className="flex justify-between items-center">
          <div className={'flex items-center'}>
            <Image
              src={reacthorLogo}
              alt={'reacthor-logo'}
              width={80}
              height={80}
            />
            <h1 className="text-xl font-bold">Reacthor AI.</h1>
          </div>
        </nav>
        {children}
      </div>
      </body>
    </html>
  )
}

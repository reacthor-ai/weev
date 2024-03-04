import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProviderInitializer } from '@/provider/ProviderInitilizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeeevAI'
}

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProviderInitializer>
      <ClerkProvider>
        <html lang='en'>
        <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
    </ProviderInitializer>
  )
}

import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ProviderInitializer } from '@/provider/ProviderInitilizer'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  title: 'WeeevAI'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProviderInitializer>
      <ClerkProvider>
        <html lang='en'>
        <body>
        <NextTopLoader
          color='#2299DD'
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={true}
          easing='ease'
        />
        {children}
        </body>
        </html>
      </ClerkProvider>
    </ProviderInitializer>
  )
}

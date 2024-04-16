import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import { ProviderInitializer } from '@/provider/ProviderInitializer'

export const metadata: Metadata = {
  title: 'Reacthor AI'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProviderInitializer>
      <ClerkProvider>
        <html lang="en">
          <body>
            <NextTopLoader
              color="#f56565"
              initialPosition={0.08}
              crawlSpeed={200}
              height={5}
              crawl={true}
              showSpinner={true}
              easing="ease"
            />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </ProviderInitializer>
  )
}

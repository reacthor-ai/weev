import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div key="1" className="bg-black text-white">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  )
}

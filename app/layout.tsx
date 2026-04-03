import React from 'react'
import Navbar from './components/Navbar'
import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'ProjectReady4U',
  description: 'Browse and request student projects'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="dark:bg-slate-950 bg-white">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

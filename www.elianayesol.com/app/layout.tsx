import type { Metadata } from 'next'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import './styles/index.css'

export const metadata: Metadata = {
  title: 'www.elianayesol.com',
  description: 'Building ESG + AI Products for a Better Future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}


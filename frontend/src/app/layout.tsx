import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { QueryProvider } from '@/providers/QueryProvider'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: 'QCM Platform — Évaluations intelligentes par IA',
  description: 'Créez des QCM en quelques secondes grâce à l\'IA, faites passer des tests à vos étudiants et analysez automatiquement leurs résultats.',
  openGraph: {
    title: 'QCM Platform — Évaluations intelligentes par IA',
    description: 'Créez des QCM en quelques secondes grâce à l\'IA, faites passer des tests à vos étudiants et analysez automatiquement leurs résultats.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'QCM Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QCM Platform — Évaluations intelligentes par IA',
    description: 'Créez des QCM en quelques secondes grâce à l\'IA, faites passer des tests à vos étudiants et analysez automatiquement leurs résultats.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'
import LandingPage from '@/components/landing/LandingPage'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'ENSEIGNANT' ? '/enseignant' : '/etudiant')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040b18]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user) return null

  return <LandingPage />
}

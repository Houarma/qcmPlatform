'use client'

import { useAuth } from '@/context/AuthContext'

export function DashboardGreeting({ subtitle }: { subtitle: string }) {
  const { user } = useAuth()
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        Bonjour, {user?.prenom ?? '…'} 👋
      </h1>
      <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>
    </div>
  )
}

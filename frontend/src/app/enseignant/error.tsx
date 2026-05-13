'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function EnseignantError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error('[enseignant]', error) }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full py-24 gap-4 px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-slate-700 font-semibold text-lg">Erreur de chargement</p>
      <p className="text-slate-400 text-sm text-center max-w-xs">
        Impossible de récupérer les données. Vérifiez votre connexion ou réessayez.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/enseignant"
          className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Tableau de bord
        </Link>
      </div>
    </div>
  )
}

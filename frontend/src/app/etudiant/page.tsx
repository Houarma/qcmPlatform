'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Trophy, ClipboardList, Star, ChevronRight, Zap, TrendingUp } from 'lucide-react'
import api from '@/services/api.service'
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting'
import { PillBarChart } from '@/components/dashboard/PillBarChart'
import { GaugeChart } from '@/components/dashboard/GaugeChart'
import type { Evaluation, Resultat } from '@/types'

const DECO = [40, 62, 35, 55, 45, 70, 38]

function ContentSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1 h-32 bg-violet-200 rounded-2xl" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl border border-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px_204px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="h-72 bg-slate-100 rounded-2xl border border-slate-100" />
          <div className="h-52 bg-slate-100 rounded-2xl border border-slate-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-52 bg-violet-200 rounded-2xl" />
          <div className="h-48 bg-slate-100 rounded-2xl border border-slate-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-52 bg-slate-100 rounded-2xl border border-slate-100" />
          <div className="h-44 bg-slate-700 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function EtudiantDashboard() {
  const [tests, setTests]       = useState<Evaluation[]>([])
  const [resultats, setResultats] = useState<Resultat[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Evaluation[]>('/api/evaluations'),
      api.get<Resultat[]>('/api/resultats/mes-resultats'),
    ]).then(([testsRes, resultatsRes]) => {
      setTests(testsRes.data)
      setResultats(resultatsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const avg  = resultats.length ? resultats.reduce((s, r) => s + r.score, 0) / resultats.length : null
  const best = resultats.length ? Math.max(...resultats.map(r => r.score)) : null
  const next = tests[0] ?? null

  const sortedResults = [...resultats].sort((a, b) => new Date(b.datePassage).getTime() - new Date(a.datePassage).getTime())
  const sortedForChart = [...resultats].sort((a, b) => new Date(a.datePassage).getTime() - new Date(b.datePassage).getTime()).slice(-7)

  const barData = Array.from({ length: Math.max(7, sortedForChart.length) }, (_, i) => {
    const r = sortedForChart[i]
    return r
      ? { label: r.evaluationTitre.slice(0, 3).toUpperCase(), value: r.score, filled: true }
      : { label: '—', value: DECO[i % 7], filled: false }
  })

  const evalColors   = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

  function badge(score: number) {
    if (score >= 70) return 'bg-emerald-100 text-emerald-700'
    if (score >= 40) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-600'
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardGreeting subtitle="Passez vos tests et suivez votre progression académique." />
        <Link href="/etudiant/tests"
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm self-start sm:self-auto">
          <Zap className="w-4 h-4" /> Passer un test
        </Link>
      </div>

      {loading ? <ContentSkeleton /> : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-1 bg-violet-700 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-violet-200">Tests disponibles</p>
                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-black">{tests.length}</p>
              <div className="mt-3">
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">↑ Nouveaux ce mois</span>
              </div>
            </div>

            {[
              { label: 'Tests passés',   value: resultats.length,                          icon: ClipboardList, color: 'text-emerald-500', sub: 'Complétés'   },
              { label: 'Score moyen',    value: avg  != null ? `${avg.toFixed(0)}%`  : '—', icon: TrendingUp,   color: 'text-amber-500',  sub: 'Progression' },
              { label: 'Meilleur score', value: best != null ? `${best.toFixed(0)}%` : '—', icon: Star,         color: 'text-violet-500', sub: 'Record'      },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <div className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black text-slate-800">{s.value}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  <span className="text-[10px] text-slate-400">{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── 3-column section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px_204px] gap-4">

            {/* Left */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-700">Analyse des scores</h2>
                  <span className="text-[10px] text-slate-400">Score par évaluation (%)</span>
                </div>
                <PillBarChart data={barData} stripeId="diagEtu" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 flex-1">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Tests disponibles</h2>
                  <Link href="/etudiant/tests" className="text-xs text-violet-600 hover:text-violet-700 font-medium">Voir tout →</Link>
                </div>
                {tests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-200">
                    <BookOpen className="w-8 h-8 mb-2" />
                    <p className="text-xs text-slate-300">Aucun test disponible</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {tests.slice(0, 4).map(t => (
                      <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{t.titre}</p>
                          <p className="text-xs text-slate-400">{t.questions?.length ?? 0} questions</p>
                        </div>
                        <Link href={`/etudiant/tests/${t.id}`} className="text-slate-200 hover:text-violet-500 transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Middle */}
            <div className="flex flex-col gap-4">
              <div className="bg-violet-900 rounded-2xl p-5 text-white flex-1">
                <p className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold mb-3">Prochain test</p>
                {next ? (
                  <>
                    <h3 className="text-base font-bold leading-snug mb-1">{next.titre}</h3>
                    <p className="text-xs text-violet-300 mb-4">{next.questions?.length ?? 0} questions · Disponible</p>
                    <Link href={`/etudiant/tests/${next.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-colors">
                      <Zap className="w-3.5 h-3.5" /> Commencer
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-bold leading-snug mb-1">Aucun test disponible</h3>
                    <p className="text-xs text-violet-300">Vos enseignants n'ont pas encore publié de tests</p>
                  </>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-1 text-center">Score moyen</h2>
                <GaugeChart value={avg ?? 0} label="Moyenne globale"
                  legend={[
                    { color: '#7c3aed', label: '≥ 70%' },
                    { color: '#f59e0b', label: '40-70%' },
                    { color: '#ef4444', label: '< 40%'  },
                  ]} />
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 flex-1">
                <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Résultats</h2>
                  <Link href="/etudiant/resultats" className="text-[10px] text-violet-600 hover:text-violet-700 font-medium">Voir tout →</Link>
                </div>
                {sortedResults.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-300">Pas encore de résultats</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {sortedResults.slice(0, 5).map((r, i) => (
                      <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                        <div className={`w-6 h-6 rounded-full ${evalColors[i % 5]} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[9px] font-bold">{r.evaluationTitre.slice(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 max-w-32 truncate">{r.evaluationTitre}</p>
                          <p className="text-[10px] text-slate-400">{new Date(r.datePassage).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${badge(r.score)}`}>
                          {r.score.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800 rounded-2xl p-5 text-white">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Progression</p>
                <div className="space-y-3">
                  {[
                    { label: 'Tests complétés', value: resultats.length,                          color: 'text-violet-400'  },
                    { label: 'Meilleur score',  value: best != null ? `${best.toFixed(0)}%` : '—', color: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{s.label}</span>
                      <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

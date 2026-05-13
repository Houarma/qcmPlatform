'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, CheckCircle2, Edit3, BookOpen, BarChart2, TrendingUp } from 'lucide-react'
import api from '@/services/api.service'
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting'
import { PillBarChart } from '@/components/dashboard/PillBarChart'
import { GaugeChart } from '@/components/dashboard/GaugeChart'
import type { Evaluation } from '@/types'

const DECO = [45, 68, 32, 58, 40, 72, 50]

function ContentSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-32 bg-violet-200 rounded-2xl" />
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

export default function EnseignantDashboard() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Evaluation[]>('/api/evaluations/mes-evaluations')
      .then(r => setEvaluations(r.data))
      .finally(() => setLoading(false))
  }, [])

  const publiees       = evaluations.filter(e => e.statut === 'PUBLIEE').length
  const brouillons     = evaluations.filter(e => e.statut === 'BROUILLON').length
  const archivees      = evaluations.filter(e => e.statut === 'ARCHIVEE').length
  const totalQuestions = evaluations.reduce((s, e) => s + (e.questions?.length ?? 0), 0)
  const pubRate        = evaluations.length ? (publiees / evaluations.length) * 100 : 0

  const recentEvals = [...evaluations].slice(-7)
  const barData = Array.from({ length: Math.max(7, recentEvals.length) }, (_, i) => {
    const ev = recentEvals[i]
    return ev
      ? { label: ev.titre.slice(0, 3).toUpperCase(), value: Math.max(ev.questions?.length ?? 0, 1), filled: ev.statut === 'PUBLIEE' }
      : { label: '—', value: DECO[i % 7], filled: false }
  })

  function statutStyle(s: string) {
    if (s === 'PUBLIEE')  return { label: 'Publiée',   cls: 'bg-emerald-100 text-emerald-700' }
    if (s === 'ARCHIVEE') return { label: 'Archivée',  cls: 'bg-slate-100 text-slate-500'     }
    return                       { label: 'Brouillon', cls: 'bg-amber-100 text-amber-700'     }
  }

  const latestPublished = evaluations.find(e => e.statut === 'PUBLIEE')
  const evalColors = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardGreeting subtitle="Gérez vos évaluations et analysez les résultats avec facilité." />
        <div className="flex items-center gap-3">
          <Link href="/enseignant/evaluations/creer"
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Nouvelle évaluation
          </Link>
          <Link href="/enseignant/evaluations"
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Voir tout
          </Link>
        </div>
      </div>

      {loading ? <ContentSkeleton /> : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-1 bg-violet-700 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-violet-200">Total QCMs</p>
                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-black">{evaluations.length}</p>
              <div className="mt-3">
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">↑ En hausse ce mois</span>
              </div>
            </div>

            {[
              { label: 'QCMs Publiés',    value: publiees,       icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Brouillons',       value: brouillons,     icon: Edit3,        color: 'text-amber-500'   },
              { label: 'Questions créées', value: totalQuestions, icon: BookOpen,     color: 'text-sky-500'     },
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
                  <span className="text-[10px] text-slate-400">En hausse ce mois</span>
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
                  <h2 className="text-sm font-semibold text-slate-700">Analyse QCM</h2>
                  <span className="text-[10px] text-slate-400">Questions par évaluation</span>
                </div>
                <PillBarChart data={barData} stripeId="diagEns" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 flex-1">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Activité récente</h2>
                  <Link href="/enseignant/evaluations" className="text-xs text-violet-600 hover:text-violet-700 font-medium">Voir tout →</Link>
                </div>
                {evaluations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-200">
                    <BookOpen className="w-8 h-8 mb-2" />
                    <p className="text-xs text-slate-300">Aucune évaluation</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {evaluations.slice(0, 4).map(e => {
                      const s = statutStyle(e.statut)
                      return (
                        <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5 text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{e.titre}</p>
                            <p className="text-xs text-slate-400">{e.questions?.length ?? 0} questions</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium shrink-0 ${s.cls}`}>{s.label}</span>
                          {e.statut === 'PUBLIEE' && (
                            <Link href={`/enseignant/evaluations/${e.id}/analyses`} className="text-slate-300 hover:text-violet-500 transition-colors shrink-0">
                              <BarChart2 className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Middle */}
            <div className="flex flex-col gap-4">
              <div className="bg-violet-900 rounded-2xl p-5 text-white flex-1">
                <p className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold mb-3">Rappel actif</p>
                {latestPublished ? (
                  <>
                    <h3 className="text-base font-bold leading-snug mb-1">{latestPublished.titre}</h3>
                    <p className="text-xs text-violet-300 mb-4">{latestPublished.questions?.length ?? 0} questions · Publiée</p>
                    <Link href={`/enseignant/evaluations/${latestPublished.id}/analyses`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-colors">
                      <TrendingUp className="w-3.5 h-3.5" /> Voir les analyses
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-bold leading-snug mb-1">Publiez votre premier QCM</h3>
                    <p className="text-xs text-violet-300 mb-4">Créez et publiez une évaluation pour commencer</p>
                    <Link href="/enseignant/evaluations/creer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Créer un QCM
                    </Link>
                  </>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-1 text-center">Taux de publication</h2>
                <GaugeChart value={pubRate} label="Publiées"
                  legend={[
                    { color: '#7c3aed', label: 'Publiées' },
                    { color: '#f59e0b', label: 'Brouillons' },
                    { color: '#e2e8f0', label: 'Archivées' },
                  ]} />
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 flex-1">
                <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Évaluations</h2>
                  <Link href="/enseignant/evaluations/creer"
                    className="flex items-center gap-1 text-[10px] text-violet-600 border border-violet-200 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors font-medium">
                    <Plus className="w-3 h-3" /> Nouvelle
                  </Link>
                </div>
                {evaluations.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-300">Aucune évaluation</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {evaluations.slice(0, 5).map((e, i) => (
                      <Link key={e.id} href={`/enseignant/evaluations/${e.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                        <div className={`w-6 h-6 rounded-full ${evalColors[i % 5]} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[9px] font-bold">{e.titre.slice(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{e.titre}</p>
                          <p className="text-[10px] text-slate-400">{new Date(e.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800 rounded-2xl p-5 text-white">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Synthèse</p>
                <div className="space-y-3">
                  {[
                    { label: 'Questions créées', value: totalQuestions, color: 'text-violet-400' },
                    { label: 'QCMs archivés',    value: archivees,      color: 'text-slate-400'  },
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

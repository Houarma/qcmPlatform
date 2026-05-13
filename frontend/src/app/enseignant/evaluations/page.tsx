'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api.service'
import { Evaluation } from '@/types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Plus, BookOpen, BarChart2, ChevronRight } from 'lucide-react'

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Evaluation[]>('/api/evaluations/mes-evaluations')
      .then(r => setEvaluations(r.data))
      .finally(() => setLoading(false))
  }, [])

  const statutBadge = (s: string) =>
    s === 'PUBLIEE' ? 'success' : s === 'ARCHIVEE' ? 'danger' : 'warning'

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Mes évaluations</h1>
        <Link href="/enseignant/evaluations/creer">
          <Button>
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : evaluations.length === 0 ? (
        <Card>
          <div className="text-center py-16 text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucune évaluation</p>
            <p className="text-sm mt-1">Créez votre première évaluation avec l&apos;IA</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {evaluations.map(e => (
            <Card key={e.id} className="hover:shadow-md transition-shadow">
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{e.titre}</h3>
                    <Badge variant={statutBadge(e.statut) as 'success' | 'danger' | 'warning'}>{e.statut}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{e.objectifs}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {e.questions?.length ?? 0} questions · Créée le {new Date(e.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {e.statut === 'PUBLIEE' && (
                    <Link href={`/enseignant/evaluations/${e.id}/analyses`}>
                      <Button variant="secondary" size="sm">
                        <BarChart2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Analyses</span>
                      </Button>
                    </Link>
                  )}
                  <Link href={`/enseignant/evaluations/${e.id}`}>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

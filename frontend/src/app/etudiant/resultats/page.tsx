'use client'

import { useMesResultats } from '@/hooks/useResultats'
import Card, { CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { Trophy, TrendingUp } from 'lucide-react'

export default function ResultatsPage() {
  const { data: resultats = [], isLoading } = useMesResultats()

  const avg = resultats.length
    ? (resultats.reduce((s, r) => s + r.score, 0) / resultats.length).toFixed(1)
    : null

  const scoreBadge = (score: number) =>
    score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Mes résultats</h1>
        {avg && (
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="h-5 w-5 text-indigo-600 shrink-0" />
            <span className="text-sm">Score moyen : <strong className="text-indigo-600">{avg}%</strong></span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : resultats.length === 0 ? (
        <Card>
          <CardBody className="text-center py-16 text-gray-400">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun résultat</p>
            <p className="text-sm mt-1">Passez votre premier test pour voir vos résultats ici</p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {resultats.map(r => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{r.evaluationTitre}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Passé le {new Date(r.datePassage).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-2xl font-bold text-gray-900">
                    {r.score.toFixed(0)}<span className="text-sm font-normal text-gray-500">%</span>
                  </p>
                  <Badge variant={scoreBadge(r.score) as 'success' | 'warning' | 'danger'}>
                    {r.score >= 70 ? 'Réussi' : r.score >= 40 ? 'Passable' : 'À revoir'}
                  </Badge>
                </div>
              </div>
              <div className="px-4 sm:px-6 pb-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${r.score >= 70 ? 'bg-green-500' : r.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

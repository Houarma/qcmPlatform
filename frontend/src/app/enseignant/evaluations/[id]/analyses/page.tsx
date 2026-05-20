'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAnalyse } from '@/hooks/useAnalyse'
import Card, { CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, Users, TrendingUp, AlertTriangle } from 'lucide-react'

export default function AnalysesPage() {
  const { id } = useParams<{ id: string }>()
  const { data: analyse, isLoading, isError } = useAnalyse(id)

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (isError || !analyse) {
    return (
      <div className="p-4 sm:p-6 text-center py-20 text-slate-400 max-w-md mx-auto">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Analyse indisponible</p>
        <p className="text-sm mt-1">Il faut au moins un résultat étudiant pour générer une analyse.</p>
        <Link href={`/enseignant/evaluations/${id}`} className="mt-4 inline-block">
          <Button variant="secondary" size="sm"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
      </div>
    )
  }

  const classif = (c: string) =>
    c === 'Facile' ? 'success' : c === 'Difficile' ? 'danger' : 'warning'

  return (
    <div className="p-4 sm:p-6">
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href={`/enseignant/evaluations/${id}`}>
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Analyse ML</h1>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Étudiants', value: analyse.nbEtudiants, icon: Users, color: 'text-violet-600' },
          { label: 'Score moyen', value: `${analyse.scoreMoyen.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Questions analysées', value: Object.keys(analyse.tauxEchecParQuestion ?? {}).length, icon: AlertTriangle, color: 'text-yellow-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardBody className="flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Groupes K-Means */}
      {analyse.groupes && analyse.groupes.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Groupes de niveau (K-Means)</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {analyse.groupes.map((g, i) => (
              <div key={i} className="border border-slate-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-800">{g.niveau}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{g.etudiants.length} étudiant(s)</span>
                    <Badge variant={g.scoreMoyenGroupe >= 70 ? 'success' : g.scoreMoyenGroupe >= 40 ? 'warning' : 'danger'}>
                      Moy: {g.scoreMoyenGroupe.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.etudiants.map((e, j) => (
                    <span key={j} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Difficulté par question */}
      {analyse.difficultes && analyse.difficultes.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Classification des questions</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2">
              {analyse.difficultes.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-slate-700">Question #{d.questionId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">Taux d&apos;échec: {d.tauxEchec.toFixed(1)}%</span>
                    <Badge variant={classif(d.classification) as 'success' | 'danger' | 'warning'}>
                      {d.classification}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Lacunes détectées */}
      {analyse.lacunes && analyse.lacunes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h2 className="font-semibold text-slate-800">Lacunes détectées</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-3">
              {analyse.lacunes.map((l, i) => (
                <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-orange-800">Question #{l.questionId}</span>
                    <Badge variant="danger">{l.tauxEchec.toFixed(1)}% d&apos;échec</Badge>
                  </div>
                  <p className="text-sm text-orange-700">{l.description}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {analyse.lacunes?.length === 0 && (
        <Card>
          <CardBody className="text-center py-8 text-green-600">
            <TrendingUp className="h-10 w-10 mx-auto mb-2" />
            <p className="font-medium">Aucune lacune détectée</p>
            <p className="text-sm text-slate-500 mt-1">Les étudiants maîtrisent bien le contenu</p>
          </CardBody>
        </Card>
      )}
    </div>
    </div>
  )
}

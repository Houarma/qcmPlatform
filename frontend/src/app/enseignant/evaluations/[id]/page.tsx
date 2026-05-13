'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/services/api.service'
import { Evaluation } from '@/types'
import Card, { CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, CheckCircle, BarChart2 } from 'lucide-react'

export default function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    api.get<Evaluation>(`/api/evaluations/${id}`)
      .then(r => setEvaluation(r.data))
      .catch(() => toast.error('Évaluation introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  async function handlePublier() {
    setPublishing(true)
    try {
      const { data } = await api.post(`/api/evaluations/${id}/publier`)
      setEvaluation(data)
      toast.success('Évaluation publiée ! Les étudiants peuvent maintenant y accéder.')
    } catch {
      toast.error('Erreur lors de la publication')
    } finally {
      setPublishing(false)
    }
  }

  const statutBadge = (s: string) =>
    s === 'PUBLIEE' ? 'success' : s === 'ARCHIVEE' ? 'danger' : 'warning'

  const labels = ['A', 'B', 'C', 'D']

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!evaluation) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Évaluation introuvable</p>
        <Link href="/enseignant/evaluations" className="text-violet-600 text-sm mt-2 hover:underline">Retour</Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-start gap-3">
          <Link href="/enseignant/evaluations">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{evaluation.titre}</h1>
              <Badge variant={statutBadge(evaluation.statut) as 'success' | 'danger' | 'warning'}>
                {evaluation.statut}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {evaluation.statut === 'PUBLIEE' && (
              <Link href={`/enseignant/evaluations/${id}/analyses`}>
                <Button variant="secondary" size="sm">
                  <BarChart2 className="h-4 w-4" />
                  Analyses ML
                </Button>
              </Link>
            )}
            {evaluation.statut === 'BROUILLON' && (
              <Button onClick={handlePublier} loading={publishing} size="sm">
                <CheckCircle className="h-4 w-4" />
                Publier
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader><h2 className="font-semibold text-slate-800">Informations</h2></CardHeader>
          <CardBody className="flex flex-col gap-2 text-sm">
            <div><span className="text-slate-500">Objectifs :</span> <span className="text-slate-800">{evaluation.objectifs}</span></div>
            {evaluation.prompt && (
              <div><span className="text-slate-500">Instructions :</span> <span className="text-slate-800">{evaluation.prompt}</span></div>
            )}
            <div><span className="text-slate-500">Créée le :</span> <span className="text-slate-800">{new Date(evaluation.createdAt).toLocaleString('fr-FR')}</span></div>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-slate-800">{evaluation.questions?.length ?? 0} questions générées</h2>
          {evaluation.questions?.map((q, qi) => (
            <Card key={q.id}>
              <CardHeader>
                <p className="font-medium text-slate-900">
                  <span className="text-violet-600 mr-2">Q{qi + 1}.</span>
                  {q.contenu}
                </p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={opt.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 text-sm"
                    >
                      <span className="font-bold text-violet-600 shrink-0">{labels[oi]}.</span>
                      <span className="text-slate-700">{opt.contenu}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

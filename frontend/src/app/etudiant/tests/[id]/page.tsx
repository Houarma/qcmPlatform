'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useEvaluation } from '@/hooks/useEvaluations'
import { useMesResultats, useSubmitResultat } from '@/hooks/useResultats'
import Card, { CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, CheckCircle, Send } from 'lucide-react'

const LABELS = ['A', 'B', 'C', 'D']

export default function PasserTestPage() {
  const { id } = useParams<{ id: string }>()
  const [reponses, setReponses] = useState<Record<number, string>>({})
  const [scoreLocal, setScoreLocal] = useState<number | null>(null)

  const { data: evaluation, isLoading: loadingEval } = useEvaluation(id)
  const { data: resultats = [], isLoading: loadingResultats } = useMesResultats()
  const submitResultat = useSubmitResultat()

  const isLoading = loadingEval || loadingResultats

  const existingResult = resultats.find(r => r.evaluationId === Number(id))
  const score = scoreLocal ?? existingResult?.score ?? null

  function selectReponse(questionId: number, label: string) {
    setReponses(r => ({ ...r, [questionId]: label }))
  }

  async function handleSubmit() {
    if (!evaluation) return
    const nbRepondu = Object.keys(reponses).length
    if (nbRepondu < evaluation.questions.length) {
      toast.error(`Répondez à toutes les questions (${nbRepondu}/${evaluation.questions.length})`)
      return
    }
    try {
      const result = await submitResultat.mutateAsync({
        evaluationId: evaluation.id,
        reponses,
      })
      setScoreLocal(result.score)
      toast.success(`Test soumis ! Score : ${result.score.toFixed(0)}%`)
    } catch {
      toast.error('Erreur lors de la soumission')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!evaluation) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Test introuvable</p>
        <Link href="/etudiant/tests" className="text-violet-600 text-sm mt-2 hover:underline block">Retour</Link>
      </div>
    )
  }

  if (score !== null) {
    const pct = score.toFixed(0)
    const good = score >= 70
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardBody className="text-center py-10">
              <CheckCircle className={`h-16 w-16 mx-auto mb-4 ${good ? 'text-green-500' : 'text-yellow-500'}`} />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Test terminé !</h2>
              <p className="text-5xl font-bold mb-2" style={{ color: good ? '#16a34a' : '#d97706' }}>
                {pct}%
              </p>
              <p className="text-slate-500 mb-6">
                {good ? 'Excellent travail ! 🎉' : score >= 40 ? 'Bon effort, continuez ! 💪' : 'Révisez et réessayez 📚'}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/etudiant/resultats">
                  <Button variant="secondary">Voir mes résultats</Button>
                </Link>
                <Link href="/etudiant/tests">
                  <Button>Autres tests</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  const answered = Object.keys(reponses).length
  const total = evaluation.questions.length

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Link href="/etudiant/tests">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{evaluation.titre}</h1>
            <p className="text-sm text-slate-500">{answered}/{total} questions répondues</p>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>

        {evaluation.questions.map((q, qi) => (
          <Card key={q.id}>
            <CardHeader>
              <p className="font-medium text-slate-900">
                <span className="text-violet-600 mr-2">{qi + 1}.</span>
                {q.contenu}
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const label = LABELS[oi]
                  const selected = reponses[q.id] === label
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectReponse(q.id, label)}
                      className={`
                        flex items-center gap-3 w-full rounded-lg px-4 py-3 text-left text-sm transition-all
                        ${selected
                          ? 'bg-violet-50 border-2 border-violet-500 text-violet-900'
                          : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100 text-slate-700'
                        }
                      `}
                    >
                      <span className={`font-bold shrink-0 ${selected ? 'text-violet-600' : 'text-slate-400'}`}>
                        {label}.
                      </span>
                      {opt.contenu}
                      {selected && <CheckCircle className="h-4 w-4 ml-auto text-violet-600 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        ))}

        <div className="flex justify-end pb-6">
          <Button
            onClick={handleSubmit}
            loading={submitResultat.isPending}
            size="lg"
            disabled={answered < total}
          >
            <Send className="h-4 w-4" />
            Soumettre le test
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/services/api.service'
import Card, { CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const AI_MESSAGES = [
  'Génération en cours...',
  'Analyse des objectifs...',
  'Création des questions...',
  'Vérification des réponses...',
  'Finalisation du QCM...',
]

export default function CreerEvaluationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    titre: '',
    objectifs: '',
    prompt: '',
    nbQuestions: 5,
  })
  const [loading, setLoading] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    if (!loading) { setMsgIdx(0); return }
    const timer = setInterval(() => setMsgIdx(i => (i + 1) % AI_MESSAGES.length), 2000)
    return () => clearInterval(timer)
  }, [loading])

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/evaluations', {
        titre: form.titre,
        objectifs: form.objectifs,
        prompt: form.prompt || null,
        nbQuestions: Number(form.nbQuestions),
      })
      toast.success('Évaluation générée avec succès !')
      router.push(`/enseignant/evaluations/${data.id}`)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 403) {
        toast.error('Accès refusé. Votre compte n\'a pas le rôle ENSEIGNANT.')
      } else if (status === 503 || status === 500) {
        toast.error('Le service de génération IA est indisponible. Réessayez dans quelques secondes.')
      } else {
        toast.error('Erreur lors de la génération. Vérifiez votre connexion.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/enseignant/evaluations">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle évaluation</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Génération par IA</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Décrivez vos objectifs et l&apos;IA générera les questions automatiquement
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Titre de l'évaluation"
              value={form.titre}
              onChange={set('titre')}
              placeholder="Ex: Quiz sur les algorithmes de tri"
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Objectifs pédagogiques <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.objectifs}
                onChange={set('objectifs') as React.ChangeEventHandler<HTMLTextAreaElement>}
                placeholder="Ex: Maîtriser les algorithmes de tri (bubble sort, merge sort, quick sort) et comprendre leur complexité temporelle"
                rows={3}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Instructions supplémentaires <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                value={form.prompt}
                onChange={set('prompt') as React.ChangeEventHandler<HTMLTextAreaElement>}
                placeholder="Ex: Questions de niveau intermédiaire, avec exemples de code Python"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nombre de questions</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.nbQuestions}
                onChange={e => setForm(f => ({ ...f, nbQuestions: Number(e.target.value) }))}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/enseignant/evaluations">
                <Button variant="secondary" type="button">Annuler</Button>
              </Link>
              <Button type="submit" loading={loading}>
                <Sparkles className="h-4 w-4" />
                {loading ? AI_MESSAGES[msgIdx] : 'Générer l\'évaluation'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

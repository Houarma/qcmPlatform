'use client'

import Link from 'next/link'
import { useEvaluationsPubliees } from '@/hooks/useEvaluations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function TestsPage() {
  const { data: tests = [], isLoading } = useEvaluationsPubliees()

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Tests disponibles</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : tests.length === 0 ? (
        <Card>
          <div className="text-center py-16 text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun test disponible</p>
            <p className="text-sm mt-1">Revenez plus tard, les enseignants préparent des évaluations</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tests.map(t => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{t.titre}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t.objectifs}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t.questions?.length ?? 0} questions · Par {t.enseignantNom}
                  </p>
                </div>
                <Link href={`/etudiant/tests/${t.id}`} className="shrink-0 self-start sm:self-auto">
                  <Button size="sm">
                    Commencer
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

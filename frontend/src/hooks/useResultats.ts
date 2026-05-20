import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api.service'
import { Resultat } from '@/types'

export const resultatKeys = {
  all: ['resultats'] as const,
  mesResultats: () => [...resultatKeys.all, 'mes-resultats'] as const,
}

export function useMesResultats() {
  return useQuery({
    queryKey: resultatKeys.mesResultats(),
    queryFn: () => api.get<Resultat[]>('/api/resultats/mes-resultats').then(r => r.data),
    staleTime: 30_000,
  })
}

interface SubmitPayload {
  evaluationId: number
  reponses: Record<number, string>
}

export function useSubmitResultat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitPayload) =>
      api.post<Resultat>('/api/resultats', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultatKeys.all })
    },
  })
}

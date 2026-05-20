import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api.service'
import { Evaluation } from '@/types'

export const evaluationKeys = {
  all: ['evaluations'] as const,
  mesEvaluations: () => [...evaluationKeys.all, 'mes-evaluations'] as const,
  publiees: () => [...evaluationKeys.all, 'publiees'] as const,
  detail: (id: string | number) => [...evaluationKeys.all, String(id)] as const,
}

export function useMesEvaluations() {
  return useQuery({
    queryKey: evaluationKeys.mesEvaluations(),
    queryFn: () => api.get<Evaluation[]>('/api/evaluations/mes-evaluations').then(r => r.data),
    staleTime: 60_000,
  })
}

export function useEvaluationsPubliees() {
  return useQuery({
    queryKey: evaluationKeys.publiees(),
    queryFn: () => api.get<Evaluation[]>('/api/evaluations').then(r => r.data),
    staleTime: 30_000,
  })
}

export function useEvaluation(id: string) {
  return useQuery({
    queryKey: evaluationKeys.detail(id),
    queryFn: () => api.get<Evaluation>(`/api/evaluations/${id}`).then(r => r.data),
    staleTime: 120_000,
    enabled: !!id,
  })
}

export function usePublierEvaluation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<Evaluation>(`/api/evaluations/${id}/publier`).then(r => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(evaluationKeys.detail(id), updated)
      queryClient.invalidateQueries({ queryKey: evaluationKeys.all })
    },
  })
}

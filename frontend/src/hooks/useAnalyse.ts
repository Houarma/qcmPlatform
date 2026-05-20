import { useQuery } from '@tanstack/react-query'
import api from '@/services/api.service'
import { AnalyseResponse } from '@/types'

export const analyseKeys = {
  all: ['analyses'] as const,
  detail: (id: string | number) => [...analyseKeys.all, String(id)] as const,
}

export function useAnalyse(id: string) {
  return useQuery({
    queryKey: analyseKeys.detail(id),
    queryFn: () => api.get<AnalyseResponse>(`/api/analyses/${id}`).then(r => r.data),
    staleTime: 300_000,
    enabled: !!id,
    retry: false,
  })
}

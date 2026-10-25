import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useProgram() {
  return useQuery({
    queryKey: ['program'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const [programResult, roadmapResult] = await Promise.all([
        supabase.from('program').select('*').order('urutan'),
        supabase.from('roadmap').select('*').order('urutan'),
      ])
      if (programResult.error) throw programResult.error
      if (roadmapResult.error) throw roadmapResult.error
      return { program: programResult.data ?? [], roadmap: roadmapResult.data ?? [] }
    },
    staleTime: 60_000,
  })
}

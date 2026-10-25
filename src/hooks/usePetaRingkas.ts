import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function usePetaRingkas() {
  return useQuery({
    queryKey: ['peta-ringkas'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase.from('v_peta_ringkas').select('*')
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

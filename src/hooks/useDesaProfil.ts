import { useQuery } from '@tanstack/react-query'
import type { DesaProfilRow } from '../types/db'
import { supabase } from '../lib/supabase'

export function useDesaProfil() {
  return useQuery<DesaProfilRow | null>({
    queryKey: ['desa-profil'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase belum dikonfigurasi.')
      }

      const { data, error } = await supabase.from('desa_profil').select('*').maybeSingle()

      if (error) {
        throw error
      }

      return data
    },
    staleTime: 60_000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useDusun() {
  return useQuery({
    queryKey: ['dusun'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase belum dikonfigurasi.')
      }

      const { data, error } = await supabase.from('dusun').select('*').order('urutan', { ascending: true })

      if (error) {
        throw error
      }

      return data ?? []
    },
    staleTime: 60_000,
  })
}

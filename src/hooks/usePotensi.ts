import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function usePotensi() {
  return useQuery({
    queryKey: ['potensi'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase.from('potensi').select('*').order('urutan')
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

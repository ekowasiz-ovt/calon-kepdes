import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useNotifikasiCount() {
  return useQuery({
    queryKey: ['notifikasi-count'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { count, error } = await supabase.from('notifikasi').select('id', { count: 'exact', head: true })
      if (error) throw error
      return count ?? 0
    },
    staleTime: 60_000,
  })
}

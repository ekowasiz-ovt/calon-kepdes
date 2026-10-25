import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAspirasiTerbaru(limit = 5) {
  return useQuery({
    queryKey: ['aspirasi-terbaru', limit],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase
        .from('aspirasi_publik')
        .select('id, kode, judul, kategori, dusun, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useMasalah() {
  return useQuery({
    queryKey: ['masalah'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const [kategoriResult, dusunResult] = await Promise.all([
        supabase.from('v_masalah_kategori').select('*').order('jumlah', { ascending: false }),
        supabase.from('v_masalah_dusun').select('*').order('jumlah', { ascending: false }),
      ])
      if (kategoriResult.error) throw kategoriResult.error
      if (dusunResult.error) throw dusunResult.error
      return { kategori: kategoriResult.data ?? [], dusun: dusunResult.data ?? [] }
    },
    staleTime: 60_000,
  })
}

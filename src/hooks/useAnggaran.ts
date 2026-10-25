import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAnggaran(tahun = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['anggaran', tahun],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const [itemResult, realisasiResult] = await Promise.all([
        supabase.from('anggaran_item').select('*').eq('tahun', tahun).order('urutan'),
        supabase.from('anggaran_realisasi').select('*').eq('tahun', tahun).order('urutan'),
      ])
      if (itemResult.error) throw itemResult.error
      if (realisasiResult.error) throw realisasiResult.error
      return { item: itemResult.data ?? [], realisasi: realisasiResult.data ?? [] }
    },
    staleTime: 60_000,
  })
}

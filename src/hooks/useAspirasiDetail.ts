import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAspirasiDetail(kode: string | undefined) {
  return useQuery({
    queryKey: ['aspirasi-detail', kode],
    enabled: Boolean(kode),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      if (!kode) return null

      const { data: aspirasi, error: aspirasiError } = await supabase
        .from('aspirasi_publik')
        .select('*')
        .eq('kode', kode)
        .maybeSingle()
      if (aspirasiError) throw aspirasiError
      if (!aspirasi) return null

      const [fotoResult, statusResult] = await Promise.all([
        supabase.from('aspirasi_foto').select('*').eq('aspirasi_id', aspirasi.id).order('urutan'),
        supabase.from('aspirasi_status_log').select('*').eq('aspirasi_id', aspirasi.id).order('tanggal'),
      ])
      if (fotoResult.error) throw fotoResult.error
      if (statusResult.error) throw statusResult.error

      return { aspirasi, foto: fotoResult.data ?? [], statusLog: statusResult.data ?? [] }
    },
    staleTime: 60_000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useUmkm() {
  return useQuery({
    queryKey: ['umkm'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const [umkmResult, dusunResult] = await Promise.all([
        supabase.from('umkm').select('*').eq('aktif', true).order('nama'),
        supabase.from('dusun').select('id, nama'),
      ])
      if (umkmResult.error) throw umkmResult.error
      if (dusunResult.error) throw dusunResult.error
      const dusunById = new Map((dusunResult.data ?? []).map((dusun) => [dusun.id, dusun.nama]))
      return (umkmResult.data ?? []).map((umkm) => ({
        ...umkm,
        dusun: umkm.dusun_id === null ? null : dusunById.get(umkm.dusun_id) ?? null,
      }))
    },
    staleTime: 60_000,
  })
}

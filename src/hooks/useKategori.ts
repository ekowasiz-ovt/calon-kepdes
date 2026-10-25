import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useKategori() {
  return useQuery({
    queryKey: ['kategori'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase.from('kategori').select('*').order('urutan')
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

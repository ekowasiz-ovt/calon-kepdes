import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function usePetaPin() {
  return useQuery({
    queryKey: ['peta-pin'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase
        .from('aspirasi_publik')
        .select('*')
        .neq('status', 'Selesai')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

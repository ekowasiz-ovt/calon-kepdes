import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * Total dukungan warga. Hanya angka agregat; daftar nama tidak pernah dibaca klien.
 */
export function useDukunganRingkas() {
  return useQuery({
    queryKey: ['dukungan-ringkas'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase belum dikonfigurasi.')
      }

      const { data, error } = await supabase.from('v_dukungan_ringkas').select('*').maybeSingle()

      if (error) {
        throw error
      }

      return data ?? { total: 0, jumlah_dusun: 0 }
    },
    staleTime: 60_000,
  })
}

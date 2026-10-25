import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export type KirimDukunganInput = {
  nama: string
  dusunId: number
}

/**
 * Kirim dukungan lewat RPC `kirim_dukungan`. Server mengembalikan total terbaru
 * dan tidak pernah mengirim balik nama pendukung lain.
 */
export function useKirimDukungan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: KirimDukunganInput) => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')

      const { data, error } = await supabase.rpc('kirim_dukungan', {
        p_nama: input.nama,
        p_dusun_id: input.dusunId,
      })

      if (error) {
        const pesan =
          error.code === 'PGRST202'
            ? 'Fungsi kirim_dukungan belum tersedia di Supabase. Jalankan migrasi 0004_dukungan.sql, lalu muat ulang schema API.'
            : error.message
        throw new Error(pesan)
      }
      if (typeof data !== 'number') throw new Error('Total dukungan tidak diterima dari server.')
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dukungan-ringkas'] })
    },
  })
}

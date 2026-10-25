import { useMutation, useQueryClient } from '@tanstack/react-query'
import { simpanKodeRiwayat } from '../lib/localState'
import { uploadFotoAspirasi } from '../lib/storage'
import { supabase } from '../lib/supabase'

export type KirimAspirasiInput = {
  nama: string
  hp: string
  kategori_id: number
  judul: string
  deskripsi: string
  lokasi_teks?: string | null
  dusun_id?: number | null
  lat?: number | null
  lng?: number | null
  foto?: File[]
}

export function useKirimAspirasi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: KirimAspirasiInput) => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const fotoPaths: string[] = []

      for (const file of (input.foto ?? []).slice(0, 2)) {
        fotoPaths.push(await uploadFotoAspirasi(file))
      }

      const { data, error } = await supabase.rpc('kirim_aspirasi', {
        p_nama: input.nama,
        p_hp: input.hp,
        p_kategori_id: input.kategori_id,
        p_judul: input.judul,
        p_deskripsi: input.deskripsi,
        p_lokasi_teks: input.lokasi_teks ?? null,
        p_dusun_id: input.dusun_id ?? null,
        p_lat: input.lat ?? null,
        p_lng: input.lng ?? null,
        p_foto_paths: fotoPaths,
      })

      if (error) throw error
      if (!data) throw new Error('Kode aspirasi tidak diterima dari server.')
      simpanKodeRiwayat(data)
      return data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['peta-pin'] }),
        queryClient.invalidateQueries({ queryKey: ['peta-ringkas'] }),
        queryClient.invalidateQueries({ queryKey: ['masalah'] }),
      ])
    },
  })
}

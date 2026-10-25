import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useTanya() {
  return useMutation({
    mutationFn: async (pertanyaan: string) => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data, error } = await supabase.functions.invoke('tanya-karanganyar', {
        body: { pertanyaan },
      })
      if (error) throw error
      if (typeof data?.jawaban !== 'string') throw new Error('Jawaban tidak tersedia.')
      return data.jawaban
    },
  })
}

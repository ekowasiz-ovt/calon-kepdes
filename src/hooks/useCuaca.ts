import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export type CuacaData = {
  suhu: number | null
  kondisi: string | null
  max: number | null
  min: number | null
  source: 'open-meteo' | 'profil-desa'
}

function kondisiCuaca(code: number): string {
  if (code === 0) return 'Cerah'
  if ([1, 2].includes(code)) return 'Cerah Berawan'
  if (code === 3) return 'Berawan'
  if ([45, 48].includes(code)) return 'Berkabut'
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Hujan'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Salju'
  if ([95, 96, 99].includes(code)) return 'Badai Petir'
  return 'Berawan'
}

export function useCuaca() {
  return useQuery({
    queryKey: ['cuaca'],
    queryFn: async (): Promise<CuacaData> => {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
      const { data: profil, error } = await supabase.from('desa_profil').select('*').maybeSingle()
      if (error) throw error
      if (!profil) throw new Error('Profil desa belum tersedia.')

      try {
        if (profil.lat === null || profil.lng === null) throw new Error('Koordinat desa belum tersedia.')
        const url = new URL('https://api.open-meteo.com/v1/forecast')
        url.search = new URLSearchParams({
          latitude: String(profil.lat),
          longitude: String(profil.lng),
          current: 'temperature_2m,weather_code',
          daily: 'temperature_2m_max,temperature_2m_min',
          forecast_days: '1',
          timezone: 'auto',
        }).toString()
        const response = await fetch(url)
        if (!response.ok) throw new Error('Data cuaca tidak tersedia.')
        const weather = await response.json() as {
          current?: { temperature_2m?: number; weather_code?: number }
          daily?: { temperature_2m_max?: number[]; temperature_2m_min?: number[] }
        }
        return {
          suhu: weather.current?.temperature_2m ?? profil.cuaca_suhu,
          kondisi: weather.current?.weather_code === undefined ? profil.cuaca_kondisi : kondisiCuaca(weather.current.weather_code),
          max: weather.daily?.temperature_2m_max?.[0] ?? profil.cuaca_max,
          min: weather.daily?.temperature_2m_min?.[0] ?? profil.cuaca_min,
          source: 'open-meteo',
        }
      } catch {
        return {
          suhu: profil.cuaca_suhu,
          kondisi: profil.cuaca_kondisi,
          max: profil.cuaca_max,
          min: profil.cuaca_min,
          source: 'profil-desa',
        }
      }
    },
    staleTime: 60_000,
  })
}

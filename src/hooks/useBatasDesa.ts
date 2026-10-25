import { useQuery } from '@tanstack/react-query'
import type { FeatureCollection, Geometry } from 'geojson'

export type BatasDesaProperti = {
  nama?: string
  sumber?: string
  lisensi?: string
  status?: 'resmi' | 'perkiraan'
}

export type BatasDesaData = FeatureCollection<Geometry, BatasDesaProperti>

const BATAS_DESA_URL = '/data/batas-desa-karanganyar.geojson'

async function ambilBatasDesa(): Promise<BatasDesaData | null> {
  const response = await fetch(BATAS_DESA_URL, {
    headers: { Accept: 'application/geo+json, application/json' },
  })

  // Berkas belum disediakan bukan error halaman: peta tetap bisa dipakai tanpa outline.
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Batas desa belum dapat dimuat.')
  }

  let data: unknown

  try {
    data = await response.json()
  } catch {
    // Server pengembangan dapat mengembalikan index.html untuk berkas yang belum ada.
    return null
  }

  if (
    !data
    || typeof data !== 'object'
    || (data as { type?: unknown }).type !== 'FeatureCollection'
    || !Array.isArray((data as { features?: unknown }).features)
    || (data as { features: unknown[] }).features.length === 0
  ) {
    return null
  }

  return data as BatasDesaData
}

export function useBatasDesa() {
  return useQuery({
    queryKey: ['batas-desa'],
    queryFn: ambilBatasDesa,
    staleTime: Infinity,
    retry: false,
  })
}

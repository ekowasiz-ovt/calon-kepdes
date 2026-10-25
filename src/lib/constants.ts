export type GayaKategori = { color: string; background: string }

/** Palet kategori dipakai bersama oleh marker peta, chip filter, dan baris ringkasan. */
export const gayaKategoriPeta: Record<string, GayaKategori> = {
  Infrastruktur: { color: '#b3261e', background: '#fbedec' },
  Pertanian: { color: '#14664a', background: '#eaf0ec' },
  UMKM: { color: '#0b3d2e', background: '#f6eddd' },
  Irigasi: { color: '#1e7a54', background: '#eaf0ec' },
  Pemuda: { color: '#55655c', background: '#ecebe7' },
  Kesehatan: { color: '#8a6218', background: '#f6eddd' },
  Pendidikan: { color: '#c08a2e', background: '#f6eddd' },
  Kebersihan: { color: '#1e7a54', background: '#eaf0ec' },
  Keamanan: { color: '#55655c', background: '#ecebe7' },
  Sosial: { color: '#8a6218', background: '#f6eddd' },
  Lainnya: { color: '#8a9890', background: '#ecebe7' },
}

export const urutanKategori = [
  'Infrastruktur',
  'Pertanian',
  'UMKM',
  'Irigasi',
  'Pemuda',
  'Kesehatan',
  'Pendidikan',
  'Kebersihan',
  'Keamanan',
  'Sosial',
  'Lainnya',
] as const

const aliasKategori: Record<string, string> = {
  jalan: 'Infrastruktur',
  lampu: 'Infrastruktur',
  fasilitas: 'Infrastruktur',
  'fasilitas umum': 'Infrastruktur',
  ekonomi: 'UMKM',
  air: 'Irigasi',
}

const gayaCadangan: GayaKategori[] = [
  { color: '#b3261e', background: '#fbedec' },
  { color: '#0b3d2e', background: '#eaf0ec' },
  { color: '#8a6218', background: '#f6eddd' },
  { color: '#14664a', background: '#eaf0ec' },
  { color: '#55655c', background: '#ecebe7' },
]

export function indeksKategori(nama: string): number {
  const normalized = nama.trim().toLowerCase()
  const found = urutanKategori.findIndex((item) => item.toLowerCase() === normalized)
  return found === -1 ? Number.MAX_SAFE_INTEGER : found
}

export function gayaKategori(nama: string, index = 0): GayaKategori {
  const normalized = nama.trim().toLowerCase()
  const namaBaku = aliasKategori[normalized]
    ?? urutanKategori.find((item) => item.toLowerCase() === normalized)

  if (namaBaku && gayaKategoriPeta[namaBaku]) {
    return gayaKategoriPeta[namaBaku]
  }

  return gayaCadangan[index % gayaCadangan.length]
}

export function badgeStatus(status: string): { label: string; tone: 'success' | 'info' | 'warning' | 'neutral' } {
  if (status === 'Selesai') {
    return { label: 'Selesai', tone: 'success' }
  }

  if (status === 'Diterima') {
    return { label: 'Diterima', tone: 'info' }
  }

  return { label: 'Dalam Proses', tone: 'warning' }
}

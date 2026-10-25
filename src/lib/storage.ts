import { supabase } from './supabase'

const PUBLIC_BUCKETS = {
  aspirasi: 'aspirasi-foto',
  konten: 'konten',
} as const

export function fotoUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('/')) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const bucket = path.startsWith('uploads/') ? PUBLIC_BUCKETS.aspirasi : PUBLIC_BUCKETS.konten
  const baseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!baseUrl) {
    return path
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export async function uploadFotoAspirasi(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Konfigurasi Supabase belum tersedia.')
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error('Format file harus JPG atau PNG.')
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran foto maksimal 5 MB.')
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const storagePath = `uploads/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from('aspirasi-foto').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  return storagePath
}

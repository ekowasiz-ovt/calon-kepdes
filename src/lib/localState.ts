const KODE_RIWAYAT_KEY = 'karanganyar_last_aspirasi_kode'

export function simpanKodeRiwayat(kode: string): void {
  if (!kode) return

  try {
    localStorage.setItem(KODE_RIWAYAT_KEY, kode)
  } catch {
    // ignore storage errors
  }
}

export function ambilKodeTerakhir(): string | null {
  try {
    return localStorage.getItem(KODE_RIWAYAT_KEY)
  } catch {
    return null
  }
}

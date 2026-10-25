import { HandHeart } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'

// Halaman yang sudah punya aksi kirim sendiri; FAB hanya menutupi tombol di sana.
const tanpaFab = ['/dukungan', '/aspirasi', '/tanya']

/**
 * Tombol melayang "Dukung Calon". Selalu terlihat di semua halaman kampanye
 * supaya ajakan dukungan tidak hanya muncul sekali di hero.
 */
export function TombolDukung() {
  const { pathname } = useLocation()
  if (tanpaFab.some((jalur) => pathname.startsWith(jalur))) return null

  return (
    <Link className="kampanye-fab" to="/dukungan" aria-label="Dukung Calon">
      <HandHeart size={22} aria-hidden="true" />
      <span className="kampanye-fab__teks">Dukung Calon</span>
    </Link>
  )
}

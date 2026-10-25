import { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNavKampanye } from './BottomNavKampanye'
import { FooterKampanye } from './FooterKampanye'
import { HeaderKampanye } from './HeaderKampanye'
import { TombolDukung } from './TombolDukung'
import { useSudahDigulir } from '../../hooks/useSudahDigulir'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

/**
 * Kerangka bersama seluruh halaman kampanye: header, isi, footer.
 * Menggantikan frame ponsel lama supaya semua halaman tampil penuh dan seragam.
 */
export function LayoutKampanye() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useRevealOnScroll(containerRef)
  const { sentinelRef, sudah } = useSudahDigulir()

  return (
    <div className={`kampanye${pathname === '/menu' ? ' kampanye--menu' : ''}`} ref={containerRef}>
      <div ref={sentinelRef} aria-hidden="true" />
      <HeaderKampanye menempel={sudah} />
      <main>
        <Outlet />
      </main>
      <FooterKampanye />
      <BottomNavKampanye />
      <TombolDukung />
    </div>
  )
}

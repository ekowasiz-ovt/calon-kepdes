import { useLayoutEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Animasi muncul saat elemen ber-atribut `data-reveal` masuk viewport.
 *
 * Konten hanya disembunyikan setelah hook ini menambahkan kelas `reveal-ready`,
 * sehingga pengguna tanpa JavaScript atau dengan preferensi reduced-motion
 * selalu melihat konten langsung. Animasi berjalan sekali per elemen.
 *
 * Elemen di-query ulang setiap kali rute berubah, karena halaman baru
 * menambah `[data-reveal]` baru yang belum terdaftar di observer.
 */
export function useRevealOnScroll(ref: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const container = ref.current
    if (!container) return
    if (typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    container.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      elements.forEach((element) => element.classList.remove('is-visible'))
      container.classList.remove('reveal-ready')
    }
  }, [ref, pathname])
}


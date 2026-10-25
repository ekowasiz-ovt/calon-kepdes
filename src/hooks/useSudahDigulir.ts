import { useEffect, useRef, useState } from 'react'

/**
 * True setelah halaman digulir melewati sentinel di paling atas.
 *
 * Memakai IntersectionObserver, bukan listener scroll, supaya tidak ada
 * pekerjaan per-frame saat pengguna menggulir. Kalau IntersectionObserver
 * tidak tersedia, nilai tetap false dan header tampil tanpa bayangan.
 */
export function useSudahDigulir() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [sudah, setSudah] = useState(false)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setSudah(!entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { sentinelRef, sudah }
}

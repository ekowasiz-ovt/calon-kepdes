import type { ReactNode } from 'react'
import clsx from 'clsx'

type LabelStatusProps = {
  children: ReactNode
  block?: boolean
  netral?: boolean
}

/**
 * Label status untuk menandai konten yang belum final atau belum aktif.
 * Dipakai di halaman layanan, transparansi, dan aspirasi.
 */
export function LabelStatus({ children, block, netral }: LabelStatusProps) {
  return (
    <p className={clsx('label-status', block && 'label-status--block', netral && 'label-status--netral')}>
      {children}
    </p>
  )
}

export const labelBelumAktif = 'Contoh tampilan layanan yang dijanjikan. Belum aktif.'

export const labelSimulasi =
  'Ini simulasi layanan yang dijanjikan. Layanan sungguhan aktif setelah calon terpilih dan dilantik.'

export const labelAspirasiKampanye =
  'Ini aspirasi untuk kampanye, bukan kanal pengaduan resmi desa.'

export const labelMateriKampanye =
  'Materi kampanye Calon Kepala Desa Karanganyar. Data bertanda [ISI] atau CONTOH belum final.'

import { MapPin, PushPin, type Icon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { badgeStatus } from '../lib/constants'
import { fotoUrl } from '../lib/storage'
import { tanggalID } from '../lib/format'
import { useAspirasiDetail } from '../hooks/useAspirasiDetail'
import type { AspirasiStatus } from '../types/db'

type TimelineEntry = {
  label: string
  status: string
  active: boolean
}

const statusOrder: AspirasiStatus[] = [
  'Diterima',
  'Diverifikasi',
  'Diprioritaskan',
  'Dalam Perencanaan',
  'Dikerjakan',
  'Selesai',
]

const statusIconMap: Record<string, Icon> = {
  Diterima: PushPin,
  Diverifikasi: PushPin,
  Diprioritaskan: PushPin,
  'Dalam Perencanaan': PushPin,
  Dikerjakan: PushPin,
  Selesai: PushPin,
}

export function AspirasiDetailPage() {
  const { kode } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useAspirasiDetail(kode)
  const [activeIndex] = useState(0)

  const photoUrls = data?.foto.map((image) => fotoUrl(image.storage_path)) ?? []

  const timeline = useMemo<TimelineEntry[]>(() => {
    if (!data) {
      return []
    }

    const logSet = new Set((data.statusLog ?? []).map((entry) => entry.tahap))

    return statusOrder.map((label) => ({
      label,
      status: label,
      active: logSet.has(label),
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="aspirasi-detail-page kampanye__shell">
        <div className="aspirasi-detail__loading">Memuat aspirasi...</div>
      </div>
    )
  }

  if (isError || !data || !data.aspirasi) {
    return (
      <div className="aspirasi-detail-page kampanye__shell">
        <div className="aspirasi-detail__empty">
          <h2>Aspirasi tidak ditemukan</h2>
        </div>
      </div>
    )
  }

  const { aspirasi, statusLog } = data
  const statusBadge = badgeStatus(aspirasi.status)

  return (
    <div className="aspirasi-detail-page kampanye__shell">

      <div className="aspirasi-detail">
        <header className="aspirasi-detail__header">
          <span className="aspirasi-detail__code">{aspirasi.kode}</span>
          <span className={`ui-badge ui-badge--${statusBadge.tone}`}>{statusBadge.label}</span>
        </header>

        <h2 className="aspirasi-detail__title">{aspirasi.judul}</h2>

        <div className="aspirasi-detail__meta">
          <span>{aspirasi.kategori}</span>
          <span>{aspirasi.sub_kategori || aspirasi.jenis || 'Umum'}</span>
          <span>{aspirasi.dusun || 'Lokasi umum'}</span>
          <span>{tanggalID(aspirasi.created_at)}</span>
        </div>

        {photoUrls.length > 0 && (
          <div className="aspirasi-detail__gallery" aria-label="Foto aspirasi">
            <div className="aspirasi-detail__gallery-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {photoUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="aspirasi-detail__gallery-slide">
                  <img src={url} alt={`Foto aspirasi ${index + 1}`} />
                </div>
              ))}
            </div>
            <span className="aspirasi-detail__gallery-count">{activeIndex + 1}/{photoUrls.length}</span>
          </div>
        )}

        <section className="aspirasi-detail__section">
          <h3>Status Penanganan</h3>
          <div className="status-timeline">
            {timeline.map((entry, index) => {
              const isComplete = entry.active
              const isCurrent = index === timeline.findIndex((item) => item.active) || (!timeline.some((item) => item.active) && index === 0)
              const Icon = statusIconMap[entry.label] ?? PushPin

              return (
                <div key={entry.label} className={`status-step ${isComplete ? 'status-step--complete' : 'status-step--pending'} ${isCurrent ? 'status-step--current' : ''}`}>
                  <div className="status-step__icon-wrapper">
                    <div className="status-step__icon">
                      <Icon size={14} aria-hidden="true" />
                    </div>
                    {index < timeline.length - 1 && <span className="status-step__line" aria-hidden="true" />}
                  </div>
                  <div className="status-step__content">
                    <strong>{entry.label}</strong>
                    <span>
                      {statusLog.find((log) => log.tahap === entry.label)?.tanggal
                        ? tanggalID(statusLog.find((log) => log.tahap === entry.label)?.tanggal ?? '')
                        : isComplete ? 'Terkini' : 'Belum ada'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <button type="button" className="detail-map-button" onClick={() => navigate(`/peta?fokus=${aspirasi.kode}`)}>
          <MapPin size={16} aria-hidden="true" />
          Lihat di Peta
        </button>
      </div>
    </div>
  )
}

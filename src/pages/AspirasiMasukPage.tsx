import { CalendarBlank, MapPin } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LabelStatus, labelAspirasiKampanye } from '../components/ui/LabelStatus'
import { Skeleton } from '../components/ui/Skeleton'
import { useAspirasiTerbaru } from '../hooks/useAspirasiTerbaru'
import { badgeStatus } from '../lib/constants'
import { tanggalID } from '../lib/format'

/**
 * Daftar aspirasi publik yang sudah masuk.
 * Setiap baris membuka halaman detail berisi status penanganan.
 */
export function AspirasiMasukPage() {
  const { data = [], isLoading, isError, error, refetch } = useAspirasiTerbaru(100)

  return (
    <div className="kampanye__shell aspirasi-masuk">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Aspirasi Warga</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Aspirasi Masuk</h1>
        <p className="kampanye-lead">
          Daftar aspirasi yang dikirim warga. Pilih salah satu untuk melihat detail dan status
          penanganannya.
        </p>
      </div>

      <LabelStatus block netral>
        {labelAspirasiKampanye}
      </LabelStatus>

      {isLoading ? (
        <div aria-busy="true">
          <span className="visually-hidden" role="status">
            Memuat aspirasi...
          </span>
          <div className="aspirasi-masuk__list" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <div className="aspirasi-masuk__item" key={item}>
                <Skeleton width={128} height={24} />
                <Skeleton width="76%" height={18} />
                <Skeleton width="52%" height={13} />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="aspirasi-masuk__state">
          <ErrorState
            title="Gagal memuat aspirasi"
            description={error instanceof Error ? error.message : 'Daftar aspirasi belum dapat dimuat.'}
            onRetry={() => void refetch()}
          />
        </div>
      ) : data.length === 0 ? (
        <div className="aspirasi-masuk__state">
          <EmptyState
            title="Belum ada aspirasi"
            description="Aspirasi yang dikirim warga akan tampil di sini."
            action={
              <Link className="kampanye-btn kampanye-btn--outline" to="/aspirasi">
                Tulis aspirasi
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="aspirasi-masuk__list">
          {data.map((item) => {
            const status = badgeStatus(item.status)

            return (
              <li key={item.id}>
                <Link className="aspirasi-masuk__item" to={`/aspirasi/${item.kode}`}>
                  <div className="aspirasi-masuk__head">
                    <span className="aspirasi-detail__code">{item.kode}</span>
                    <span className={`ui-badge ui-badge--${status.tone}`}>{status.label}</span>
                  </div>

                  <strong className="aspirasi-masuk__title">{item.judul}</strong>

                  <div className="aspirasi-masuk__meta">
                    <span>{item.kategori}</span>
                    <span>
                      <MapPin size={14} aria-hidden="true" />
                      {item.dusun || 'Lokasi umum'}
                    </span>
                    <span>
                      <CalendarBlank size={14} aria-hidden="true" />
                      {tanggalID(item.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

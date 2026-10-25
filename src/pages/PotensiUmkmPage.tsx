import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  ChatCircle,
  Cow,
  Grains,
  Leaf,
  MagnifyingGlass,
  MapPin,
  PawPrint,
  Plant,
  Storefront,
  Users,
} from '@phosphor-icons/react'
import { usePotensi } from '../hooks/usePotensi'
import { useUmkm } from '../hooks/useUmkm'
import { fotoUrl } from '../lib/storage'
import { useToast } from '../components/ui/Toast'
import type { Json, PotensiRow, UmkmRow } from '../types/db'

type Tab = 'Pertanian' | 'Peternakan' | 'UMKM' | 'Pemuda'
type PotensiCategory = Tab

const tabs: Tab[] = ['Pertanian', 'Peternakan', 'UMKM', 'Pemuda']

const categoryVisuals: Record<PotensiCategory, { Icon: typeof Leaf; background: string; color: string }> = {
  Pertanian: { Icon: Grains, background: '#eaf0ec', color: '#0b3d2e' },
  Peternakan: { Icon: PawPrint, background: '#f6eddd', color: '#8a6218' },
  UMKM: { Icon: Storefront, background: '#eaf0ec', color: '#14664a' },
  Pemuda: { Icon: Users, background: '#ecebe7', color: '#55655c' },
}

const umkmTones: Record<UmkmRow['kategori'], { color: string; background: string }> = {
  Makanan: { color: '#8a6218', background: '#f6eddd' },
  Kerajinan: { color: '#14664a', background: '#eaf0ec' },
  Fashion: { color: '#55655c', background: '#ecebe7' },
}

const umkmKategori: Array<'Semua' | UmkmRow['kategori']> = ['Semua', 'Makanan', 'Kerajinan', 'Fashion']

function metricRows(value: Json): { label: string; value: string }[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return []
    const label = entry.label
    const metricValue = entry.value
    if (typeof label !== 'string' || (typeof metricValue !== 'string' && typeof metricValue !== 'number')) return []
    return [{ label, value: String(metricValue) }]
  })
}

function PotensiCard({ item, onDetail }: { item: PotensiRow; onDetail: () => void }) {
  const visual = categoryVisuals[item.kategori]
  const Icon = visual?.Icon ?? Plant
  const [imageFailed, setImageFailed] = useState(false)
  const image = fotoUrl(item.foto_path)
  const metrics = metricRows(item.metrik)

  return (
    <article className="potensi-card">
      <div className="potensi-card__photo" style={{ background: visual?.background ?? '#eaf0ec' }}>
        {image && !imageFailed ? (
          <img src={image} alt={item.judul} onError={() => setImageFailed(true)} />
        ) : (
          <div className="potensi-card__photo-fallback" aria-hidden="true">
            <Icon size={46} color={visual?.color ?? '#14664a'} />
          </div>
        )}
        <span className="potensi-card__category" style={{ color: visual?.color, background: visual?.background }}>
          <Icon size={15} aria-hidden="true" />
          {item.kategori}
        </span>
      </div>

      <div className="potensi-card__body">
        <h2>{item.judul}</h2>
        {item.komoditas_utama && (
          <div className="potensi-card__commodity">
            <span>Komoditas utama</span>
            <strong>{item.komoditas_utama}</strong>
          </div>
        )}
        {metrics.length > 0 && (
          <dl className="potensi-metrics">
            {metrics.map((metric) => (
              <div className="potensi-metrics__item" key={`${metric.label}-${metric.value}`}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <button type="button" className="potensi-card__detail" onClick={onDetail}>
          Lihat Detail <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

function UmkmCard({ item }: { item: UmkmRow & { dusun: string | null } }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = fotoUrl(item.foto_path)
  const tone = umkmTones[item.kategori]
  const whatsappNumber = item.whatsapp?.replace(/\D/g, '')

  return (
    <article className="umkm-card">
      <div className="umkm-card__photo" style={{ background: tone.background }}>
        {image && !imageFailed ? (
          <img src={image} alt={item.nama} onError={() => setImageFailed(true)} />
        ) : (
          <Storefront size={25} color={tone.color} aria-hidden="true" />
        )}
      </div>
      <div className="umkm-card__info">
        <div className="umkm-card__heading">
          <h2>{item.nama}</h2>
          <span className="umkm-card__badge" style={{ color: tone.color, background: tone.background }}>
            {item.kategori}
          </span>
        </div>
        <p className="umkm-card__product"><strong>Produk:</strong> {item.produk}</p>
        <p className="umkm-card__location">
          <MapPin size={14} aria-hidden="true" />
          {item.dusun ?? 'Belum dikonfirmasi'}
        </p>
      </div>
      {whatsappNumber ? (
        <a
          className="umkm-card__whatsapp"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Hubungi ${item.nama} melalui WhatsApp`}
        >
          <ChatCircle size={20} aria-hidden="true" />
        </a>
      ) : null}
    </article>
  )
}

/**
 * Potensi desa dan direktori UMKM dalam satu halaman bertab.
 * Tab UMKM menampilkan direktori usaha warga.
 */
export function PotensiUmkmPage() {
  const [tab, setTab] = useState<Tab>('Pertanian')
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState<'Semua' | UmkmRow['kategori']>('Semua')
  const { data: potensi = [], isLoading, isError, error } = usePotensi()
  const {
    data: umkm = [],
    isLoading: isLoadingUmkm,
    isError: isErrorUmkm,
    error: errorUmkm,
  } = useUmkm()
  const { showToast } = useToast()

  const potensiTampil = potensi.filter((item) => item.kategori === tab)

  const umkmTampil = useMemo(() => {
    const kata = search.trim().toLocaleLowerCase('id-ID')
    return umkm.filter((item) => {
      const cocokKategori = kategori === 'Semua' || item.kategori === kategori
      const target = `${item.nama} ${item.kategori} ${item.produk}`.toLocaleLowerCase('id-ID')
      return cocokKategori && (!kata || target.includes(kata))
    })
  }, [kategori, search, umkm])

  return (
    <div className="kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Potensi Lokal</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Potensi &amp; UMKM Desa</h1>
        <p className="kampanye-lead">
          Gambaran potensi pertanian, peternakan, kepemudaan, serta daftar usaha warga Karanganyar.
        </p>
      </div>

        <div className="potensi-tabs" role="tablist" aria-label="Kategori potensi dan UMKM" style={{ marginTop: 24 }}>
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? 'potensi-tabs__item potensi-tabs__item--active' : 'potensi-tabs__item'}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section style={{ padding: '20px 0 64px' }} aria-live="polite">
          {tab === 'UMKM' ? (
            <>
              <div className="umkm-search">
                <MagnifyingGlass size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama usaha atau kategori..."
                  aria-label="Cari nama usaha, kategori, atau produk"
                />
              </div>

              <div className="umkm-filters" role="group" aria-label="Filter kategori UMKM">
                {umkmKategori.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={kategori === item ? 'umkm-filter umkm-filter--active' : 'umkm-filter'}
                    aria-pressed={kategori === item}
                    onClick={() => setKategori(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {isLoadingUmkm ? (
                <p className="umkm-state">Memuat direktori UMKM...</p>
              ) : isErrorUmkm ? (
                <p className="umkm-state umkm-state--error">
                  {errorUmkm instanceof Error ? errorUmkm.message : 'Direktori UMKM belum dapat dimuat.'}
                </p>
              ) : umkmTampil.length ? (
                <div className="umkm-list">
                  {umkmTampil.map((item) => (
                    <UmkmCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="umkm-empty">
                  <span className="umkm-empty__icon"><MagnifyingGlass size={22} aria-hidden="true" /></span>
                  <h2>{search ? 'Usaha tidak ditemukan' : 'Belum ada UMKM di kategori ini'}</h2>
                  <p>{search ? 'Coba kata kunci atau kategori lainnya.' : 'Daftar usaha aktif akan muncul di sini.'}</p>
                </div>
              )}
            </>
          ) : isLoading ? (
            <p className="potensi-state">Memuat potensi desa...</p>
          ) : isError ? (
            <p className="potensi-state potensi-state--error">
              {error instanceof Error ? error.message : 'Data potensi belum dapat dimuat.'}
            </p>
          ) : potensiTampil.length ? (
            <div className="potensi-list">
              {potensiTampil.map((item) => (
                <PotensiCard key={item.id} item={item} onDetail={() => showToast('Detail potensi segera hadir')} />
              ))}
            </div>
          ) : (
            <div className="potensi-empty">
              <span className="potensi-empty__icon"><Cow size={22} aria-hidden="true" /></span>
              <h2>Belum ada data {tab.toLowerCase()}</h2>
              <p>Informasi potensi desa untuk kategori ini akan ditampilkan di sini.</p>
            </div>
          )}
      </section>
    </div>
  )
}

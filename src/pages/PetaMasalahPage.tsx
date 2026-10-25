import { useEffect, useMemo, useState } from 'react'
import { ChartBar, MapPin } from '@phosphor-icons/react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { BatasDesa } from '../components/map/BatasDesa'
import { useBatasDesa } from '../hooks/useBatasDesa'
import { useDesaProfil } from '../hooks/useDesaProfil'
import { useDusun } from '../hooks/useDusun'
import { useMasalah } from '../hooks/useMasalah'
import { usePetaPin } from '../hooks/usePetaPin'
import { gayaKategori, indeksKategori } from '../lib/constants'
import { tanggalID } from '../lib/format'
import { haversine } from '../lib/geo'
import type { BatasDesaData } from '../hooks/useBatasDesa'
import type { AspirasiPublikRow, DusunRow, MasalahDusunRow, MasalahKategoriRow } from '../types/db'

type Tab = 'peta' | 'kategori' | 'wilayah'
type ProblemRowData = MasalahKategoriRow | MasalahDusunRow

const AMBANG_PERKIRAAN_KM = 0.03
const PIN_KOSONG: AspirasiPublikRow[] = []
const DUSUN_KOSONG: DusunRow[] = []

function kategoriPin(pin: AspirasiPublikRow): string {
  return pin.kategori.trim() || 'Lainnya'
}

function pinPerkiraan(pin: AspirasiPublikRow, dusun: DusunRow[]): boolean {
  if (pin.lat === null || pin.lng === null || !pin.dusun || !pin.lokasi_teks) {
    return false
  }

  if (pin.lokasi_teks.trim().toLowerCase() !== pin.dusun.trim().toLowerCase()) {
    return false
  }

  const pusatDusun = dusun.find(
    (item) => item.nama.trim().toLowerCase() === pin.dusun?.trim().toLowerCase(),
  )

  if (!pusatDusun || pusatDusun.lat === null || pusatDusun.lng === null) {
    return false
  }

  return haversine(
    Number(pin.lat),
    Number(pin.lng),
    Number(pusatDusun.lat),
    Number(pusatDusun.lng),
  ) <= AMBANG_PERKIRAAN_KM
}

function ikonPin(pin: AspirasiPublikRow, perkiraan: boolean) {
  const { color } = gayaKategori(kategoriPin(pin))

  return L.divIcon({
    className: 'peta-pin-wrap',
    html: `<span class="peta-pin${perkiraan ? ' peta-pin--perkiraan' : ''}" style="--pin-color:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function SinkronPeta({
  pusat,
  pins,
  focusCode,
  batas,
}: {
  pusat: { lat: number; lng: number }
  pins: AspirasiPublikRow[]
  focusCode?: string | null
  batas: BatasDesaData | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!focusCode && !batas) {
      map.setView([pusat.lat, pusat.lng], 12)
    }
  }, [map, pusat.lat, pusat.lng, focusCode, batas])

  useEffect(() => {
    if (!focusCode) return
    const cocok = pins.find((pin) => pin.kode === focusCode)
    if (cocok) {
      map.setView([Number(cocok.lat), Number(cocok.lng)], 15)
    }
  }, [focusCode, map, pins])

  useEffect(() => {
    if (!batas || focusCode) return
    const bounds = L.geoJSON(batas).getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 })
    }
  }, [batas, map, focusCode])

  return null
}

function LegendaBatas({ batas }: { batas: BatasDesaData }) {
  const properti = batas.features[0]?.properties
  const label = properti?.nama || 'Desa Karanganyar'
  const sumber = properti?.sumber
  const perkiraan = properti?.status === 'perkiraan' || !sumber

  return (
    <aside className="peta-legend" aria-label="Legenda peta">
      <span className="peta-legend__line" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        <small>{perkiraan ? 'Batas perkiraan' : `Sumber: ${sumber}`}</small>
      </span>
    </aside>
  )
}

function PetaMap({
  pins,
  dusun,
  selectedFilter,
  focusCode,
  pusat,
}: {
  pins: AspirasiPublikRow[]
  dusun: DusunRow[]
  selectedFilter: string
  focusCode?: string | null
  pusat: { lat: number; lng: number }
}) {
  const { data: batas = null } = useBatasDesa()

  const validPins = useMemo(
    () =>
      pins.filter((pin) => {
        if (pin.lat === null || pin.lng === null) return false
        if (selectedFilter !== 'all' && kategoriPin(pin) !== selectedFilter) return false
        return true
      }),
    [pins, selectedFilter],
  )

  return (
    <>
      <MapContainer center={[pusat.lat, pusat.lng]} zoom={12} scrollWheelZoom={false} zoomControl style={{ height: '100%', width: '100%' }}>
        <SinkronPeta pusat={pusat} pins={validPins} focusCode={focusCode} batas={batas} />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
          keepBuffer={1}
          updateWhenIdle
        />
        <BatasDesa data={batas} />
        {validPins.map((pin) => {
          const kategori = kategoriPin(pin)
          const gaya = gayaKategori(kategori)
          const perkiraan = pinPerkiraan(pin, dusun)
          const lokasi = pin.lokasi_teks || pin.dusun || 'Lokasi tidak dicatat'

          return (
            <Marker
              key={pin.id}
              position={[Number(pin.lat), Number(pin.lng)]}
              icon={ikonPin(pin, perkiraan)}
              title={perkiraan ? `${pin.judul} (perkiraan lokasi)` : pin.judul}
            >
              <Popup>
                <div className="map-popup">
                  <span className="map-popup__kategori" style={{ color: gaya.color, background: gaya.background }}>
                    {kategori}
                  </span>
                  <strong>{pin.judul}</strong>
                  <p className="map-popup__meta">{lokasi} · {tanggalID(pin.created_at)}</p>
                  {perkiraan && <span className="map-popup__perkiraan">Perkiraan lokasi (pusat dusun)</span>}
                  <a href={`/aspirasi/${pin.kode}`}>Lihat Detail</a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      {batas && <LegendaBatas batas={batas} />}
    </>
  )
}

function ProblemRow({ item, index, wilayah }: { item: ProblemRowData; index: number; wilayah: boolean }) {
  const style = wilayah ? { color: '#14664a', background: '#eaf0ec' } : gayaKategori(item.nama, index)
  const percent = Math.max(0, Math.min(100, Number(item.persen ?? 0)))

  return (
    <article className="masalah-row">
      <span className="masalah-row__icon" style={{ color: style.color, background: style.background }}>
        <MapPin size={19} aria-hidden="true" />
      </span>
      <div className="masalah-row__main">
        <div className="masalah-row__heading">
          <div>
            <h2>{item.nama}</h2>
            <p>{item.jumlah.toLocaleString('id-ID')} laporan</p>
          </div>
          <strong>{percent}%</strong>
        </div>
        <div
          className="masalah-row__track"
          role="progressbar"
          aria-label={`Persentase ${item.nama}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <span style={{ width: `${percent}%`, background: style.color }} />
        </div>
      </div>
    </article>
  )
}

/**
 * Peta dan masalah desa dalam satu halaman bertab.
 * Tab Peta menampilkan sebaran laporan; tab Kategori dan Wilayah menampilkan ringkasan.
 */
export function PetaMasalahPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>('peta')
  const [filter, setFilter] = useState('all')
  const pinQuery = usePetaPin()
  const { data: pins = PIN_KOSONG } = pinQuery
  const { data: dusun = DUSUN_KOSONG } = useDusun()
  const { data: masalah, isLoading, isError, error } = useMasalah()
  const { data: desa } = useDesaProfil()
  const pusat = { lat: Number(desa?.lat ?? -7.2161), lng: Number(desa?.lng ?? 111.0197) }
  const wilayah = tab === 'wilayah'
  const rows: ProblemRowData[] = wilayah ? masalah?.dusun ?? [] : masalah?.kategori ?? []
  const focusCode = searchParams.get('fokus')

  const kategoriTersedia = useMemo(() => {
    const unik = new Set(pins.map(kategoriPin).filter(Boolean))
    return Array.from(unik).sort(
      (a, b) => indeksKategori(a) - indeksKategori(b) || a.localeCompare(b, 'id'),
    )
  }, [pins])

  const pinTampil = filter === 'all'
    ? pins
    : pins.filter((pin) => kategoriPin(pin) === filter)

  useEffect(() => {
    if (focusCode) setTab('peta')
  }, [focusCode])

  useEffect(() => {
    if (filter !== 'all' && !kategoriTersedia.includes(filter)) {
      setFilter('all')
    }
  }, [filter, kategoriTersedia])

  return (
    <div className="kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Data Warga</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Peta &amp; Masalah Desa</h1>
        <p className="kampanye-lead">
          Sebaran laporan warga beserta ringkasan masalah terbanyak per kategori dan per wilayah.
        </p>
      </div>

      <div className="masalah-tabs" role="tablist" aria-label="Tampilan masalah desa" style={{ marginTop: 24 }}>
        {([['peta', 'Peta'], ['kategori', 'Kategori'], ['wilayah', 'Wilayah']] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={tab === value ? 'masalah-tabs__item masalah-tabs__item--active' : 'masalah-tabs__item'}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <section style={{ padding: '20px 0 64px' }} aria-live="polite">
        {tab === 'peta' ? (
          <>
            <div className="peta-toolbar">
              <button
                type="button"
                className={`peta-filter${filter === 'all' ? ' peta-filter--active' : ''}`}
                onClick={() => setFilter('all')}
                aria-pressed={filter === 'all'}
              >
                Semua
              </button>
              {kategoriTersedia.map((kategori) => (
                <button
                  key={kategori}
                  type="button"
                  className={`peta-filter${filter === kategori ? ' peta-filter--active' : ''}`}
                  onClick={() => setFilter(kategori)}
                  aria-pressed={filter === kategori}
                >
                  <span
                    className="peta-filter__dot"
                    style={{ background: gayaKategori(kategori).color }}
                    aria-hidden="true"
                  />
                  {kategori}
                </button>
              ))}
            </div>
            <div className="peta-map-area">
              <PetaMap
                pins={pins}
                dusun={dusun}
                selectedFilter={filter}
                focusCode={focusCode}
                pusat={pusat}
              />
              {pinQuery.isLoading && (
                <div className="peta-status" role="status">Memuat titik laporan...</div>
              )}
              {pinQuery.isError && (
                <div className="peta-status peta-status--error" role="alert">
                  <span>
                    {pinQuery.error instanceof Error
                      ? pinQuery.error.message
                      : 'Titik laporan belum dapat dimuat.'}
                  </span>
                  <button type="button" onClick={() => void pinQuery.refetch()}>Coba lagi</button>
                </div>
              )}
              {!pinQuery.isLoading && !pinQuery.isError && pins.length === 0 && (
                <div className="peta-status">Belum ada laporan dengan titik lokasi.</div>
              )}
              {!pinQuery.isLoading && !pinQuery.isError && pins.length > 0 && pinTampil.length === 0 && (
                <div className="peta-status">Tidak ada laporan untuk kategori ini.</div>
              )}
            </div>
          </>
        ) : isLoading ? (
          <p className="masalah-state">Memuat data masalah...</p>
        ) : isError ? (
          <p className="masalah-state masalah-state--error">
            {error instanceof Error ? error.message : 'Data masalah belum dapat dimuat.'}
          </p>
        ) : rows.length === 0 ? (
          <p className="masalah-state">Belum ada data untuk ditampilkan.</p>
        ) : (
          <>
            <div className="masalah-list">
              {rows.map((item, index) => (
                <ProblemRow key={item.id} item={item} index={index} wilayah={wilayah} />
              ))}
            </div>
            <aside className="masalah-note">
              <span className="masalah-note__icon"><ChartBar size={20} aria-hidden="true" /></span>
              <p>Data ini membantu kami memahami kebutuhan masyarakat dalam perencanaan pembangunan.</p>
            </aside>
          </>
        )}
      </section>
    </div>
  )
}

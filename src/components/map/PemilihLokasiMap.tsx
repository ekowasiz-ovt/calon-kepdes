import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { BatasDesa } from './BatasDesa'
import { useBatasDesa } from '../../hooks/useBatasDesa'
import { dusunTerdekat } from '../../lib/geo'
import type { DusunRow } from '../../types/db'

type Titik = { lat: number; lng: number }

export type HasilPemilihanLokasi = {
  lat: number
  lng: number
  dusun_id?: number
  lokasi_teks: string
}

type PemilihLokasiMapProps = {
  pusat: { lat: number; lng: number }
  dusun: DusunRow[]
  awal?: { lat?: number; lng?: number; dusun_id?: number }
  onBatal: () => void
  onPilih: (hasil: HasilPemilihanLokasi) => void
}

const ikonTitik = L.divIcon({
  className: 'pemilih-lokasi__marker',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function PenangkapKlik({ onKlik }: { onKlik: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onKlik(event.latlng.lat, event.latlng.lng)
    },
  })

  return null
}

function SinkronPusat({ pusat, adaTitik }: { pusat: { lat: number; lng: number }; adaTitik: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (!adaTitik) {
      map.setView([pusat.lat, pusat.lng], 13)
    }
  }, [adaTitik, map, pusat.lat, pusat.lng])

  return null
}

/**
 * Pemilih titik laporan di atas peta.
 * Mengetuk peta menaruh titik presisi; pilihan pusat dusun tetap tersedia sebagai fallback.
 */
export function PemilihLokasiMap({ pusat, dusun, awal, onBatal, onPilih }: PemilihLokasiMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const { data: batas = null } = useBatasDesa()
  const dusunBerkoordinat = useMemo(
    () => dusun.filter((item) => item.lat !== null && item.lng !== null),
    [dusun],
  )
  const [titik, setTitik] = useState<Titik | null>(() => (
    typeof awal?.lat === 'number' && typeof awal?.lng === 'number'
      ? { lat: awal.lat, lng: awal.lng }
      : null
  ))
  const [dusunId, setDusunId] = useState(() => (
    awal?.dusun_id
    ?? dusunBerkoordinat[0]?.id
    ?? 0
  ))

  useEffect(() => {
    if (dusunId === 0 && dusunBerkoordinat.length > 0) {
      setDusunId(dusunBerkoordinat[0].id)
    }
  }, [dusunBerkoordinat, dusunId])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onBatal()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onBatal])

  const terdekat = useMemo(() => (
    titik ? dusunTerdekat(titik.lat, titik.lng, dusun) : null
  ), [dusun, titik])
  const labelTitik = terdekat?.nama ?? 'Lokasi di peta'

  const pilihTitik = (lat: number, lng: number) => {
    setTitik({ lat, lng })
    const dekat = dusunTerdekat(lat, lng, dusun)
    if (dekat?.id) setDusunId(dekat.id)
  }

  const pakaiPusatDusun = () => {
    const item = dusunBerkoordinat.find((entry) => entry.id === dusunId)
    if (!item || item.lat === null || item.lng === null) return

    const lat = Number(item.lat)
    const lng = Number(item.lng)
    setTitik({ lat, lng })
    mapRef.current?.flyTo([lat, lng], 15, { duration: 0.45 })
  }

  const konfirmasi = () => {
    if (!titik) return

    onPilih({
      lat: titik.lat,
      lng: titik.lng,
      dusun_id: terdekat?.id,
      lokasi_teks: terdekat?.nama ?? 'Lokasi di peta',
    })
  }

  return (
    <div
      className="location-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pilih-lokasi-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onBatal()
      }}
    >
      <div className="location-sheet__panel location-sheet__panel--peta">
        <div className="location-sheet__header">
          <div>
            <h3 id="pilih-lokasi-title">Pilih Lokasi di Peta</h3>
            <p className="location-sheet__hint">Ketuk peta atau geser pin ke titik masalah.</p>
          </div>
          <button type="button" className="location-sheet__close" onClick={onBatal} autoFocus>
            <X size={16} aria-hidden="true" />
            <span className="visually-hidden">Tutup</span>
          </button>
        </div>

        <div className="pemilih-lokasi__map">
          <MapContainer
            ref={mapRef}
            center={[titik?.lat ?? pusat.lat, titik?.lng ?? pusat.lng]}
            zoom={titik ? 15 : 13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <SinkronPusat pusat={pusat} adaTitik={Boolean(titik)} />
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
              keepBuffer={1}
              updateWhenIdle
            />
            <BatasDesa data={batas} />
            <PenangkapKlik onKlik={pilihTitik} />
            {titik && (
              <Marker
                position={[titik.lat, titik.lng]}
                icon={ikonTitik}
                draggable
                eventHandlers={{
                  dragend(event) {
                    const posisi = event.target.getLatLng()
                    pilihTitik(posisi.lat, posisi.lng)
                  },
                }}
              />
            )}
          </MapContainer>
        </div>

        <div className="pemilih-lokasi__controls">
          <label className="pemilih-lokasi__dusun">
            <span>Pusat dusun</span>
            <select
              value={dusunId}
              onChange={(event) => setDusunId(Number(event.target.value))}
              disabled={dusunBerkoordinat.length === 0}
            >
              {dusunBerkoordinat.length === 0 ? (
                <option value={0}>Data pusat dusun belum tersedia</option>
              ) : (
                dusunBerkoordinat.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))
              )}
            </select>
          </label>
          <button
            type="button"
            className="pemilih-lokasi__pusat"
            onClick={pakaiPusatDusun}
            disabled={dusunBerkoordinat.length === 0}
          >
            Gunakan pusat dusun
          </button>
        </div>

        <p className="pemilih-lokasi__status" aria-live="polite">
          {titik ? (
            <>
              Titik dipilih: <strong>{labelTitik}</strong>
              <small>Dusun terdekat dipakai untuk pencatatan wilayah.</small>
            </>
          ) : (
            'Belum ada titik. Ketuk peta untuk menentukan lokasi masalah.'
          )}
        </p>

        <div className="pemilih-lokasi__actions">
          <button type="button" className="pemilih-lokasi__batal" onClick={onBatal}>Batal</button>
          <button
            type="button"
            className="pemilih-lokasi__konfirmasi"
            onClick={konfirmasi}
            disabled={!titik}
          >
            Gunakan Titik Ini
          </button>
        </div>
      </div>
    </div>
  )
}

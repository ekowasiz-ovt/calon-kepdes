import { useMemo } from 'react'
import L, { type PathOptions } from 'leaflet'
import { GeoJSON, Marker, Tooltip } from 'react-leaflet'
import type { BatasDesaData } from '../../hooks/useBatasDesa'

type BatasDesaProps = {
  data: BatasDesaData | null
}

const ikonLabel = L.divIcon({
  className: 'batas-desa__anchor',
  html: '',
  iconSize: [0, 0],
})

const gayaCasing: PathOptions = {
  color: '#ffffff',
  weight: 8,
  opacity: 0.85,
  fill: false,
}

const gayaGaris: PathOptions = {
  color: '#c08a2e',
  weight: 4,
  opacity: 1,
  fillColor: '#c08a2e',
  fillOpacity: 0.04,
  lineJoin: 'round',
}

/**
 * Outline batas desa di atas citra satelit.
 * Casing putih membuat garis tetap terbaca di area gelap maupun terang.
 */
export function BatasDesa({ data }: BatasDesaProps) {
  const pusat = useMemo(() => {
    if (!data) return null
    const bounds = L.geoJSON(data).getBounds()
    return bounds.isValid() ? bounds.getCenter() : null
  }, [data])

  if (!data) {
    return null
  }

  const properti = data.features[0]?.properties
  const label = properti?.nama || 'Desa Karanganyar'
  const sumber = properti?.sumber
  const perkiraan = properti?.status === 'perkiraan' || !sumber

  return (
    <>
      <GeoJSON key="batas-casing" data={data} style={gayaCasing} interactive={false} />
      <GeoJSON key="batas-garis" data={data} style={gayaGaris} interactive={false} />
      {pusat && (
        <Marker position={pusat} icon={ikonLabel} interactive={false} keyboard={false}>
          <Tooltip permanent direction="center" className="batas-desa__label" opacity={1}>
            {perkiraan ? `${label} · perkiraan` : label}
          </Tooltip>
        </Marker>
      )}
    </>
  )
}

export type GeoDusunLike = {
  id?: number
  nama: string
  lat: number | null
  lng: number | null
}

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function dusunTerdekat(
  lat: number,
  lng: number,
  dusun: GeoDusunLike[],
): GeoDusunLike | null {
  const validDusun = dusun.filter((item) => item.lat !== null && item.lng !== null)

  if (!validDusun.length) {
    return null
  }

  return validDusun.reduce((closest, current) => {
    const currentDistance = haversine(
      lat,
      lng,
      Number(current.lat),
      Number(current.lng),
    )

    if (!closest) {
      return current
    }

    const closestDistance = haversine(
      lat,
      lng,
      Number(closest.lat),
      Number(closest.lng),
    )

    return currentDistance < closestDistance ? current : closest
  }, null as GeoDusunLike | null)
}

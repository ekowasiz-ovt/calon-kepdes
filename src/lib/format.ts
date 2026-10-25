export function angka(value: number | string | null | undefined): string {
  if (value === null || typeof value === 'undefined' || value === '') {
    return '0'
  }

  const parsed = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(parsed)) {
    return '0'
  }

  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(parsed)
}

export function rupiah(value: number | string | null | undefined): string {
  const parsed = typeof value === 'string' ? Number(value) : value

  if (parsed === null || typeof parsed === 'undefined' || Number.isNaN(Number(parsed))) {
    return 'Rp 0'
  }

  return `Rp ${angka(Number(parsed))}`
}

export function tanggalID(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return '-'
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, MapPin, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { PemilihLokasiMap, type HasilPemilihanLokasi } from '../components/map/PemilihLokasiMap'
import { LabelStatus, labelAspirasiKampanye } from '../components/ui/LabelStatus'
import { useToast } from '../components/ui/Toast'
import { useDesaProfil } from '../hooks/useDesaProfil'
import { useDusun } from '../hooks/useDusun'
import { useKategori } from '../hooks/useKategori'
import { useKirimAspirasi } from '../hooks/useKirimAspirasi'

const MAX_FILES = 2

const aspirasiSchema = z.object({
  nama: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100, 'Nama terlalu panjang.'),
  hp: z.string().trim().regex(/^08\d{8,12}$/, 'Nomor HP harus mulai dengan 08 dan format benar.'),
  kategori_id: z.number().min(1, 'Pilih kategori.'),
  lokasi_teks: z.string().optional(),
  judul: z.string().trim().min(5, 'Judul minimal 5 karakter').max(150, 'Judul terlalu panjang.'),
  deskripsi: z.string().trim().min(10, 'Deskripsi minimal 10 karakter').max(2000, 'Deskripsi terlalu panjang.'),
  honeypot: z.string().optional(),
  dusun_id: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
}).superRefine((values, ctx) => {
  if (typeof values.lat !== 'number' || typeof values.lng !== 'number') {
    ctx.addIssue({ code: 'custom', path: ['lat'], message: 'Pilih lokasi di peta.' })
  }
})

type AspirasiFormValues = z.infer<typeof aspirasiSchema>

export function AspirasiBaruPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: kategori = [] } = useKategori()
  const { data: dusun = [] } = useDusun()
  const { data: desa } = useDesaProfil()
  const mutation = useKirimAspirasi()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)

  const form = useForm<AspirasiFormValues>({
    resolver: zodResolver(aspirasiSchema),
    defaultValues: {
      nama: '',
      hp: '',
      kategori_id: 0,
      lokasi_teks: '',
      judul: '',
      deskripsi: '',
      honeypot: '',
      dusun_id: undefined,
      lat: undefined,
      lng: undefined,
    },
  })

  const lokasiTeks = form.watch('lokasi_teks')
  const lat = form.watch('lat')
  const lng = form.watch('lng')
  const dusunId = form.watch('dusun_id')
  const selectedLocationText = lokasiTeks || 'Pilih lokasi di peta'
  const pusat = { lat: Number(desa?.lat ?? -7.2161), lng: Number(desa?.lng ?? 111.0197) }

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []).slice(0, MAX_FILES)
    setSelectedFiles(nextFiles)
    event.target.value = ''
  }

  const onSubmit = async (values: AspirasiFormValues) => {
    if (values.honeypot) {
      return
    }

    try {
      const kode = await mutation.mutateAsync({
        nama: values.nama,
        hp: values.hp,
        kategori_id: values.kategori_id,
        judul: values.judul,
        deskripsi: values.deskripsi,
        lokasi_teks: values.lokasi_teks || null,
        dusun_id: values.dusun_id ?? null,
        lat: values.lat ?? null,
        lng: values.lng ?? null,
        foto: selectedFiles,
      })

      showToast('Aspirasi terkirim', 'success')
      navigate(`/aspirasi/${kode}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengirim aspirasi.'
      showToast(message, 'error')
    }
  }

  const handleLocationConfirm = (hasil: HasilPemilihanLokasi) => {
    // Validasi dijalankan setelah semua nilai terisi agar error lokasi tidak tertinggal
    // saat lat sudah diisi tetapi lng belum.
    form.setValue('dusun_id', hasil.dusun_id, { shouldDirty: true })
    form.setValue('lokasi_teks', hasil.lokasi_teks, { shouldDirty: true })
    form.setValue('lat', hasil.lat, { shouldDirty: true })
    form.setValue('lng', hasil.lng, { shouldDirty: true })
    setIsLocationPickerOpen(false)
    void form.trigger(['lat', 'lng', 'lokasi_teks'])
  }

  return (
    <div className="aspirasi-page kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Aspirasi Warga</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Sampaikan Aspirasi</h1>
        <p className="kampanye-lead">
          Kanal aspirasi warga Karanganyar. Sampaikan usulan atau keluhan Anda lewat formulir berikut.
        </p>
      </div>

      <form className="aspirasi-form" onSubmit={form.handleSubmit(onSubmit)}>
        <p className="aspirasi-intro">Bersama kita bisa membangun Karanganyar lebih baik.</p>
        <LabelStatus block>{labelAspirasiKampanye}</LabelStatus>

        <div className="field-group">
          <label className="field">
            <span>Nama</span>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              className={form.formState.errors.nama ? 'field__input field__input--error' : 'field__input'}
              {...form.register('nama')}
            />
            {form.formState.errors.nama && <small>{form.formState.errors.nama.message}</small>}
          </label>

          <label className="field">
            <span>Nomor HP</span>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              className={form.formState.errors.hp ? 'field__input field__input--error' : 'field__input'}
              {...form.register('hp')}
            />
            {form.formState.errors.hp && <small>{form.formState.errors.hp.message}</small>}
          </label>

          <label className="field">
            <span>Kategori</span>
            <select
              className={form.formState.errors.kategori_id ? 'field__input field__input--error' : 'field__input'}
              {...form.register('kategori_id', { valueAsNumber: true })}
              defaultValue={0}
            >
              <option value={0}>Pilih kategori</option>
              {kategori.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
            {form.formState.errors.kategori_id && <small>{String(form.formState.errors.kategori_id.message)}</small>}
          </label>

          <label className="field">
            <span>Lokasi</span>
            <div className="field__location">
              <input
                type="text"
                readOnly
                placeholder="Pilih lokasi di peta"
                value={selectedLocationText}
                aria-invalid={Boolean(form.formState.errors.lat)}
                className={form.formState.errors.lat ? 'field__input field__input--error' : 'field__input'}
              />
              <button type="button" className="field__pin" aria-label="Pilih lokasi" onClick={() => setIsLocationPickerOpen(true)}>
                <MapPin size={18} aria-hidden="true" />
              </button>
            </div>
            {form.formState.errors.lat && <small>{form.formState.errors.lat.message}</small>}
          </label>

          <label className="field">
            <span>Judul</span>
            <input
              type="text"
              placeholder="Contoh: Jalan rusak di Dusun Karanganyar"
              className={form.formState.errors.judul ? 'field__input field__input--error' : 'field__input'}
              {...form.register('judul')}
            />
            {form.formState.errors.judul && <small>{form.formState.errors.judul.message}</small>}
          </label>

          <label className="field">
            <span>Deskripsi</span>
            <textarea
              rows={4}
              placeholder="Jelaskan masalah dengan detail..."
              className={form.formState.errors.deskripsi ? 'field__input field__input--error' : 'field__input'}
              {...form.register('deskripsi')}
            />
            {form.formState.errors.deskripsi && <small>{form.formState.errors.deskripsi.message}</small>}
          </label>

          <div className="field">
            <span>Upload Foto (opsional)</span>
            <label className="upload-box" htmlFor="aspirasi-photo">
              <Camera size={20} aria-hidden="true" />
              <span>Pilih Foto</span>
              <small>Maks. 5MB (JPG/PNG)</small>
            </label>
            <input id="aspirasi-photo" type="file" accept="image/jpeg,image/png" multiple onChange={handleFiles} hidden />
            {selectedFiles.length > 0 && (
              <div className="upload-preview" aria-live="polite">
                {selectedFiles.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="upload-preview__item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => setSelectedFiles((current) => current.filter((item) => item.name !== file.name || item.size !== file.size))}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="text" className="honeypot" tabIndex={-1} autoComplete="off" {...form.register('honeypot')} />
        </div>

        <button type="submit" className="submit-button" disabled={mutation.isPending}>
          {mutation.isPending ? 'Mengirim...' : 'Kirim Aspirasi'}
        </button>
      </form>

      {isLocationPickerOpen && (
        <PemilihLokasiMap
          pusat={pusat}
          dusun={dusun}
          awal={{ lat, lng, dusun_id: dusunId }}
          onBatal={() => setIsLocationPickerOpen(false)}
          onPilih={handleLocationConfirm}
        />
      )}
    </div>
  )
}

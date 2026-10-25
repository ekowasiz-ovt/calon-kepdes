import { zodResolver } from '@hookform/resolvers/zod'
import { HandHeart } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LabelStatus } from '../components/ui/LabelStatus'
import { useToast } from '../components/ui/Toast'
import { useDukunganRingkas } from '../hooks/useDukunganRingkas'
import { useDusun } from '../hooks/useDusun'
import { useKirimDukungan } from '../hooks/useKirimDukungan'

const dukunganSchema = z.object({
  nama: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80, 'Nama terlalu panjang.'),
  dusun_id: z.number().min(1, 'Pilih dusun.'),
})

type DukunganFormValues = z.infer<typeof dukunganSchema>

const labelDukungan =
  'Ini materi kampanye, bukan pendataan resmi pemilih. Nama dan dusun hanya dilihat tim kampanye, tidak ditampilkan ke publik.'

/**
 * Halaman dukungan warga. Hanya meminta nama dan dusun.
 * Publik tidak pernah melihat daftar nama; hanya total dukungan.
 */
export function DukunganPage() {
  const { showToast } = useToast()
  const { data: dusun = [], isLoading, isError, error, refetch } = useDusun()
  const { data: ringkas } = useDukunganRingkas()
  const mutation = useKirimDukungan()

  const form = useForm<DukunganFormValues>({
    resolver: zodResolver(dukunganSchema),
    defaultValues: { nama: '', dusun_id: 0 },
  })

  const onSubmit = async (values: DukunganFormValues) => {
    try {
      await mutation.mutateAsync({ nama: values.nama, dusunId: values.dusun_id })
      form.reset()
      showToast('Terima kasih atas dukungannya', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim dukungan.'
      showToast(message, 'error')
    }
  }

  if (mutation.isSuccess) {
    return (
      <div className="kampanye__shell">
        <div className="kampanye-page-head">
          <span className="kampanye-eyebrow">Dukung Calon</span>
          <div className="kampanye-rule" aria-hidden="true" />
          <h1>Terima Kasih</h1>
          <p className="kampanye-lead">Dukungan Anda sudah tercatat.</p>
        </div>

        <div className="kampanye-panel" style={{ margin: '28px 0 64px' }} aria-live="polite">
          <span className="kampanye-eyebrow">Total Dukungan</span>
          <p className="kampanye-panel__total">
            {ringkas?.total ?? 0}
          </p>
          <p className="kampanye-lead kampanye-lead--sm">
            warga tercatat mendukung, tersebar di {ringkas?.jumlah_dusun ?? 0} dusun.
          </p>
          <LabelStatus block>{labelDukungan}</LabelStatus>
        </div>
      </div>
    )
  }

  return (
    <div className="kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Dukung Calon</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Dukung Calon Kepala Desa</h1>
        <p className="kampanye-lead">
          Isi nama dan dusun untuk menyatakan dukungan. Hanya itu yang diminta.
        </p>
      </div>

      <div className="kampanye-panel" style={{ margin: '28px 0 64px' }}>
        {ringkas && (
          <p className="kampanye-lead kampanye-lead--sm">
            Saat ini <strong>{ringkas.total}</strong> warga tercatat mendukung.
          </p>
        )}

        {isLoading ? (
          <p className="kampanye-state">Memuat daftar dusun...</p>
        ) : isError ? (
          <div>
            <p className="kampanye-state kampanye-state--error">
              {error instanceof Error ? error.message : 'Daftar dusun belum dapat dimuat.'}
            </p>
            <button
              type="button"
              className="kampanye-btn kampanye-btn--outline"
              onClick={() => void refetch()}
            >
              Coba lagi
            </button>
          </div>
        ) : dusun.length === 0 ? (
          <p className="kampanye-state">Belum ada data dusun.</p>
        ) : (
          <form className="kampanye-form" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="kampanye-field">
              <span>Nama</span>
              <input
                type="text"
                placeholder="Nama lengkap"
                {...form.register('nama')}
              />
              {form.formState.errors.nama && <small>{form.formState.errors.nama.message}</small>}
            </label>

            <label className="kampanye-field">
              <span>Dusun</span>
              <select
                defaultValue={0}
                {...form.register('dusun_id', { valueAsNumber: true })}
              >
                <option value={0}>Pilih dusun</option>
                {dusun.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
              {form.formState.errors.dusun_id && (
                <small>{form.formState.errors.dusun_id.message}</small>
              )}
            </label>

            <button
              type="submit"
              className="kampanye-btn kampanye-btn--primary kampanye-btn--block"
              disabled={mutation.isPending}
            >
              <HandHeart size={17} aria-hidden="true" />
              {mutation.isPending ? 'Mengirim...' : 'Kirim Dukungan'}
            </button>

            <LabelStatus>{labelDukungan}</LabelStatus>
          </form>
        )}
      </div>
    </div>
  )
}

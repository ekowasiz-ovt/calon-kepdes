import { Buildings, MapPin, Storefront, Users } from '@phosphor-icons/react'
import { useDesaProfil } from '../../hooks/useDesaProfil'
import { useDusun } from '../../hooks/useDusun'
import { angka } from '../../lib/format'

/**
 * Blok angka desa dari data nyata Supabase (desa_profil dan dusun).
 * Nilai tampil apa adanya; tidak ada angka yang dikarang.
 */
export function AngkaDesa() {
  const { data: desa } = useDesaProfil()
  const { data: dusun = [] } = useDusun()

  const item = [
    { label: 'Penduduk', nilai: angka(desa?.jumlah_penduduk ?? 0), satuan: 'jiwa', Icon: Users },
    { label: 'Dusun', nilai: angka(dusun.length), satuan: 'wilayah', Icon: MapPin },
    {
      label: 'RT / RW',
      nilai: `${angka(desa?.jumlah_rt ?? 0)} / ${angka(desa?.jumlah_rw ?? 0)}`,
      satuan: 'rukun tetangga',
      Icon: Buildings,
    },
    { label: 'UMKM', nilai: angka(desa?.jumlah_umkm ?? 0), satuan: 'usaha aktif', Icon: Storefront },
  ]

  return (
    <section className="kampanye-section kampanye-angka" aria-label="Data desa Karanganyar">
      <div className="kampanye__shell">
        <div className="kampanye-angka__grid">
          {item.map(({ label, nilai, satuan, Icon }) => (
            <article className="kampanye-angka__item" key={label} data-reveal>
              <span className="kampanye-angka__ikon" aria-hidden="true">
                <Icon size={19} weight="duotone" />
              </span>
              <strong>{nilai}</strong>
              <span className="kampanye-angka__label">{label}</span>
              <small>{satuan}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import {
  Grains,
  Heart,
  Leaf,
  ShieldCheck,
  Signpost,
  type Icon,
} from '@phosphor-icons/react'
import { program } from '../../config'

const ikonProgram: Record<string, Icon> = {
  aman: ShieldCheck,
  makmur: Grains,
  terbuka: Signpost,
  cerdas: Heart,
  hijau: Leaf,
}

/**
 * Lima program unggulan sebagai kartu grid dengan ikon, aksi ringkas,
 * dan tautan ke nomor misi yang didukung.
 */
export function ProgramUnggulan() {
  return (
    <section className="kampanye-section" id="program">
      <div className="kampanye__shell">
        <span className="kampanye-eyebrow">Program Unggulan</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h2 data-reveal>Lima Program Prioritas</h2>
        <p className="kampanye-lead" data-reveal>
          Program ini diturunkan langsung dari enam misi. Fokus pada kebutuhan warga,
          pemerataan manfaat, dan pelayanan yang bisa diawasi bersama.
        </p>

        <div className="kampanye-program-grid">
          {program.map((item, index) => {
            const Icon = ikonProgram[item.kode] ?? Signpost
            return (
              <article
                className="kampanye-kartu-program"
                key={item.kode}
                data-reveal
                data-delay={index > 0 ? String(Math.min(index, 3)) : undefined}
              >
                <span className="kampanye-kartu-program__ikon" aria-hidden="true">
                  <Icon size={23} weight="duotone" />
                </span>
                <h3>{item.judul}</h3>
                <p className="kampanye-kartu-program__ringkas">{item.ringkas}</p>
                <ul>
                  {item.aksi.map((aksi) => (
                    <li key={aksi}>{aksi}</li>
                  ))}
                </ul>
                <p className="kampanye-kartu-program__misi">
                  Mendukung Misi {item.misiTerkait.join(', ')} —{' '}
                  <a href="#visi-misi">lihat misi</a>
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

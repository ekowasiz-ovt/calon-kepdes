import { misi, visi, type GrupMisi } from '../../config'

const grup: GrupMisi[] = ['Tata Kelola dan Pelayanan', 'Pembangunan dan Pemberdayaan']

/**
 * Visi pada panel lembut, lalu enam misi dikelompokkan menjadi dua grup
 * sesuai kelompok kerja: tata kelola/pelayanan dan pembangunan/pemberdayaan.
 */
export function VisiMisi() {
  return (
    <section className="kampanye-section" id="visi-misi">
      <div className="kampanye__shell">
        <span className="kampanye-eyebrow">Visi &amp; Misi</span>
        <div className="kampanye-rule" aria-hidden="true" />

        <article className="kampanye-visi" data-reveal>
          <h2>Visi</h2>
          <p>{visi}</p>
        </article>

        <h2 className="kampanye-judul">Misi</h2>

        {grup.map((nama) => (
          <div className="kampanye-grup" key={nama}>
            <h3 className="kampanye-grup__judul">{nama}</h3>
            <div className="kampanye-misi-grid">
              {misi
                .filter((item) => item.grup === nama)
                .map((item, index) => (
                  <article
                    className="kampanye-kartu-misi"
                    key={item.nomor}
                    data-reveal
                    data-delay={index > 0 ? String(Math.min(index, 3)) : undefined}
                  >
                    <span className="kampanye-kartu-misi__nomor" aria-hidden="true">
                      {item.nomor}
                    </span>
                    <h3>{item.judul}</h3>
                    <p>{item.deskripsi}</p>
                    <p className="kampanye-indikator">Indikator: {item.indikator}</p>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

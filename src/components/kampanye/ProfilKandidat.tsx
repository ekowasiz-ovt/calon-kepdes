import { kandidat, prinsip } from '../../config'

/**
 * Profil calon: foto, fakta diri, kutipan DRAFT, dan prinsip kerja.
 * Nilai bertanda [ISI: ...] diisi tim kampanye lewat config.ts.
 */
export function ProfilKandidat() {
  return (
    <section className="kampanye-section" id="profil">
      <div className="kampanye__shell">
        <span className="kampanye-eyebrow">Profil Calon</span>
        <div className="kampanye-rule" aria-hidden="true" />

        <div className="kampanye-profil">
          <div className="kampanye-profil__media" data-reveal>
            <div
              className="kampanye-foto"
              style={kandidat.fotoCalon ? { backgroundImage: `url(${kandidat.fotoCalon})` } : undefined}
            >
              {!kandidat.fotoCalon && 'FOTO CALON'}
            </div>
            <blockquote className="kampanye-kutipan">
              <p>“{kandidat.kutipan}”</p>
              <small>Draf kutipan — dapat diedit</small>
            </blockquote>
          </div>

          <div className="kampanye-profil__isi" data-reveal data-delay="1">
            <h2>{kandidat.nama}</h2>
            <p className="kampanye-lead">
              Kandidat calon Kepala Desa Karanganyar, Kecamatan Geyer, Kabupaten Grobogan.
              Bukan petahana. Informasi di bawah diisi hanya dari data yang terverifikasi.
            </p>

            <dl className="kampanye-fakta">
              <div>
                <dt>Usia</dt>
                <dd>{kandidat.usia}</dd>
              </div>
              <div>
                <dt>Pendidikan</dt>
                <dd>{kandidat.pendidikan}</dd>
              </div>
              <div>
                <dt>Pengalaman</dt>
                <dd>{kandidat.pengalaman}</dd>
              </div>
              <div>
                <dt>Motivasi Maju</dt>
                <dd>{kandidat.motivasi}</dd>
              </div>
            </dl>

            <div className="kampanye-prinsip">
              {prinsip.map((item) => (
                <article className="kampanye-prinsip__item" key={item.judul}>
                  <strong>{item.judul}</strong>
                  <p>{item.keterangan}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

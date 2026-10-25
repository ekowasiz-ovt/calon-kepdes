import { ArrowRight, Megaphone } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { kampanye, kandidat, slogan, ringkasVisi } from '../../config'

/**
 * Hero landing kampanye: potret calon di kanan, slogan bertumpuk di kiri,
 * nomor urut sebagai elemen grafis besar.
 * Foto latar dan foto calon diisi lewat config.ts (isi.fotoLatar / isi.fotoCalon).
 */
export function HeroKampanye() {
  return (
    <section className="kampanye-hero" id="hero">
      <div className="kampanye__shell">
        <div className="kampanye-hero__inner">
          <div className="kampanye-hero__copy" data-reveal>
            <span className="kampanye-hero__label">{kampanye.labelWilayah}</span>

            <h1>
              {slogan.map((baris) => (
                <span key={baris}>{baris}</span>
              ))}
            </h1>

            <p className="kampanye-hero__visi">{ringkasVisi}</p>

            <div className="kampanye-hero__actions">
              <a className="kampanye-btn kampanye-btn--primary" href="#profil">
                Kenali Calon <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link className="kampanye-btn kampanye-btn--outline" to="/aspirasi">
                <Megaphone size={17} aria-hidden="true" /> Sampaikan Aspirasi
              </Link>
            </div>
          </div>

          <div className="kampanye-hero__figure" data-reveal data-delay="1">
            {kandidat.fotoLatar && (
              <div
                className="kampanye-hero__latar"
                style={{ backgroundImage: `url(${kandidat.fotoLatar})` }}
                aria-hidden="true"
              />
            )}

            <div
              className="kampanye-hero__portrait"
              style={kandidat.fotoCalon ? { backgroundImage: `url(${kandidat.fotoCalon})` } : undefined}
            >
              {!kandidat.fotoCalon && <span>FOTO CALON</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

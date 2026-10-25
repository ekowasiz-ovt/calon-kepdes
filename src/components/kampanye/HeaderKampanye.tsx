import { Link, useLocation } from 'react-router-dom'
import { kampanye, kandidat, navKampanye } from '../../config'

type HeaderKampanyeProps = {
  /** True saat halaman sudah digulir; memunculkan bayangan pemisah. */
  menempel?: boolean
}

/**
 * Header kampanye: brand, navbar desktop, tombol CTA.
 * Anchor diarahkan ke landing kalau halaman aktif bukan landing.
 * Di mobile navigasi memakai bilah bawah (BottomNavKampanye).
 */
export function HeaderKampanye({ menempel }: HeaderKampanyeProps) {
  const { pathname } = useLocation()
  const diLanding = pathname === '/'
  const inisialKandidat = kandidat.nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0])
    .join('')

  const tujuan = (href: string) => (href.startsWith('#') && !diLanding ? `/${href}` : href)

  return (
    <header className={`kampanye-header${menempel ? ' kampanye-header--menempel' : ''}`}>
      <div className="kampanye__shell kampanye-header__inner">
        <Link className="kampanye-brand" to="/">
          <span className="kampanye-brand__mark">
            {kandidat.fotoCalon ? (
              <img src={kandidat.fotoCalon} alt="" />
            ) : (
              <span aria-hidden="true">{inisialKandidat}</span>
            )}
          </span>
          <span className="kampanye-brand__text">
            <strong>{kandidat.nama}</strong>
            <small>
              Calon Kepala Desa · Kec. {kampanye.kecamatan} · Kab. {kampanye.kabupaten}
            </small>
          </span>
        </Link>

        <nav className="kampanye-nav" aria-label="Navigasi kampanye">
          {navKampanye.map((item) =>
            item.href.startsWith('/') ? (
              <Link
                key={item.label}
                className="kampanye-nav__link"
                to={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} className="kampanye-nav__link" href={tujuan(item.href)}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <Link className="kampanye-header__cta" to="/aspirasi">
          Sampaikan Aspirasi
        </Link>
      </div>
    </header>
  )
}

import {
  CaretRight,
  ChartBar,
  ChatCircle,
  Compass,
  FileText,
  ListChecks,
  ListMagnifyingGlass,
  User,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { kampanye, kandidat, navMenuLain, taglineMenu } from '../config'
import { LabelStatus, labelMateriKampanye } from '../components/ui/LabelStatus'

const ikonMenu: Record<(typeof navMenuLain)[number]['ikon'], Icon> = {
  aspirasi: ListMagnifyingGlass,
  layanan: FileText,
  transparansi: ChartBar,
  tanya: ChatCircle,
  profil: User,
  visi: Compass,
  program: ListChecks,
}

/**
 * Halaman menu bergaya aplikasi: profil calon, tautan halaman, dan banner tagline.
 */
export function MenuPage() {
  return (
    <div className="kampanye-menu">
      <div className="kampanye-menu__inner">
        <header className="kampanye-menu__profile" data-reveal>
          <span className="kampanye-menu__avatar" aria-hidden="true">
            {kandidat.fotoCalon ? (
              <img src={kandidat.fotoCalon} alt="" />
            ) : (
              <User size={26} />
            )}
          </span>

          <div className="kampanye-menu__identity">
            <h1>{kandidat.nama}</h1>
            <p>Calon Kepala Desa {kampanye.desa}</p>
          </div>
        </header>

        <div className="kampanye-menu__list" data-reveal data-delay="1">
          {navMenuLain.map(({ label, to, ikon }) => {
            const Ikon = ikonMenu[ikon]

            return (
              <Link key={to} to={to} className="kampanye-menu__row">
                <Ikon size={20} className="kampanye-menu__row-icon" aria-hidden="true" />
                <span className="kampanye-menu__row-label">{label}</span>
                <CaretRight size={16} className="kampanye-menu__chevron" aria-hidden="true" />
              </Link>
            )
          })}
        </div>

        <div className="kampanye-menu__banner" data-reveal data-delay="2">
          <p className="kampanye-menu__tagline">{taglineMenu}</p>
        </div>

        <LabelStatus netral block>
          {labelMateriKampanye}
        </LabelStatus>
      </div>
    </div>
  )
}

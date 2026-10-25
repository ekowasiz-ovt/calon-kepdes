import { House, List, MapTrifold, MegaphoneSimple, Storefront } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { navBawah } from '../../config'

const ikon: Record<string, typeof House> = {
  beranda: House,
  peta: MapTrifold,
  aspirasi: MegaphoneSimple,
  potensi: Storefront,
}

/**
 * Bilah navigasi tetap di bawah layar untuk mobile.
 *
 * Menggantikan tombol hamburger supaya tujuan utama terlihat langsung oleh
 * pengguna awam. Tujuan lain dibuka lewat halaman menu.
 * Disembunyikan di desktop lewat CSS.
 */
export function BottomNavKampanye() {
  return (
    <nav className="kampanye-bottomnav" aria-label="Navigasi utama">
      {navBawah.map((item) => {
        const Ikon = ikon[item.ikon] ?? House
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `kampanye-bottomnav__item${isActive ? ' kampanye-bottomnav__item--aktif' : ''}${
                'utama' in item && item.utama ? ' kampanye-bottomnav__item--utama' : ''
              }`
            }
          >
            <Ikon size={22} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}

      <NavLink
        to="/menu"
        end
        className={({ isActive }) =>
          `kampanye-bottomnav__item${isActive ? ' kampanye-bottomnav__item--aktif' : ''}`
        }
      >
        <List size={22} aria-hidden="true" />
        <span>Menu</span>
      </NavLink>
    </nav>
  )
}

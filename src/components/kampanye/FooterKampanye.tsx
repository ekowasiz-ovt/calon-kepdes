import { ChatCircle, EnvelopeSimple, MapPin } from '@phosphor-icons/react'
import { kampanye, kontak } from '../../config'

const tautanHalaman = [
  { label: 'Dukung Calon', to: '/dukungan' },
  { label: 'Transparansi Anggaran', to: '/transparansi' },
  { label: 'Layanan Administrasi', to: '/layanan' },
  { label: 'Aspirasi Warga', to: '/aspirasi' },
  { label: 'Peta & Masalah Desa', to: '/peta' },
  { label: 'Potensi & UMKM', to: '/potensi' },
  { label: 'Tanya Karanganyar', to: '/tanya' },
]

// Nomor placeholder belum angka; jangan bikin tautan wa.me yang rusak.
const nomorWa = kontak.whatsapp.replace(/\D/g, '')

/**
 * Footer kampanye: kontak, posko, tautan halaman, placeholder sosial media,
 * dan disclaimer status materi kampanye.
 */
export function FooterKampanye() {
  return (
    <footer className="kampanye-footer">
      <div className="kampanye__shell">
        <div className="kampanye-footer__grid">
          <div data-reveal>
            <h2>Posko Kampanye</h2>
            <ul className="kampanye-footer__list">
              <li>
                <MapPin size={15} aria-hidden="true" /> {kontak.posko}
              </li>
            </ul>
          </div>

          <div data-reveal data-delay="1">
            <h2>Hubungi</h2>
            <ul className="kampanye-footer__list">
              <li>
                {nomorWa.length >= 8 ? (
                  <a href={`https://wa.me/${nomorWa}`} target="_blank" rel="noopener noreferrer">
                    <ChatCircle size={15} aria-hidden="true" /> WhatsApp: {kontak.whatsapp}
                  </a>
                ) : (
                  <span>
                    <ChatCircle size={15} aria-hidden="true" /> WhatsApp: {kontak.whatsapp}
                  </span>
                )}
              </li>
              <li>
                <EnvelopeSimple size={15} aria-hidden="true" /> Email: {kontak.email}
              </li>
            </ul>
          </div>

          <div data-reveal data-delay="2">
            <h2>Halaman</h2>
            <ul className="kampanye-footer__list">
              {tautanHalaman.map((item) => (
                <li key={item.to}>
                  <a href={item.to}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal data-delay="3">
            <h2>Media Sosial</h2>
            <p className="kampanye-footer__note">
              Tautan kanal resmi kampanye akan dilengkapi.
            </p>
            <div className="kampanye-footer__sosmed">
              {['Instagram', 'Facebook', 'TikTok', 'YouTube'].map((nama) => (
                <span key={nama}>{nama}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="kampanye-footer__disclaimer" data-reveal>
          Materi kampanye Calon Kepala Desa {kampanye.desa}. Data bertanda [ISI] atau CONTOH belum final.
          Situs ini belum merupakan layanan resmi Pemerintah Desa {kampanye.desa}.
          <br />© {new Date().getFullYear()} Kampanye Calon Kepala Desa {kampanye.desa}, Kec. {kampanye.kecamatan}, Kab.{' '}
          {kampanye.kabupaten}.
        </p>
      </div>
    </footer>
  )
}

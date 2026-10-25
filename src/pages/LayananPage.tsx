import { useState } from 'react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { isi } from '../config'
import { LabelStatus, labelBelumAktif, labelSimulasi } from '../components/ui/LabelStatus'

const barisLayanan = [
  { kolom: 'Jenis layanan', nilai: isi.daftarLayanan },
  { kolom: 'Persyaratan', nilai: isi.persyaratan },
  { kolom: 'Biaya resmi', nilai: isi.biayaResmi },
  { kolom: 'Estimasi proses', nilai: isi.estimasiWaktu },
]

/**
 * Halaman layanan administrasi desa sebagai contoh tampilan yang dijanjikan.
 * Belum aktif. Tidak meminta NIK atau data pribadi sensitif.
 */
export function LayananPage() {
  const [terkirim, setTerkirim] = useState(false)
  const [layanan, setLayanan] = useState('')
  const [nama, setNama] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  return (
    <div className="kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Layanan Desa</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Layanan Administrasi</h1>
        <p className="kampanye-lead">
          Gambaran standar pelayanan yang akan diterapkan. Isi persyaratan, biaya resmi, dan estimasi
          waktu masih berupa placeholder sampai dokumen resmi tersedia.
        </p>
      </div>

      <div className="kampanye-layanan-grid" style={{ padding: '34px 0 64px' }}>
        <div>
          <h2 style={{ marginBottom: 14 }}>Standar Pelayanan</h2>
          <table className="kampanye-layanan-tabel">
            <tbody>
              {barisLayanan.map((baris) => (
                <tr key={baris.kolom}>
                  <th scope="row" style={{ width: '34%' }}>{baris.kolom}</th>
                  <td>{baris.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <LabelStatus block>{labelBelumAktif}</LabelStatus>
        </div>

        <div className="kampanye-panel">
          <h2>Contoh Permohonan</h2>
          <p className="kampanye-lead kampanye-lead--sm">
            Formulir simulasi. Tidak meminta NIK atau data pribadi sensitif.
          </p>

          {terkirim ? (
            <p className="kampanye-state kampanye-state--ok" role="status" style={{ marginTop: 20 }}>
              {labelSimulasi}
            </p>
          ) : (
            <form
              className="kampanye-form"
              onSubmit={(event) => {
                event.preventDefault()
                setTerkirim(true)
              }}
            >
              <label className="kampanye-field">
                <span>Jenis layanan</span>
                <select value={layanan} onChange={(event) => setLayanan(event.target.value)} required>
                  <option value="">Pilih layanan</option>
                  <option value="surat-keterangan">Surat keterangan</option>
                  <option value="surat-domisili">Surat keterangan domisili</option>
                  <option value="surat-usaha">Surat keterangan usaha</option>
                </select>
              </label>

              <label className="kampanye-field">
                <span>Nama</span>
                <input
                  type="text"
                  value={nama}
                  onChange={(event) => setNama(event.target.value)}
                  placeholder="Nama lengkap"
                  required
                />
              </label>

              <label className="kampanye-field">
                <span>Nomor WhatsApp</span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </label>

              <button className="kampanye-btn kampanye-btn--primary kampanye-btn--block" type="submit">
                <PaperPlaneTilt size={17} aria-hidden="true" /> Kirim Permohonan
              </button>
              <LabelStatus>{labelSimulasi}</LabelStatus>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

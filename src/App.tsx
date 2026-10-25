import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDesaProfil } from './hooks/useDesaProfil'
import { hasSupabaseConfig } from './lib/supabase'
import { rupiah } from './lib/format'
import { LayoutKampanye } from './components/kampanye/LayoutKampanye'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AspirasiBaruPage } from './pages/AspirasiBaruPage'
import { AspirasiDetailPage } from './pages/AspirasiDetailPage'
import { AspirasiMasukPage } from './pages/AspirasiMasukPage'
import { DukunganPage } from './pages/DukunganPage'
import { LandingPage } from './pages/LandingPage'
import { LayananPage } from './pages/LayananPage'
import { MenuPage } from './pages/MenuPage'
import { PetaMasalahPage } from './pages/PetaMasalahPage'
import { PotensiUmkmPage } from './pages/PotensiUmkmPage'
import { TanyaPage } from './pages/TanyaPage'
import { TransparansiPage } from './pages/TransparansiPage'

export default function App() {
  // Di GitHub Pages situs berada di subfolder, jadi router harus tahu awalan path-nya.
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route path="/__data" element={<SupabaseCheckPage />} />

        {/* Semua halaman kampanye memakai kerangka yang sama: header + konten + footer */}
        <Route element={<LayoutKampanye />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/layanan" element={<LayananPage />} />
          <Route path="/peta" element={<PetaMasalahPage />} />
          <Route path="/potensi" element={<PotensiUmkmPage />} />
          <Route path="/transparansi" element={<TransparansiPage />} />
          <Route path="/tanya" element={<TanyaPage />} />
          <Route path="/aspirasi" element={<AspirasiBaruPage />} />
          <Route path="/aspirasi/masuk" element={<AspirasiMasukPage />} />
          <Route path="/aspirasi/:kode" element={<AspirasiDetailPage />} />
          <Route path="/dukungan" element={<DukunganPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Route>

        {/* Tautan lama yang sudah tidak dipakai */}
        <Route path="/welcome" element={<Navigate to="/" replace />} />
        <Route path="/beranda" element={<Navigate to="/" replace />} />
        <Route path="/aspirasi/baru" element={<Navigate to="/aspirasi" replace />} />
        <Route path="/masalah" element={<Navigate to="/peta" replace />} />
        <Route path="/umkm" element={<Navigate to="/potensi" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function SupabaseCheckPage() {
  const { data, isLoading, isError, error, refetch } = useDesaProfil()

  if (!hasSupabaseConfig) {
    return (
      <main className="app-shell">
        <section className="placeholder" aria-live="polite">
          <p className="eyebrow">Konfigurasi Supabase</p>
          <h1>Env belum aktif</h1>
          <p>
            Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.local
            lalu muat ulang halaman.
          </p>
        </section>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="app-shell">
        <section className="placeholder" aria-live="polite">
          <p className="eyebrow">Memuat data</p>
          <h1>Karanganyar</h1>
          <p>Mengambil profil desa dari Supabase...</p>
        </section>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="app-shell">
        <section className="placeholder" aria-live="polite">
          <p className="eyebrow">Gagal memuat data</p>
          <h1>Terjadi masalah</h1>
          <p>{error instanceof Error ? error.message : 'Tidak dapat memuat data desa.'}</p>
          <button type="button" onClick={() => void refetch()}>
            Coba lagi
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="placeholder" aria-labelledby="app-title">
        <h1 id="app-title">{data?.nama_desa ?? 'Karanganyar'}</h1>
        <p>{data?.wilayah_teks ?? 'Desa Karanganyar'}</p>
        <p style={{ marginTop: 14 }}>
          <strong>Tagline:</strong> {data?.tagline ?? 'Data, Aspirasi, dan Masa Depan Desa'}
        </p>
        <p style={{ marginTop: 14 }}>
          <strong>Rupiah test:</strong> {rupiah(1245000000)}
        </p>
      </section>
    </main>
  )
}
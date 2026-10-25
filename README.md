# Karanganyar Digital

Aplikasi web mobile-first Karanganyar Digital.

## Menjalankan aplikasi

1. Gunakan Node.js 20 atau lebih baru.
2. Jalankan `npm i`.
3. Salin `.env.example` menjadi `.env.local`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari proyek Supabase.
4. Jalankan `npm run dev`.

## Migrasi database

Jalankan berkas SQL di `supabase/migrations/` secara berurutan melalui Supabase Studio > SQL Editor, atau gunakan Supabase CLI dengan `supabase db push`. Setelah itu, muat data contoh dari `supabase/seed.sql` bila dibutuhkan.

## Data batas desa (opsional)

Peta dapat menampilkan outline batas Desa Karanganyar bila tersedia berkas:

```
public/data/batas-desa-karanganyar.geojson
```

Tanpa berkas ini peta tetap berjalan, hanya tanpa outline. Gunakan polygon resmi dari Ina-Geoportal/BIG atau kantor desa. Sertakan properti berikut pada feature:

```json
{
  "nama": "Desa Karanganyar",
  "sumber": "Nama sumber data",
  "lisensi": "Nama lisensi",
  "status": "resmi"
}
```

Isi `status` dengan `"perkiraan"` bila polygon belum resmi. Cantumkan sumber dan lisensi data di atribusi peta.

## Deploy ke GitHub Pages

Situs ini SPA dengan `BrowserRouter`, sedangkan GitHub Pages menyajikan repo di subfolder
(`https://<username>.github.io/<repo>/`). Karena itu `vite.config.ts` membaca `VITE_BASE_PATH`
dan router memakai `import.meta.env.BASE_URL`. Di Vercel dan dev server nilainya tetap `/`.

Langkah sekali jalan:

1. Buat repo kosong `calon-kepdes` (publik) di GitHub, jangan centang README/gitignore.
2. Di repo: **Settings > Secrets and variables > Actions > New repository secret**, tambahkan
   `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (anon key saja, jangan `service_role`).
3. Di repo: **Settings > Pages > Build and deployment > Source** pilih **GitHub Actions**.
4. Push ke branch `main`; workflow `.github/workflows/deploy.yml` membangun dan menerbitkan situs.

Build di CI menyetel `VITE_BASE_PATH=/<nama-repo>/` dan menyalin `dist/index.html` menjadi
`dist/404.html` agar tautan dalam seperti `/peta` tidak 404 saat dibuka langsung.

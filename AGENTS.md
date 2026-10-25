# AGENTS.md

Panduan kerja untuk agent/AI di repositori ini. Baca sebelum mengubah kode.

## Ringkas proyek

Situs kampanye **Calon Kepala Desa Karanganyar, Kec. Geyer, Kab. Grobogan** yang juga memuat fitur layanan warga (aspirasi, peta masalah, transparansi anggaran, potensi/UMKM, tanya desa).

- Pengguna publik, **tanpa login**. Tidak ada panel admin; konten dikelola lewat **Supabase Studio**.
- Ini **materi kampanye**, bukan situs resmi pemerintah desa. Jangan pernah menuliskan seolah-olah kanal ini resmi, dan pertahankan label disclaimer yang sudah ada.
- Stack: Vite 7 + React 19 + TypeScript 5.9, React Router 7, TanStack Query 5, Supabase, Tailwind CSS v4, Leaflet, React Hook Form + Zod, Phosphor Icons.

## Sumber kebenaran

| Dokumen | Peran |
|---|---|
| `src/App.tsx` | **Sumber kebenaran route aktif.** |
| `src/config.ts` | Seluruh teks kampanye yang bisa diedit (visi, misi, program, kontak). |
| `prd-supabase.md` | Spesifikasi awal v2.0. Sebagian sudah usang (mis. daftar route, Lucide). Jangan mengikuti bagian yang bertentangan dengan kode. |
| `visi misi .md` | Brief desain/kampanye. Jangan ubah teks visi-misi tanpa mengacu ke sini. |
| `supabase/migrations/*.sql` | Skema database aktual. |

## Perintah

```bash
npm i                # instal dependensi (Node 20+)
npm run dev          # dev server Vite
npm run typecheck    # tsc --noEmit, wajib lolos
npm run build        # tsc -b && vite build
npm run preview      # pratinjau hasil build
```

Tidak ada lint, formatter, atau test runner. Verifikasi minimal: `npm run typecheck` lalu `npm run build`.

Env lokal (`.env.local`, jangan di-commit):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Hanya anon key di frontend. **Jangan pernah** menaruh `service_role` key di kode klien.

## Struktur

```
src/
  App.tsx              route + MainLayout (MobileFrame + BottomNav)
  config.ts            konten kampanye (placeholder [ISI: ...])
  main.tsx             provider: QueryClient, Toast, CSS Leaflet
  components/
    kampanye/          section landing page (Header, Hero, Profil, VisiMisi, Program, Footer)
    layout/            AppBar, BottomNav, MobileFrame, ScrollToTop
    ui/                Button, Input, Select, Card, Badge, Toast, Skeleton, ErrorState, EmptyState, LabelStatus, dll.
  hooks/               satu file per query/mutation TanStack Query
  lib/                 supabase, storage, format, geo, queryClient, localState, constants
  pages/               satu file per layar
  types/db.ts          tipe Database Supabase (ditulis manual)
supabase/
  migrations/          0001_schema, 0002_views_rpc, 0003_rls_storage
  seed.sql             data contoh
  functions/tanya-karanganyar/index.ts   Edge Function (Deno + Gemini)
```

Route aktif: `/` (landing kampanye), `/layanan`, `/peta`, `/potensi`, `/aspirasi`, `/aspirasi/masuk` (daftar aspirasi publik), `/aspirasi/:kode`, `/transparansi`, `/tanya`, `/menu` (halaman menu berisi tautan halaman dan anchor landing), plus `/__data` (halaman cek koneksi Supabase). `/welcome`, `/beranda`, `/aspirasi/baru` hanya redirect.

## Alur data

- Semua data tampil berasal dari Supabase, **kecuali** teks statis kampanye di `src/config.ts` dan label UI.
- `src/lib/supabase.ts` mengekspor `supabase` yang bisa `null` dan `hasSupabaseConfig`. Setiap hook **wajib** menjaga null:
  ```ts
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  ```
- Pola hook: `useQuery({ queryKey: [...], queryFn, staleTime: 60_000 })`; mutation memakai `useMutation` dan meng-invalidate query terkait.
- Query key memakai array string bahasa Indonesia, mis. `['masalah']`, `['anggaran', tahun]`, `['peta-pin']`.
- Tabel `aspirasi`, `faq`, `chat_log` **tidak** bisa dibaca langsung oleh anon (RLS). Gunakan view `aspirasi_publik` dan RPC:
  - `kirim_aspirasi(...)` → membuat kode `KD-YYYY-#####`, rate limit 5/24 jam per nomor HP, maksimal 2 foto.
  - `tanya_karanganyar(p_pertanyaan)` → pencocokan FAQ sederhana.
- Upload foto: `src/lib/storage.ts` → bucket `aspirasi-foto`, path `uploads/<uuid>.<ext>`, hanya JPG/PNG, maks 5 MB. URL publik dibentuk oleh `fotoUrl()`.
- `types/db.ts` ditulis manual. Setiap perubahan skema wajib disertai update tipe ini.
- Cuaca memakai Open-Meteo dengan fallback ke kolom `desa_profil` bila jaringan gagal. Jangan jadikan kegagalan cuaca sebagai error halaman.

## Konvensi kode

- TypeScript `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`. Gunakan `import type` untuk tipe.
- Import relatif (`../../lib/...`). Alias `@` ada di Vite/tsconfig tetapi **tidak dipakai**; ikuti gaya yang ada.
- Komponen: named export, function component, props bertipe eksplisit. Default export hanya untuk `App`.
- Teks UI, komentar, nama variabel domain, dan pesan error memakai **Bahasa Indonesia** yang natural.
- Setiap halaman/hook data wajib menangani **loading, error, dan kosong**:
  - `Skeleton`, `ErrorState` (dengan tombol "Coba lagi"), `EmptyState`.
  - Jangan biarkan layar kosong saat data gagal dimuat.
- Form memakai React Hook Form + Zod (`zodResolver`), pesan validasi Bahasa Indonesia, feedback lewat `useToast`. Contoh: `src/pages/AspirasiBaruPage.tsx`.
- Aksesibilitas: ikon dekoratif `aria-hidden`, nav `aria-label`, item aktif `aria-current="page"`, jangan menghapus `:focus-visible`.
- Jangan menambah dependensi baru tanpa alasan kuat; ikon memakai `@phosphor-icons/react` (bukan Lucide).

## Routing & layout

- Daftarkan route di `src/App.tsx`.
- Landing kampanye (`/`) tampil penuh; halaman aplikasi dibungkus `MainLayout` → `MobileFrame` (bingkai 390 px di desktop) + `BottomNav`/`DesktopNav`.
- `BottomNav` menyembunyikan navigasi di `/aspirasi` dan `/aspirasi/:kode`. Bila menambah halaman utama baru, perbarui `baseItems`/`desktopItems` di `src/components/layout/BottomNav.tsx`.
- Halaman aplikasi umumnya memakai `AppBar` di bagian atas.

## Styling & design system

- Tailwind v4 tanpa `tailwind.config.*`; token ada di blok `@theme` dalam `src/index.css` dan plugin `@tailwindcss/vite` di `vite.config.ts`.
- Sebagian besar komponen memakai **class CSS kustom (BEM-ish)**, bukan utility Tailwind di JSX. Tambahkan aturan baru di `src/index.css` pada bagian yang relevan, bukan menumpuk utility.
- Palet 60/30/10:
  - Ground/ink: `page #f5f5f3`, `ink-900 #14231b`, `ink-500 #55655c`, `line #e3e4e0`
  - Brand green: `green-900 #0b3d2e` (utama), `green-700`, `green-500`, `green-50`
  - Aksen emas: `accent #c08a2e`
  - Merah (`red-500`) **hanya semantik/error**, bukan dekorasi.
- Ada dua lapisan visual:
  - **Kampanye** (`.kampanye`): latar putih, heading `Big Shoulders Display`, shell maksimal 1180 px, memakai variabel lokal `--k-green`, `--k-ink`, `--k-gold`, `--k-shell`, dst. yang dipetakan ke token `@theme`.
  - **Aplikasi** (dalam `MobileFrame`): heading dan angka besar `Fraunces Variable`, body `Archivo Variable`, dibungkus bingkai 390 px di desktop.
- Mobile-first. Jangan merusak bingkai mobile dan breakpoint desktop yang ada.
- Animasi: smooth scroll, route fade, dan reveal diatur di bagian `GERAK & ANIMASI` pada `src/index.css`. Tandai elemen dengan `data-reveal` (tambah `data-delay="1"`–`"3"` untuk stagger); `useRevealOnScroll` menambahkan kelas `reveal-ready`/`is-visible`. Jangan membuat hidden state yang aktif tanpa JavaScript, dan selalu hormati `prefers-reduced-motion`.
- Hormati `prefers-reduced-motion` (sudah ditangani global; jangan menambah animasi yang mengabaikannya).

## Aturan konten (penting)

- Jangan mengarang fakta kandidat, angka desa, program, atau capaian. Placeholder `[ISI: ...]` di `src/config.ts` diisi oleh tim kampanye, bukan ditebak.
- Jangan menampilkan angka anggaran/realisasi palsu sebagai data nyata. Data contoh hanya lewat `seed.sql`.
- Pertahankan disclaimer dari `src/components/ui/LabelStatus.tsx`:
  - `labelSimulasi`, `labelBelumAktif`, `labelMateriKampanye`, `labelAspirasiKampanye`.
- Aspirasi adalah **kanal kampanye**, bukan pengaduan resmi desa. Jangan mengubah copy yang menyatakan hal ini.
- Jangan menambah halaman/fitur di luar permintaan; jangan mengubah teks visi/misi/program tanpa instruksi eksplisit.
- Teks yang belum pasti ditandai `TODO:`; jangan menebak desain atau data.

## Supabase

- Migrations bersifat **append-only**. Jangan mengedit `0001`–`0003` yang kemungkinan sudah diterapkan; buat `0004_...sql` dan seterusnya.
- Jalankan SQL lewat Supabase Studio > SQL Editor atau `supabase db push` (pengguna yang mengeksekusi).
- RLS wajib aktif untuk tabel baru. Ikuti pola `0003_rls_storage.sql`: baca publik hanya untuk data yang memang publik; data sensitif lewat view/RPC `security definer`.
- `seed.sql` bersifat idempotent tetapi melakukan rekonsiliasi `dusun` (rename sementara ke `__seed_reconcile__`). **Jangan jalankan ke database produksi** tanpa memahami dampaknya.
- Edge Function `tanya-karanganyar` butuh secret server-side `GEMINI_API_KEY` (jangan pernah diekspos ke `VITE_*`). Deploy dengan Supabase CLI; fungsi memakai Gemini `gemini-2.5-flash`.
- Bucket storage: `aspirasi-foto` (publik, upload hanya prefix `uploads/`) dan `konten` (publik).

## Jebakan yang sering terjadi

- `supabase` bisa `null` → jangan memanggil `.from()` tanpa guard.
- `dist/` adalah hasil build dan di-`gitignore`; **jangan diedit manual**. Perubahan harus di `src/`.
- Root berisi `Gemini_Generated_Image_*.jpg` yang tidak direferensikan kode. Jangan hapus aset tanpa bertanya.
- `.env.local` berisi kredensial; jangan pernah membaca/menulisnya ke kode atau commit.
- `prd-supabase.md` menyebut route/layar yang sudah tidak ada. Cek `App.tsx` sebelum mengikuti PRD.
- Deploy target: Vercel dengan rewrite SPA (`vercel.json`). Env `VITE_*` diatur di dashboard Vercel.

## Checklist sebelum selesai

1. `npm run typecheck` lolos (dan `npm run build` bila mengubah build/config).
2. Tidak ada data hardcode baru yang seharusnya dari Supabase.
3. Loading/error/empty state tersedia untuk UI yang mengambil data.
4. Teks Indonesia, disclaimer kampanye tetap ada, tidak ada klaim resmi palsu.
5. `types/db.ts` diperbarui bila skema berubah.
6. Tidak mengedit `dist/`, `.env*` (selain `.env.example`), atau migration lama.

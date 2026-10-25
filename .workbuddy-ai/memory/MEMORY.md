# Memory Proyek — calon-kepdes

## Konvensi tipografi (ditetapkan 25 Okt 2026)

- Semua ukuran font WAJIB memakai token `--text-*` di blok `@theme` `src/index.css`. Dilarang menulis `font-size` angka telanjang (px) atau inline style `fontSize` di TSX.
- Skala: `--text-2xs` 11px (hanya badge peta/non-informatif), `--text-xs` 12px (badge/caption/label/meta), `--text-sm` 13px, `--text-base` 14px (body/tombol/input), `--text-md` 15px, `--text-lg` 16px (lead), `--text-xl` 18px (judul section), `--text-2xl` 20px, `--text-3xl` 24px, `--text-4xl` 30px, `--text-5xl` 40px, `--text-6xl` 44px, `--text-7xl` 54px; fluid: `--text-hero`, `--text-hero-sm`, `--text-stat`, `--text-page-head`, `--text-brand`.
- Aturan: teks informasi warga minimal 12px; hindari nilai sub-pixel (11.5/12.5/14.5/15.5); judul besar pakai clamp().
- Ukuran baru di luar skala → tambahkan token di `@theme`, jangan hardcode.

## Catatan lain

- Skill `ui-ux-design-pro` terpasang di user-level skills; bisa dipanggil untuk audit/desain UI lanjutan.
- Blok `.desktop-*` di `index.css` masih terduplikasi antara base ≥1024px dan override ≤1023px — kandidat refactor berikutnya.

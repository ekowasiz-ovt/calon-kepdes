# Design System — Karanganyar Digital

Dokumen ini mendeskripsikan **desain yang benar-benar diterapkan** di situs kampanye Calon Kepala Desa Karanganyar. Isinya menjadi acuan saat menambah halaman, section, atau komponen baru agar hasilnya tetap satu bahasa visual.

Sumber kebenaran yang lebih tinggi dari dokumen ini:

| Berkas | Peran |
|---|---|
| `src/index.css` | Token `@theme`, seluruh kelas komponen, animasi, breakpoint |
| `src/App.tsx` | Daftar route aktif dan kerangka halaman |
| `src/config.ts` | Seluruh teks kampanye yang dapat diedit |
| `src/components/kampanye/*` | Section landing page |
| `src/pages/*` | Blueprint tiap layar |
| `AGENTS.md` | Aturan kerja, konten, dan larangan |

Jika dokumen ini berbeda dengan kode, **kode menang** dan dokumen perlu diperbarui.

---

## 1. Ringkasan arah desain

Situs ini adalah **materi kampanye**, bukan situs resmi pemerintah desa, tetapi harus terasa seperti kanal layanan publik yang serius: terbuka, tertib, dan dapat dipercaya.

Karakter visual:

- **Editorial dan tegas.** Headline besar, huruf kapital, angka raksasa, banyak ruang putih.
- **Tenang, bukan ramai.** Permukaan dominan putih; hijau tua dipakai sebagai aksen struktural, bukan latar besar.
- **Mobile-first.** Semua keputusan dimulai dari lebar 360–390 px; desktop adalah penyempurnaan komposisi.
- **Jujur.** Data kosong, belum aktif, dan simulasi selalu punya label visual, tidak disamarkan.
- **Berbasis garis.** Pemisah 1 px, kartu ber-border tipis, bayangan sangat terbatas.

Yang dihindari: gradien dekoratif, blob, glassmorphism berlebihan, ilustrasi stok yang berpura-pura asli, dan angka palsu yang tampil seperti data nyata.

---

## 2. Dua lapisan visual

Repositori memuat dua generasi gaya. Keduanya berbagi token warna yang sama.

### 2.1 Lapisan kampanye (aktif, dipakai semua halaman)

- Pembungkus: `<div className="kampanye">` dari `LayoutKampanye`.
- Heading: **Big Shoulders Display Variable** 800, kapital, `line-height 0.98`.
- Latar: putih; section dipisahkan `border-top: 1px solid var(--k-line)`.
- Shell maksimal **1180 px**.
- Variabel lokal dipetakan dari token global: `--k-green`, `--k-green-mid`, `--k-gold`, `--k-gold-deep`, `--k-ink`, `--k-ink-soft`, `--k-line`, `--k-soft`, `--k-shell`.

### 2.2 Lapisan aplikasi lama (warisan)

- **Fraunces Variable** masih dideklarasikan untuk `.welcome-*`, `.desktop-*`, `.menu-banner__copy p`, `.route-placeholder h2`, `.aspirasi-detail__title`, dan `.budget-panel__header h2`.
- Di dalam `.kampanye`, aturan heading kampanye (`.kampanye h1/h2/h3`) memiliki spesifisitas yang sama tetapi ditulis lebih akhir, sehingga **Big Shoulders tetap menang**. Fraunces praktis tidak tampil di layar produksi saat ini.
- Kerangka lama (`MobileFrame`, `AppBar`, `BottomNav`, `DesktopNav`, `.mobile-frame`, `.menu-*`, `.welcome-*`) masih ada di CSS tetapi **tidak lagi dirender** oleh `App.tsx`.
- Halaman `/__data` masih memakai `.app-shell` + `.placeholder`, di luar pembungkus `.kampanye`.

Aturan praktis: untuk pekerjaan baru, ikuti lapisan kampanye. Jangan menghidupkan kembali frame ponsel atau navigasi lama.

---

## 3. Design token

Token didefinisikan di blok `@theme` (`src/index.css`). Tailwind v4 tanpa `tailwind.config.*`.

### 3.1 Warna

| Token | Nilai | Peran |
|---|---|---|
| `--color-page` | `#f5f5f3` | Latar luar shell, latar halaman bertab |
| `--color-white` | `#ffffff` | Permukaan utama: section, kartu, header, nav |
| `--color-ink-900` | `#14231b` | Teks utama, bayangan, overlay |
| `--color-ink-500` | `#55655c` | Teks sekunder, placeholder, ikon pasif |
| `--color-line` | `#e3e4e0` | Semua border 1 px dan pemisah |
| `--color-slate-50` | `#f7f7f5` | Permukaan lembut (`--k-soft`), hover netral |
| `--color-slate-100` | `#ecebe7` | Track progress, tab track, chip netral |
| `--color-green-900` | `#0b3d2e` | Brand utama: heading, tombol primer, pin UMKM, `theme-color` |
| `--color-green-700` | `#14664a` | Hover/isi CTA, state aktif, pin irigasi |
| `--color-green-500` | `#1e7a54` | Hover tombol primer, isi progress, badge sukses |
| `--color-green-50` | `#eaf0ec` | Tint hijau: badge sukses, ikon tile, avatar bot |
| `--color-accent` | `#c08a2e` | Aksen emas: garis section, border label, pin lampu |
| `--color-accent-50` | `#f6eddd` | Latar badge/label emas |
| `--color-accent-700` | `#8a6218` | Teks emas gelap: eyebrow, indikator, tag |
| `--color-red-500` | `#b3261e` | Error **dan** kategori data "jalan/infrastruktur" |
| `--color-red-50` | `#fbedec` | Latar error |

Alias hue warisan (`blue-*`, `purple-*`, `orange-*`) sudah dipetakan ulang ke ramp brand agar aturan lama tidak pecah. Jangan memakai nama hue lama untuk komponen baru.

**Pembagian 60/30/10.** ±60% putih/ground, ±30% hijau (heading, tombol, aksen struktural), ±10% emas. Merah tidak pernah dekoratif: hanya error dan kategori masalah.

**Ramp data (grafik anggaran).** `#0b3d2e → #14664a → #1e7a54 → #c08a2e → #8a9890`. Warna di sini adalah **data**, bukan dekorasi; urutannya tetap dan dipakai konsisten untuk pendapatan dan belanja.

**Warna pin peta** (`src/lib/constants.ts`, `gayaKategori`):

| Kategori | Warna |
|---|---|
| Infrastruktur | `#b3261e` |
| Pertanian | `#14664a` |
| UMKM | `#0b3d2e` |
| Irigasi | `#1e7a54` |
| Pemuda | `#55655c` |
| Kesehatan | `#8a6218` |
| Pendidikan | `#c08a2e` |
| Kebersihan | `#1e7a54` |
| Keamanan | `#55655c` |
| Sosial | `#8a6218` |
| Lainnya | `#8a9890` |

Warna yang sama dipakai marker, chip filter, dan ikon baris tab Kategori. Kategori tak dikenal memakai palet cadangan secara berurutan.

### 3.2 Tipografi

| Peran | Font | Aturan |
|---|---|---|
| Display kampanye | Big Shoulders Display Variable | 800, kapital, `line-height 0.98`, `letter-spacing 0.005em`; hero `line-height 0.86` |
| Display aplikasi lama | Fraunces Variable | 600, `letter-spacing -0.015em`; masih dideklarasikan, tetapi kalah oleh aturan heading `.kampanye` |
| Teks & UI | Archivo Variable | Body, label, tombol, tabel, form |

Ukuran yang dipakai:

| Elemen | Ukuran |
|---|---|
| Eyebrow / label wilayah | 11–12 px, kapital, `letter-spacing 0.15–0.16em`, emas gelap |
| Label nav bawah / tag kecil | 11–12 px, 600–800 |
| Teks UI, meta, tabel | 13–14.5 px |
| Body nyaman, lead | 15–17 px, `line-height 1.6` |
| Judul kartu | 19–21 px |
| Angka panel anggaran | 26 px, huruf display |
| Angka desa | `clamp(34px, 8vw, 52px)` |
| Judul halaman | `clamp(38px, 9vw, 60px)` |
| Hero landing | `clamp(52px, 15vw, 104px)` |
| Footer heading | 17 px |

Huruf display tidak dipakai untuk paragraf. Body minimal 13 px; teks utama tetap 15–17 px di mobile.

### 3.3 Radius

| Nilai | Penggunaan |
|---|---|
| 8 px | Link nav, select tahun, tombol ikon |
| 9 px | Tile ikon, input kampanye |
| 10 px | Tombol kampanye, panel, chip filter, kartu prinsip |
| 11 px | Kartu UMKM, tombol kembali AppBar |
| 12 px | Kartu misi/program/anggaran, tombol `ui-*`, panel state |
| 14 px | Figur hero, grid angka, foto profil |
| 999 px | Pill: badge, label status, chip, FAB, composer, avatar/foto brand header |

### 3.4 Border & bayangan

- Border standar: `1px solid var(--k-line)`.
- Aksen kiri: `5px solid var(--k-gold)` pada kutipan, `5px solid var(--k-green)` pada panel visi.
- Garis putus-putus: indikator misi dan state kosong.
- Bayangan hanya untuk elemen mengambang:
  - Header menempel: `0 1px 0 line, 0 6px 20px rgba(20,35,27,.08)`
  - FAB: `0 6px 20px rgba(11,61,46,.28)`
  - Kartu hover: `0 14px 30px rgba(20,35,27,.10)` + `translateY(-3px)`
  - Toast: `0 12px 32px rgba(20,35,27,.15)`
- Geometri datar: tidak ada inner shadow, tidak ada double border.

### 3.5 Spasi

Skala mengikuti kelipatan 2: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 34, 36, 40, 46, 56, 64, 86.

- Padding section: **64 px** mobile, **86 px** desktop.
- Padding shell: **20 px** mobile, **40 px** desktop.
- Padding kartu: 16–24 px.
- Jarak antar kartu grid: 12–20 px.
- Kepala halaman: 34 px atas, 26 px bawah, border-bottom.

---

## 4. Layout

### 4.1 Breakpoint

| Rentang | Perilaku |
|---|---|
| ≤ 720 px | Mobile: satu kolom, bottom nav, FAB, grid 2 kolom hanya untuk angka |
| 721–900 px | Tablet: grid misi/program/footer menjadi 2 kolom, angka 4 kolom |
| ≥ 901 px | Desktop: nav header tampil, bottom nav disembunyikan, grid 3 kolom, shell 1180 px |

Titik implementasi: `@media (min-width: 721px)` dan `@media (min-width: 901px)`.

### 4.2 Kerangka global

```
.kampanye
├── HeaderKampanye        sticky, blur, 66 px
├── <main>
│   └── section / .kampanye__shell
├── FooterKampanye        4 kolom di desktop, disclaimer
├── BottomNavKampanye     fixed 5 slot, Menu → /menu (≤900)
└── TombolDukung          FAB "Dukung Calon"
```

- Header: `position: sticky`, latar `rgba(255,255,255,.72)`, `backdrop-filter: blur(14px) saturate(1.6)`; bayangan muncul setelah scroll (`--menempel`).
- Nav bawah: 56 px + `env(safe-area-inset-bottom)`, latar `rgba(255,255,255,.97)`, blur 10 px.
- FAB: `bottom: calc(72px + safe-area)`, kanan 16 px (desktop 28 px, bawah 28 px).
- Footer mobile diberi `padding-bottom: 156px` agar tidak tertutup nav + FAB.
- Anchor `#hero`, `#profil`, `#visi-misi`, `#program` memakai `scroll-margin-top: 82px`.

### 4.3 Grid utama

| Blok | Mobile | Desktop |
|---|---|---|
| Hero | 1 kolom, figur di bawah | `1.25fr / 0.75fr`, gap 60 |
| Angka desa | 2 kolom | 4 kolom (≥721) |
| Profil | 1 kolom | `0.75fr / 1.25fr`, gap 56 |
| Misi | 1 kolom | 2 kolom (≥721), 3 kolom (≥901) |
| Program | 1 kolom | 2 kolom (≥721), 3 kolom (≥901) |
| Footer | 1 kolom | 2 kolom (≥721), 4 kolom (≥901) |
| Layanan | 1 kolom | `1.3fr / 1fr`, gap 36 |

Grid ber-border memakai trik `gap: 1px` + latar `--k-line` + `overflow: hidden` (grid angka desa), sehingga pemisah terlihat seperti garis tipis, bukan jarak.

---

## 5. Komponen

Penamaan kelas **BEM-ish**: `.blok`, `.blok__elemen`, `.blok--varian`. Utility Tailwind hanya dipakai sesekali; aturan visual baru ditulis di `src/index.css` pada bagian yang relevan.

### 5.1 Chrome

**Header** (`.kampanye-header`)

- Brand: avatar bulat 38 px berisi `kandidat.fotoCalon`; bila foto belum diisi, tampil inisial nama (mis. "AP") putih di hijau. Nama kandidat 19 px kapital + sublabel 11 px; sublabel dipotong dengan ellipsis di layar sempit.
- Nav desktop: Profil, Visi & Misi, Program, Transparansi, Layanan, Aspirasi, Dukung; link 14 px/600, padding 9×12, radius 8; hover `--k-soft`.
- Item aktif: latar `accent-50`, teks `accent-700`, garis bawah emas (`inset 0 -2px` via `box-shadow`), ditandai `aria-current="page"`.
- CTA kanan: "Sampaikan Aspirasi", hijau 900, radius 9, 14 px/700.

**Nav bawah** (`.kampanye-bottomnav`)

- 5 slot: Beranda, Peta, Aspirasi (utama), Potensi, Menu.
- Item: ikon 22 px + label 11 px/600, tinggi minimal 56 px.
- Aktif: label emas gelap, ikon emas.
- Item utama: ikon dibungkus lingkaran hijau 900 (padding 5 px).
- Slot "Menu" berpindah ke `/menu`; item ditandai aktif saat berada di sana.

**Halaman menu** (`.kampanye-menu`)

- Profil calon: avatar 56 px, nama 21 px/700 dengan font Archivo (bukan Big Shoulders kapital), subjudul "Calon Kepala Desa …"; tanpa ikon pengaturan.
- Tujuh baris menu setinggi 58 px: ikon 20 px hijau, label 16 px/600, chevron 16 px. Baris adalah tautan nyata ke Detail Aspirasi (daftar aspirasi masuk), Layanan Administrasi, Transparansi Anggaran, Tanya Karanganyar, Profil Calon, Visi & Misi, dan Program Unggulan; tanpa badge, toast, atau baris tiruan.
- Banner 190 px (220 px desktop): latar `kandidat.fotoLatar` atau gradasi hijau + kontur, tagline 20/24 px putih rata atas. Tanpa tombol CTA; aksi dukungan tetap lewat FAB.
- Mobile: header dan footer kampanye disembunyikan, bottom nav tetap. Desktop: konten maksimal 560 px, header/footer tampil.

**FAB** (`.kampanye-fab`)

- Pill hijau, ikon `HandHeart` 22 px + teks 15 px/700, bayangan hijau lembut.
- Disembunyikan di `/dukungan`, `/aspirasi`, `/tanya` karena halaman itu sudah punya aksi utama sendiri.
- `:active` mengecil 0.97; fokus outline hijau 2 px.

**Footer** (`.kampanye-footer`)

- Latar `--k-soft`, border-top, padding 46/30.
- Empat blok: Posko, Hubungi, Halaman (7 tautan), Media Sosial.
- Sosmed masih placeholder berbentuk pill, bukan tautan.
- Disclaimer wajib di paling bawah: status materi kampanye, data `[ISI]`/CONTOH belum final, bukan layanan resmi desa, plus copyright tahun berjalan.

### 5.2 Blok landing

**Hero** (`.kampanye-hero`)

- Motif `topo-lines`: SVG garis kontur Kendeng sebagai data URI, warna `#e3e4e0`, tile 420 px, opacity 0.35. Bukan hijau, bukan gradien.
- Label wilayah 11.5 px kapital emas gelap.
- Slogan tiga baris; baris terakhir ("Serba Digital.") berwarna emas.
- Visi ringkas maksimal 46ch, 17 px, abu.
- Dua CTA bersebelahan (grid 2 kolom): primer "Kenali Calon", outline "Sampaikan Aspirasi".
- Figur: potret 4:5 radius 14, foto latar offset ke kiri-atas, badge nomor urut hijau 900 dengan angka Big Shoulders 40 px.
- Tanpa foto: placeholder teks "FOTO CALON" di permukaan lembut, bukan gambar stok.

**Angka desa** (`.kampanye-angka`)

- Grid radius 14 px dengan border 1 px, item putih, padding 22×20.
- Tile ikon emas 34 px, angka display, label 14 px/700, satuan 12 px.
- Data dari `desa_profil` dan `dusun`; nilai nol tetap ditampilkan apa adanya.

**Profil** (`.kampanye-profil`)

- Foto 4:5 maksimal 320 px + kutipan bergaris emas kiri 5 px di permukaan lembut.
- Fakta diri memakai `<dl>` bergaris: label kapital 12 px, nilai 15.5 px/600.
- Tiga kartu prinsip (Terbuka, Melayani, Serba Digital) di grid 3 kolom mulai 721 px.

**Visi & Misi**

- Panel visi: permukaan lembut, border kiri hijau 5 px, radius 12, teks 18 px/600.
- Misi dikelompokkan dua grup; judul grup 20 px dengan garis horizontal mengisi sisa ruang (`::after`).
- Kartu misi: nomor kotak hijau 36 px radius 9, judul 19 px, deskripsi 14.5 px, indikator emas di atas garis putus-putus (`margin-top: auto`).

**Program**

- Lima kartu; tile ikon emas 44 px radius 10, ikon Phosphor `duotone` 23 px.
- Ringkasan program: 13 px/700 kapital abu.
- Daftar aksi: bullet berupa garis emas 8×2 px (`::before`), bukan titik.
- Kaki kartu: "Mendukung Misi N" + tautan ke `#visi-misi`.
- Kartu misi & program terangkat 3 px saat hover/fokus (hanya perangkat ber-hover dan tanpa reduced-motion).

### 5.3 Kepala halaman & section

Pola baku halaman non-landing:

```
<div className="kampanye__shell">
  <div className="kampanye-page-head">
    <span className="kampanye-eyebrow">Konteks</span>
    <div className="kampanye-rule" />        {/* 64×5 px emas, radius 3 */}
    <h1>Judul Halaman</h1>
    <p className="kampanye-lead">Ringkasan 1–2 baris</p>
  </div>
  ...
</div>
```

Section landing memakai `.kampanye-section` + `.kampanye__shell` + eyebrow + rule. Jangan mencampur padding inline halaman lama; shell yang mengatur lebar.

### 5.4 Tombol

| Kelas | Tampilan | Pemakaian |
|---|---|---|
| `.kampanye-btn--primary` | Hijau 900, teks putih, hover hijau 500 | Aksi utama |
| `.kampanye-btn--outline` | Border hijau, latar putih, hover lembut | Aksi sekunder |
| `.kampanye-btn--block` | Lebar penuh, isi tengah | Submit form mobile |
| `.ui-button--primary/outline/soft` | Varian lapisan aplikasi | Toast, komponen lama |

Ukuran: tinggi minimal 48 px (kampanye) / 44 px (`ui-button`), radius 10–12 px, teks 14–15 px/700, ikon 16–17 px dengan `aria-hidden`.

### 5.5 Form

- Label di atas, 13 px/700; kontrol tinggi 46 px, radius 9, border `--k-line`, teks 15 px.
- Fokus: border hijau + outline emas 2 px (kampanye) atau ring hijau 3 px (`ui-field`).
- Teks bantuan 12 px abu; error 12 px merah dan `aria-invalid` bila memungkinkan.
- Error validasi Bahasa Indonesia, mis. "Nama minimal 2 karakter", "Pilih dusun."
- Upload foto: kotak putus-putus radius 14, tinggi minimal 108 px, ikon kamera, keterangan "Maks. 5MB (JPG/PNG)"; pratinjau berupa chip nama file yang bisa dihapus.
- Honeypot dipindah ke luar layar (`left: -9999px`, opacity 0), bukan `display: none`.
- Form aspirasi dan dukungan memakai React Hook Form + Zod; halaman layanan memakai state lokal sederhana karena hanya simulasi.

### 5.6 State & feedback

| Kebutuhan | Komponen/gaya |
|---|---|
| Memuat | Teks state ("Memuat data..."), pola yang dipakai saat ini |
| Kosong | `.kampanye-state` bergaris putus-putus; varian khusus `.potensi-empty`, `.umkm-empty` dengan ikon lingkaran |
| Sukses | `.kampanye-state--ok` hijau tint |
| Error | Teks state merah pada varian lama; di halaman kampanye state netral + tombol "Coba lagi" bila ada `refetch` |
| Notifikasi | Toast kanan bawah, border kiri 4 px hijau/merah, auto-dismiss 3.5 s, `role="status"` |

Aturan: tidak ada layar kosong tanpa penjelasan. Setiap query wajib punya jalur loading, error, dan kosong.

### 5.7 Label status kampanye

`.label-status` adalah pill emas (border `--k-gold`, latar `accent-50`, teks `accent-700`, 12 px/700). Varian:

- `--block`: selebar kontainer, radius 10, untuk peringatan panjang.
- `--netral`: border `--k-line`, latar lembut, teks abu.

Empat teks wajib dipertahankan (`src/components/ui/LabelStatus.tsx`): `labelSimulasi`, `labelBelumAktif`, `labelMateriKampanye`, `labelAspirasiKampanye`. Jangan mengubah copy yang menyatakan kanal ini bukan layanan resmi desa.

### 5.8 Tab, chip, dan filter

- **Segmented tab** (`transparency-tabs`, `masalah-tabs`): track abu `#ecebe7`, padding 4, item radius 9, item aktif putih; tinggi 38 px.
- **Chip pill** (`potensi-tabs`, `peta-filter`, `umkm-filter`): radius 999, border 1 px, tinggi 32–34 px; aktif hijau 700 + teks putih.
- Grup chip bisa di-scroll horizontal tanpa scrollbar.
- Tab wajib memakai `role="tablist"` / `role="tab"` + `aria-selected`; chip filter UMKM memakai `aria-pressed`.

Catatan: chip 32–34 px lebih kecil dari target sentuh ideal 44 px. Karena itu chip dipakai untuk filter sekunder, bukan aksi kritis; beri jarak horizontal yang cukup.

### 5.9 Data & visualisasi

**Panel anggaran** (`.budget-panel`)

- Header: ikon 20 px hijau, label 13 px abu, angka 26 px display, badge tahun pill abu.
- Pendapatan: stacked bar 12 px radius pill.
- Belanja: donut 108 px dengan mask radial (lubang 17 px) + ikon dompet di tengah.
- Legenda: grid `10px | nama | nominal | persen`, swatch radius 3, angka persen 600.
- Tabel realisasi: header 12 px abu; kolom Bidang rata kiri, Pagu dan Realisasi rata kanan, baris bergaris atas.

Aturan: chart adalah data, bukan ornamen; jangan menambah warna di luar ramp.

**Peta** (`.peta-map-area`)

- Tinggi 460 px desktop, 360 px mobile, radius 12, border, `overflow: hidden`.
- Tile satelit Esri, tanpa zoom dengan scroll roda (`scrollWheelZoom={false}`).
- Marker: `divIcon` bulat 16 px, border putih 3 px, bayangan halus, warna per kategori.
- Marker berongga menandakan titik perkiraan (pusat dusun); marker penuh berarti titik presisi.
- Popup: badge kategori, judul, lokasi + tanggal, penanda "Perkiraan lokasi" bila perlu, dan tautan "Lihat Detail" ke `/aspirasi/:kode`.
- Chip filter dibentuk dari kategori yang benar-benar ada pada pin yang dimuat; memakai `aria-pressed`.
- Loading/error/kosong tampil sebagai pill di atas peta; peta tetap bisa digeser saat pin gagal dimuat.
- Outline batas desa: casing putih 8 px + garis emas 4 px, `interactive={false}`, label kecil di tengah, dan legenda kiri bawah. Peta fit ke bounds batas bila tidak ada `?fokus=`.
- Baris masalah: ikon lingkaran 40 px, judul 15 px, jumlah laporan 13 px, persen, track progress 6 px.

**Pemilih lokasi aspirasi** (`.pemilih-lokasi__map`)

- Sheet peta 220–320 px di dalam `location-sheet`, radius 14, diisolasi agar pane Leaflet tidak keluar panel.
- Ketuk peta atau geser pin untuk titik presisi; pilihan pusat dusun tetap tersedia sebagai fallback.
- Pin terpilih 24 px hijau dengan ring emas; status menyebut dusun terdekat.
- Tombol Batal dan "Gunakan Titik Ini" berpasangan; konfirmasi nonaktif sampai ada titik.

**Kartu UMKM**

- Grid horizontal `62px | isi | 36px`, tinggi minimal 92 px, radius 11.
- Foto 62 px radius 9; fallback ikon toko pada tint kategori.
- Aksi WhatsApp berupa tombol bulat di kanan, hanya jika nomor valid.

**Kartu potensi**

- Foto 16:9 minimal 190 px dengan badge kategori di kiri atas.
- Metrik berupa tile abu 2 kolom; nilai 14 px/600 hijau.
- Tombol "Lihat Detail" hijau tint, radius 9.

**Chat "Tanya Karanganyar"**

- Gelembung asisten putih radius `15 15 15 4`, pengguna hijau 700 radius `15 15 15 4` sisi berlawanan.
- Avatar 32 px bulat: bot hijau tint, pengguna abu.
- Indikator mengetik: tiga titik 5 px memantul 1 s.
- Contoh pertanyaan berupa chip; composer pill dengan tombol bulat hijau 38 px.
- Tinggi percakapan fleksibel, auto-scroll ke pesan terbaru.

**Timeline status**

- Enam tahap: Diterima → Diverifikasi → Diprioritaskan → Dalam Perencanaan → Dikerjakan → Selesai.
- Ikon bulat 24 px dalam kolom 28 px, garis penghubung 2 px `--k-line`; tahap selesai hijau 500, tahap aktif diberi ring hijau 15%.
- Status ringkas memakai `ui-badge` (success/info/warning) dari `badgeStatus()`.

---

## 6. Blueprint halaman

| Route | Tugas desain | Catatan visual |
|---|---|---|
| `/` | Landing kampanye | Hero → Angka desa → Profil → Visi & Misi → Program; section bergaris atas |
| `/layanan` | Standar layanan + simulasi permohonan | Kepala halaman, tabel 2 kolom, panel form; `labelBelumAktif` + `labelSimulasi` |
| `/transparansi` | Anggaran desa | Tab APBDes/Pembangunan/Realisasi, select tahun, dua panel chart, tabel realisasi, label sumber data |
| `/peta` | Peta & masalah | Tab Peta/Kategori/Wilayah, chip filter dari kategori aktual, peta 460/360 px, outline batas desa, baris masalah dengan progress, catatan bawah |
| `/potensi` | Potensi & UMKM | 4 tab; tab UMKM berisi direktori usaha dengan pencarian + filter; kartu potensi dan empty state khusus |
| `/aspirasi` | Form aspirasi | Form panjang satu kolom, upload 2 foto, sheet peta pemilih lokasi (wajib), label kanal kampanye |
| `/aspirasi/masuk` | Daftar aspirasi publik | Baris kode + badge status, judul, kategori/dusun/tanggal; klik membuka detail; skeleton/error/kosong |
| `/aspirasi/:kode` | Detail & tindak lanjut | Kode + badge status, meta, galeri, timeline 6 tahap, tautan "Lihat di Peta" |
| `/tanya` | Asisten informasi | Thread chat, contoh pertanyaan, composer pill; jawaban dari FAQ |
| `/dukungan` | Dukungan warga | Hanya nama + dusun, total dukungan, state terima kasih |
| `/menu` | Menu bergaya aplikasi | Profil calon, tujuh tautan halaman/anchor, banner tagline tanpa CTA; chrome kampanye disembunyikan di mobile |
| `/__data` | Cek koneksi Supabase | `.app-shell` + `.placeholder`, bukan bagian alur publik |

Redirect: `/welcome`, `/beranda` → `/`; `/aspirasi/baru` → `/aspirasi`; `/masalah` → `/peta`; `/umkm` → `/potensi`; route tak dikenal (`*`) → `/`.

---

## 7. Gerak & animasi

| Variabel | Nilai |
|---|---|
| `--ease-motion` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-reveal` | 950 ms |
| `--dur-route` | 400 ms |
| `--dur-hover` | 240 ms |
| `--jarak-reveal` | 28 px |

- **Reveal on scroll:** elemen dengan `data-reveal`; stagger lewat `data-delay="1"–"3"` (110/220/330 ms). IntersectionObserver `threshold 0.12`, `rootMargin 0 0 -8%`, berjalan sekali per elemen.
- **Progressive enhancement:** kelas `reveal-ready` baru ditambahkan oleh JavaScript; tanpa JS atau dengan reduced-motion konten langsung terlihat.
- **Route fade:** `.route-fade` (opacity + geser 8 px, 400 ms) tersedia sebagai kelas; saat ini belum dipasang di halaman mana pun.
- **Smooth scroll:** hanya jika `prefers-reduced-motion: no-preference`.
- **Mikro-interaksi:** hover kartu 3 px, progress 180–220 ms, skeleton pulse 1.4 s, FAB `:active` 0.97.
- **Reduced motion:** aturan global menekan semua durasi ke 0.01 ms; jangan membuat animasi yang mengabaikannya.

---

## 8. Aksesibilitas

- Fokus global: `outline: 2px solid var(--color-accent)` offset 2 px; nav bawah memakai outline hijau dengan offset −3 px agar tidak terpotong.
- Target sentuh: tombol utama ≥44–48 px, nav bawah 56 px, input 46 px.
- Semua ikon dekoratif `aria-hidden="true"`; ikon aksi punya `aria-label`.
- Nav memakai `<nav aria-label>`; item aktif `aria-current="page"`. Halaman menu memakai tautan biasa ke halaman/anchor; tidak ada tombol tiruan atau toast "belum aktif".
- Wilayah dinamis memakai `aria-live="polite"` (hasil pencarian, toast, state sukses).
- Progress masalah memakai `role="progressbar"` dengan `aria-valuenow`.
- Gambar punya alt bermakna; foto gagal muat menampilkan fallback ikon, bukan area kosong.
- Kontras: teks utama `#14231b` di atas putih; teks sekunder `#55655c`; hindari emas untuk paragraf panjang.

---

## 9. Aturan konten & nada

Desain tidak boleh membuat klaim yang tidak ada di data.

- Placeholder wajib `[ISI: ...]`; jangan menebak nama, usia, angka desa, biaya, atau nomor kontak.
- Data tampil berasal dari Supabase; angka contoh hanya lewat `seed.sql`.
- Selalu tandai simulasi/belum aktif dengan `LabelStatus`.
- Aspirasi adalah kanal kampanye, bukan pengaduan resmi desa.
- Jangan meminta NIK atau data pribadi sensitif.
- Jangan mengarang capaian, dukungan, atau janji waktu layanan.
- Nada: tenang, faktual, melayani; hindari bahasa menyerang kandidat lain.
- Teks yang belum pasti ditandai `TODO:`, bukan diisi karangan.

---

## 10. Implementasi

### 10.1 Peta berkas

```
src/index.css                  token @theme, :root --k-*, semua kelas
src/main.tsx                   QueryClient, ToastProvider, CSS Leaflet
src/components/kampanye/       Header, Hero, AngkaDesa, Profil, VisiMisi,
                               Program, Footer, BottomNav, TombolDukung, Layout
src/components/ui/             LabelStatus, Toast, Button, Badge, dll.
src/pages/                     satu berkas per layar
src/components/map/            BatasDesa, PemilihLokasiMap
src/hooks/useBatasDesa.ts      GeoJSON batas desa (opsional, gagal dengan tenang)
src/lib/constants.ts           palet kategori, badgeStatus
```

### 10.2 Konvensi

- Bahasa Indonesia untuk teks UI, komentar, nama domain, dan pesan error.
- Komponen: named export, function component, props bertipe eksplisit.
- Jangan menambah dependensi baru; ikon memakai `@phosphor-icons/react`.
- `import type` untuk tipe (`verbatimModuleSyntax`).
- Import relatif; alias `@` tidak dipakai.
- Jangan mengedit `dist/` atau `.env*` selain `.env.example`.

### 10.3 Cara menambah

**Section landing baru**

1. Buat komponen di `src/components/kampanye/` dengan `<section className="kampanye-section" id="...">`.
2. Di dalamnya: `.kampanye__shell`, eyebrow, `.kampanye-rule`, heading, isi.
3. Tandai elemen dengan `data-reveal` dan `data-delay` untuk stagger.
4. Tambahkan aturan CSS di blok `HALAMAN KAMPANYE`, bukan utility di JSX.
5. Daftarkan di `LandingPage.tsx`, lalu tambahkan anchor-nya ke `navKampanye`/`navMenuLain` di `config.ts` bila perlu.

**Halaman baru**

1. Tambah `<Route>` di dalam `LayoutKampanye` pada `src/App.tsx`.
2. Gunakan `.kampanye__shell` + `.kampanye-page-head`.
3. Jika halaman utama baru: perbarui `navBawah` (maksimal 5 slot bawah) dan `navMenuLain`, lalu pertimbangkan FAB.
4. Sediakan loading/error/empty.
5. Bila mengambil data, buat hook di `src/hooks/` dengan guard `supabase === null`.

**Token baru**

1. Tambahkan hanya di blok `@theme` (`src/index.css`).
2. Bila dipakai lapisan kampanye, petakan ke variabel `--k-*`.
3. Jangan membuat token duplikat dengan nilai yang sudah ada.

---

## 11. Do & Don't

| Lakukan | Hindari |
|---|---|
| Border 1 px, radius 9–14, bayangan minimal | Kartu bertumpuk bayangan tebal |
| Hijau tua sebagai aksen struktural | Blok hijau besar tanpa alasan |
| Emas untuk penekanan dan garis section | Emas untuk teks paragraf panjang |
| Merah hanya error dan kategori masalah | Merah sebagai dekorasi |
| Headline Big Shoulders kapital | Big Shoulders untuk body |
| Placeholder `[ISI: ...]` dan label status | Angka atau kredensial karangan |
| Grid 1 → 2 → 3 kolom | Desktop-first yang memecah mobile |
| Satu aksi utama per layar | Banyak CTA bersaing |
| State kosong yang menjelaskan | Layar kosong tanpa pesan |

---

## 12. Catatan konsistensi (temuan kode)

Beberapa hal berikut benar adanya di kode saat dokumen ini ditulis; berguna sebelum refactor:

1. `.kampanye-state--error` dipakai di `DukunganPage` tetapi belum punya aturan CSS; error tampil dengan gaya state netral (garis putus-putus). Varian error yang sudah bergaya adalah `.masalah-state--error`, `.potensi-state--error`, `.transparency-state--error`.
2. Kelas lama `.mobile-frame*`, `.app-bar*`, `.bottom-nav*`, `.desktop-*`, `.menu-*`, `.welcome-*` masih ada di CSS tetapi tidak dirender lagi; hanya `/__data` yang memakai `.app-shell`.
3. `Button`, `Card`, `Input`, `Select`, `Textarea`, `Tabs`, `Chip`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState`, `ProgressBar` tersedia di `src/components/ui/`, tetapi yang benar-benar dirender baru `Button` (tombol tutup Toast) dan `LabelStatus`. Detail aspirasi memakai kelas `ui-badge` langsung, bukan komponen `Badge`. Halaman kampanye memakai kelas CSS kustom.
4. Palet kategori memberi merah pada Infrastruktur. Ini kategori data, bukan error; jangan dipakai sebagai contoh pemakaian merah dekoratif.
5. Tombol filter peta (`peta-filter`) sudah memiliki `aria-pressed` dan dibentuk dari kategori aktual pada pin.
6. Outline batas desa hanya dirender bila `public/data/batas-desa-karanganyar.geojson` tersedia. Tanpa berkas itu peta tetap berfungsi; jangan mengganti dengan polygon karangan.

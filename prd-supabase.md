# PRD v2.0 — Karanganyar Digital (Web Full Stack)

> **Stack:** Vite + React (TypeScript) + Tailwind CSS v4 + Supabase (Postgres, Storage, RLS, RPC).
> **Tujuan:** panduan build bertahap untuk AI agent agar aplikasi web mobile "Karanganyar Digital" **persis seperti gambar referensi (12 layar)** dan benar-benar tersambung ke database. Dipakai sebagai **bahan kampanye / demo** dengan data contoh (seed) yang realistis.

### Perubahan dari v1
| v1 | v2 |
|---|---|
| HTML/CSS/JS murni, data `data.js` | Vite + React + TS + Tailwind v4 + Supabase |
| Router hash | React Router (path bersih) |
| Form hanya toast | Form benar-benar menyimpan ke Supabase (RPC + Storage) |
| Peta gambar statis | Peta satelit interaktif (Leaflet) + pin dari database |
| Chatbot jawaban statis | Chatbot FAQ lewat RPC Supabase |
| Tanpa struktur file | **Struktur file lengkap (bagian 3)** |
| Bottom nav tampil di semua layar | **Layar 3 & 4 tanpa bottom nav** (sesuai gambar) |

---

## 0. ATURAN UNTUK AGENT (WAJIB DIBACA DULU)

1. Kerjakan **satu STEP per giliran**. Jangan lanjut sebelum semua **Kriteria Selesai** step aktif terpenuhi. Di akhir tiap step laporkan: file dibuat/diubah + hasil cek kriteria.
2. **Jangan menambah fitur, halaman, atau teks** di luar dokumen ini. Salin teks persis (huruf besar-kecil, tanda baca).
3. Tampilan harus meniru gambar: kartu pastel, hijau tua sebagai warna utama, sudut membulat, bingkai mobile.
4. **Jangan mengarang kredensial.** Jika butuh `SUPABASE_URL` / `ANON_KEY` atau akses proyek Supabase, **berhenti dan minta ke pengguna**. Jangan pernah memakai atau menaruh `service_role` key di kode frontend.
5. Semua teks UI berbahasa Indonesia.
6. Semua data tampil harus dari Supabase (bukan hardcode), kecuali teks statis UI (label, placeholder, slogan).
7. Setiap halaman wajib punya 3 kondisi: **loading** (skeleton), **error** (pesan + tombol "Coba lagi"), dan **kosong** (bila daftar kosong).
8. Teks yang tidak terbaca di gambar ditandai `TODO:` di kode; jangan menebak desain baru.
9. Perintah database dijalankan pengguna (SQL Editor Supabase atau `supabase db push`). Agent menulis file SQL-nya dan memberi tahu cara menjalankannya.

### Yang perlu disiapkan pengguna (agent boleh minta di STEP 1/2)
- Proyek Supabase (URL + anon key).
- Foto aset di `public/images/` (daftar di bagian 3). Bila belum ada, pakai placeholder gradasi dengan `TODO:`.
- Nama kecamatan & kabupaten yang benar, serta koordinat tengah desa.

---

## 1. RINGKASAN PRODUK

| Item | Isi |
|---|---|
| Nama | **Karanganyar Digital** |
| Tagline | Data, Aspirasi, dan Masa Depan Desa |
| Slogan hero | Satu Desa. Satu Data. Satu Ruang untuk Bersama. |
| Platform | Web mobile-first (responsif; di desktop tampil dalam bingkai mobile 390 px) |
| Pengguna | Warga (publik, **tanpa login**) |
| Admin | Mengelola data lewat **Supabase Studio** (panel admin di luar cakupan) |

### 12 layar & route

| # | Layar | Route | Bottom nav |
|---|---|---|---|
| 1 | Sambutan (Hero) | `/welcome` | Ya (gaya terang), Beranda aktif |
| 2 | Beranda (Dashboard) | `/beranda` | Ya, Beranda aktif |
| 3 | Sampaikan Aspirasi | `/aspirasi/baru` | **Tidak ada** |
| 4 | Detail Aspirasi | `/aspirasi/:kode` | **Tidak ada** |
| 5 | Peta Masalah Desa | `/peta` | Ya, Peta aktif |
| 6 | Masalah Terbanyak | `/masalah` | Ya, Program aktif |
| 7 | Program Desa | `/program` | Ya, Program aktif |
| 8 | Transparansi Desa | `/transparansi` | Ya, slot 4 = "Transparansi" aktif |
| 9 | Potensi Desa | `/potensi` | Ya, slot 4 = "Potensi" aktif |
| 10 | Direktori UMKM | `/umkm` | Ya, slot 4 = "UMKM" aktif |
| 11 | Tanya Karanganyar | `/tanya` | Ya, Program aktif |
| 12 | Menu / Profil | `/menu` | Ya, Menu aktif |

`/` → redirect ke `/welcome`. Rute tidak dikenal → `/welcome`.

---

## 2. TECH STACK & DEPENDENCI

**Runtime:** Node 20+, npm.

**Dependencies**
```
react react-dom react-router-dom
@supabase/supabase-js
@tanstack/react-query
react-hook-form zod @hookform/resolvers
leaflet react-leaflet
lucide-react clsx
@fontsource-variable/plus-jakarta-sans
```
**Dev dependencies**
```
vite @vitejs/plugin-react typescript
tailwindcss @tailwindcss/vite
@types/react @types/react-dom @types/leaflet
```
**Catatan Tailwind v4:** tidak memakai `tailwind.config.ts`. Plugin `@tailwindcss/vite` dipasang di `vite.config.ts`, `src/index.css` berisi `@import "tailwindcss";` dan token tema di blok `@theme { ... }`.

**Variabel lingkungan** (`.env.local`, jangan di-commit):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 3. STRUKTUR FILE (WAJIB DIIKUTI)

```
karanganyar-digital/
├─ .env.example
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ vercel.json                      # SPA rewrite -> /index.html
├─ README.md                        # cara jalanin + cara migrasi DB
│
├─ public/
│  ├─ favicon.svg
│  └─ images/
│     ├─ logo-desa.png              # lambang desa (perisai hijau-emas)
│     ├─ hero-desa.jpg              # gapura "DESA KARANGANYAR" + gunung
│     ├─ avatar-warga.jpg           # avatar bulat header & menu
│     ├─ jalan-rusak-1.jpg
│     ├─ jalan-rusak-2.jpg
│     ├─ program-jalan.jpg
│     ├─ program-umkm.jpg
│     ├─ program-pertanian.jpg
│     ├─ potensi-pertanian.jpg
│     ├─ potensi-peternakan.jpg
│     ├─ umkm-keripik.jpg
│     ├─ umkm-batik.jpg
│     ├─ umkm-dapoer.jpg
│     └─ banner-menu.jpg
│
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/
│  │  ├─ 0001_schema.sql            # tabel
│  │  ├─ 0002_views_rpc.sql         # view + fungsi RPC
│  │  └─ 0003_rls_storage.sql       # RLS, grant, bucket storage
│  └─ seed.sql                      # data contoh sesuai gambar
│
└─ src/
   ├─ main.tsx                      # entry: QueryClientProvider, BrowserRouter, ToastProvider
   ├─ App.tsx                       # definisi route
   ├─ index.css                     # @import tailwindcss + @theme + font
   │
   ├─ lib/
   │  ├─ supabase.ts                # createClient(env)
   │  ├─ queryClient.ts
   │  ├─ format.ts                  # rupiah(), tanggalID(), persen()
   │  ├─ geo.ts                     # haversine(), dusunTerdekat()
   │  ├─ storage.ts                 # fotoUrl(path), uploadFotoAspirasi(file)
   │  ├─ localState.ts              # simpan kode riwayat aspirasi (localStorage, try/catch)
   │  └─ constants.ts               # warna pin, label status, daftar slot nav
   │
   ├─ types/
   │  └─ db.ts                      # tipe baris tabel/view/RPC
   │
   ├─ hooks/
   │  ├─ useDesaProfil.ts
   │  ├─ useCuaca.ts                # Open-Meteo, fallback ke desa_profil
   │  ├─ useKategori.ts
   │  ├─ useDusun.ts
   │  ├─ useAspirasiDetail.ts       # aspirasi_publik + foto + status_log
   │  ├─ useKirimAspirasi.ts        # mutation: upload foto + rpc kirim_aspirasi
   │  ├─ usePetaPin.ts
   │  ├─ usePetaRingkas.ts
   │  ├─ useMasalah.ts              # per kategori & per dusun
   │  ├─ useProgram.ts              # program + roadmap
   │  ├─ useAnggaran.ts
   │  ├─ usePotensi.ts
   │  ├─ useUmkm.ts
   │  ├─ useTanya.ts                # mutation: rpc tanya_karanganyar
   │  └─ useNotifikasiCount.ts
   │
   ├─ components/
   │  ├─ layout/
   │  │  ├─ MobileFrame.tsx         # bingkai 390px, latar --bg-page
   │  │  ├─ AppBar.tsx              # tombol kembali + judul
   │  │  ├─ BottomNav.tsx           # 5 item, slot 4 dinamis
   │  │  └─ ScrollToTop.tsx
   │  ├─ ui/
   │  │  ├─ Button.tsx              # primary | outline | soft
   │  │  ├─ Card.tsx
   │  │  ├─ Chip.tsx
   │  │  ├─ Tabs.tsx
   │  │  ├─ Badge.tsx
   │  │  ├─ Input.tsx  Select.tsx  Textarea.tsx
   │  │  ├─ ProgressBar.tsx
   │  │  ├─ Toast.tsx              # + ToastProvider/useToast
   │  │  ├─ Skeleton.tsx
   │  │  ├─ EmptyState.tsx
   │  │  └─ ErrorState.tsx
   │  ├─ charts/
   │  │  ├─ StackedBar.tsx         # bar bertumpuk (SVG/CSS)
   │  │  └─ Donut.tsx              # donut (SVG)
   │  ├─ map/
   │  │  ├─ VillageMap.tsx         # Leaflet + tile satelit
   │  │  ├─ PinMarker.tsx          # divIcon berwarna
   │  │  ├─ MapControls.tsx        # +, −, lokasi saya
   │  │  └─ LocationPicker.tsx     # bottom sheet pilih lokasi (form aspirasi)
   │  └─ domain/
   │     ├─ StatCard.tsx           # kartu Data Karanganyar
   │     ├─ WeatherCard.tsx
   │     ├─ QuickAccess.tsx
   │     ├─ StatusTimeline.tsx
   │     ├─ PhotoCarousel.tsx      # 1/2
   │     ├─ ProblemRow.tsx         # baris Masalah Terbanyak
   │     ├─ ProgramCard.tsx
   │     ├─ PotensiCard.tsx
   │     ├─ UmkmCard.tsx
   │     ├─ ChatBubble.tsx
   │     └─ MenuList.tsx
   │
   └─ pages/
      ├─ WelcomePage.tsx            # layar 1
      ├─ BerandaPage.tsx            # layar 2
      ├─ AspirasiBaruPage.tsx       # layar 3
      ├─ AspirasiDetailPage.tsx     # layar 4
      ├─ PetaPage.tsx               # layar 5
      ├─ MasalahPage.tsx            # layar 6
      ├─ ProgramPage.tsx            # layar 7
      ├─ TransparansiPage.tsx       # layar 8
      ├─ PotensiPage.tsx            # layar 9
      ├─ UmkmPage.tsx               # layar 10
      ├─ TanyaPage.tsx              # layar 11
      └─ MenuPage.tsx               # layar 12
```

---

## STEP 1 — Inisialisasi Proyek

1. Buat proyek: `npm create vite@latest karanganyar-digital -- --template react-ts`.
2. Pasang semua dependensi bagian 2.
3. Konfigurasi `vite.config.ts` (plugin react + `@tailwindcss/vite`, alias `@` → `src`).
4. `src/index.css`: `@import "tailwindcss";`, impor font Plus Jakarta Sans, blok `@theme` kosong dulu (diisi di STEP 7).
5. Buat `.env.example`, `.gitignore` (termasuk `.env.local`), `vercel.json` (rewrite semua path ke `/index.html`), dan semua folder kosong sesuai bagian 3 (boleh dengan file placeholder).
6. `README.md`: perintah `npm i`, `npm run dev`, dan cara menjalankan migrasi.
7. **Berhenti dan minta** ke pengguna: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (bila belum ada, lanjutkan STEP 2–5 yang hanya menulis SQL).

**Kriteria Selesai**
- [ ] `npm run dev` jalan tanpa error, halaman putih bertuliskan placeholder.
- [ ] `npm run build` sukses.
- [ ] Struktur folder sama dengan bagian 3.

---

## STEP 2 — Database: Skema (`supabase/migrations/0001_schema.sql`)

Tulis SQL berikut (boleh diperhalus, tetapi **nama tabel/kolom jangan diubah**).

```sql
create extension if not exists pgcrypto;

-- Profil desa (satu baris)
create table public.desa_profil (
  id int primary key default 1 check (id = 1),
  nama_desa text not null default 'Karanganyar',
  wilayah_teks text not null default 'Desa Karanganyar, Kec. TODO, Kab. TODO',
  tagline text not null default 'Data, Aspirasi, dan Masa Depan Desa',
  jumlah_penduduk int not null default 5842,
  jumlah_rt int not null default 42,
  jumlah_rw int not null default 12,
  jumlah_umkm int not null default 86,
  lat numeric(9,6) not null default -7.090000,   -- TODO: koordinat tengah desa
  lng numeric(9,6) not null default 110.920000,  -- TODO
  cuaca_suhu int default 28,
  cuaca_kondisi text default 'Cerah Berawan',
  cuaca_max int default 32,
  cuaca_min int default 22
);

create table public.dusun (
  id smallint generated always as identity primary key,
  nama text not null unique,
  lat numeric(9,6),
  lng numeric(9,6),
  urutan smallint not null default 0
);

create table public.kategori (
  id smallint generated always as identity primary key,
  nama text not null unique,
  urutan smallint not null default 0
);

create sequence public.seq_aspirasi_kode start 1000;

create table public.aspirasi (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null check (char_length(nama) between 2 and 100),
  hp text not null check (hp ~ '^08[0-9]{8,12}$'),
  kategori_id smallint not null references public.kategori(id),
  sub_kategori text,                       -- contoh: 'Jalan', 'Lampu', 'Fasilitas Umum'
  dusun_id smallint references public.dusun(id),
  lokasi_teks text,
  lat numeric(9,6),
  lng numeric(9,6),
  judul text not null check (char_length(judul) between 5 and 150),
  deskripsi text not null check (char_length(deskripsi) between 10 and 2000),
  status text not null default 'Diterima' check (status in
    ('Diterima','Diverifikasi','Diprioritaskan','Dalam Perencanaan','Dikerjakan','Selesai')),
  created_at timestamptz not null default now()
);
create index on public.aspirasi (kategori_id);
create index on public.aspirasi (dusun_id);
create index on public.aspirasi (status);
create index on public.aspirasi (created_at desc);

create table public.aspirasi_foto (
  id uuid primary key default gen_random_uuid(),
  aspirasi_id uuid not null references public.aspirasi(id) on delete cascade,
  storage_path text not null,              -- 'uploads/...' (bucket) ATAU '/images/...' (aset lokal demo)
  urutan smallint not null default 0
);

create table public.aspirasi_status_log (
  id uuid primary key default gen_random_uuid(),
  aspirasi_id uuid not null references public.aspirasi(id) on delete cascade,
  tahap text not null check (tahap in
    ('Diterima','Diverifikasi','Diprioritaskan','Dalam Perencanaan','Dikerjakan','Selesai')),
  tanggal date not null default current_date,
  unique (aspirasi_id, tahap)
);

create table public.program (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text not null,                  -- 'Infrastruktur' | 'Ekonomi' | 'Pertanian'
  status text not null check (status in ('Perencanaan','Berjalan','Dalam Proses','Selesai')),
  target_teks text not null,               -- '500 m'
  realisasi_teks text not null,            -- '375 m'
  progres_persen smallint not null check (progres_persen between 0 and 100),
  foto_path text,
  prioritas boolean not null default true,
  urutan smallint not null default 0
);

create table public.roadmap (
  id uuid primary key default gen_random_uuid(),
  tahun smallint not null check (tahun between 1 and 5),
  judul text not null,
  deskripsi text,
  urutan smallint not null default 0
);

create table public.anggaran_item (
  id uuid primary key default gen_random_uuid(),
  tahun smallint not null default 2026,
  jenis text not null check (jenis in ('pendapatan','belanja')),
  nama text not null,
  nominal bigint not null check (nominal >= 0),
  urutan smallint not null default 0
);

create table public.anggaran_realisasi (
  id uuid primary key default gen_random_uuid(),
  tahun smallint not null default 2026,
  bidang text not null,
  pagu bigint not null,
  realisasi bigint not null,
  urutan smallint not null default 0
);

create table public.potensi (
  id uuid primary key default gen_random_uuid(),
  kategori text not null check (kategori in ('Pertanian','Peternakan','UMKM','Pemuda')),
  judul text not null,
  foto_path text,
  komoditas_utama text,
  metrik jsonb not null default '[]',      -- [{"label":"Luas Lahan","value":"± 1,250 ha"}]
  urutan smallint not null default 0
);

create table public.umkm (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null check (kategori in ('Makanan','Kerajinan','Fashion')),
  produk text not null,
  dusun_id smallint references public.dusun(id),
  whatsapp text,                           -- format 628xxxxxxxxxx
  foto_path text,
  aktif boolean not null default true
);

create table public.faq (
  id int generated always as identity primary key,
  pertanyaan text not null,
  jawaban text not null,
  kata_kunci text[] not null default '{}'
);

create table public.chat_log (
  id bigint generated always as identity primary key,
  pertanyaan text not null,
  ditemukan boolean not null,
  created_at timestamptz not null default now()
);

create table public.notifikasi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  isi text,
  created_at timestamptz not null default now()
);
```

**Kriteria Selesai**
- [ ] File SQL berjalan tanpa error di SQL Editor (atau agent menyatakan belum bisa dijalankan dan memberi instruksi).
- [ ] 17 tabel terbentuk.

---

## STEP 3 — Database: View & RPC (`0002_views_rpc.sql`)

**Aturan privasi:** nomor HP dan nama pengirim **tidak boleh** bisa dibaca publik. Publik hanya membaca lewat view di bawah.

```sql
-- Aspirasi untuk publik (tanpa nama & HP). Dibuat sebagai view milik owner (bypass RLS).
create view public.aspirasi_publik with (security_invoker = false) as
select a.id, a.kode, a.judul, a.deskripsi, a.kategori_id,
       k.nama as kategori, a.sub_kategori, a.dusun_id, d.nama as dusun,
       coalesce(a.lokasi_teks, d.nama) as lokasi_teks,
       a.lat, a.lng, a.status, a.created_at,
       case
         when a.sub_kategori = 'Jalan' then 'jalan'
         when a.sub_kategori = 'Lampu' then 'lampu'
         when k.nama = 'Irigasi' then 'irigasi'
         when k.nama = 'UMKM' then 'umkm'
         when a.sub_kategori = 'Fasilitas Umum' then 'fasilitas'
         else 'lainnya'
       end as jenis
from public.aspirasi a
join public.kategori k on k.id = a.kategori_id
left join public.dusun d on d.id = a.dusun_id;

-- Masalah per kategori (jumlah + persen dari total)
create view public.v_masalah_kategori with (security_invoker = false) as
select k.id, k.nama, count(a.id)::int as jumlah,
       round(100.0 * count(a.id) / nullif(sum(count(a.id)) over (), 0))::int as persen
from public.kategori k
left join public.aspirasi a on a.kategori_id = k.id
group by k.id, k.nama;

-- Masalah per dusun
create view public.v_masalah_dusun with (security_invoker = false) as
select d.id, d.nama, count(a.id)::int as jumlah,
       round(100.0 * count(a.id) / nullif(sum(count(a.id)) over (), 0))::int as persen
from public.dusun d
left join public.aspirasi a on a.dusun_id = d.id
group by d.id, d.nama;

-- Ringkasan panel peta: laporan AKTIF (status <> 'Selesai') per jenis
create view public.v_peta_ringkas with (security_invoker = false) as
select jenis, count(*)::int as jumlah
from public.aspirasi_publik
where status <> 'Selesai' and jenis <> 'lainnya'
group by jenis;

-- Kirim aspirasi (publik, tanpa login)
create or replace function public.kirim_aspirasi(
  p_nama text, p_hp text, p_kategori_id int, p_judul text, p_deskripsi text,
  p_lokasi_teks text default null, p_dusun_id int default null,
  p_lat numeric default null, p_lng numeric default null,
  p_foto_paths text[] default '{}'
) returns text
language plpgsql security definer set search_path = public as $$
declare v_kode text; v_id uuid; v_path text; v_i smallint := 0;
begin
  if (select count(*) from aspirasi
      where hp = p_hp and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'Terlalu banyak aspirasi dari nomor ini. Coba lagi besok.';
  end if;

  v_kode := 'KD-' || to_char(now(), 'YYYY') || '-' ||
            lpad(nextval('seq_aspirasi_kode')::text, 5, '0');

  insert into aspirasi (kode, nama, hp, kategori_id, dusun_id, lokasi_teks,
                        lat, lng, judul, deskripsi)
  values (v_kode, trim(p_nama), trim(p_hp), p_kategori_id, p_dusun_id,
          p_lokasi_teks, p_lat, p_lng, trim(p_judul), trim(p_deskripsi))
  returning id into v_id;

  insert into aspirasi_status_log (aspirasi_id, tahap) values (v_id, 'Diterima');

  foreach v_path in array coalesce(p_foto_paths, '{}') loop
    exit when v_i >= 2;
    if v_path like 'uploads/%' then
      insert into aspirasi_foto (aspirasi_id, storage_path, urutan)
      values (v_id, v_path, v_i);
      v_i := v_i + 1;
    end if;
  end loop;

  return v_kode;
end $$;
revoke all on function public.kirim_aspirasi from public;
grant execute on function public.kirim_aspirasi to anon, authenticated;

-- Chatbot FAQ berbasis kata kunci
create or replace function public.tanya_karanganyar(p_pertanyaan text)
returns text language plpgsql security definer set search_path = public as $$
declare v_q text := lower(trim(p_pertanyaan)); v_jawab text;
begin
  if char_length(v_q) < 2 or char_length(v_q) > 300 then
    return 'Pertanyaan tidak valid.';
  end if;
  select f.jawaban into v_jawab from faq f
  where exists (select 1 from unnest(f.kata_kunci) kk where v_q like '%' || kk || '%')
  order by (select count(*) from unnest(f.kata_kunci) kk where v_q like '%' || kk || '%') desc, f.id
  limit 1;
  insert into chat_log (pertanyaan, ditemukan) values (left(p_pertanyaan, 300), v_jawab is not null);
  return coalesce(v_jawab,
    'Terima kasih, pertanyaan Anda kami catat. Silakan hubungi kantor desa untuk informasi lebih lanjut.');
end $$;
revoke all on function public.tanya_karanganyar from public;
grant execute on function public.tanya_karanganyar to anon, authenticated;

grant select on public.aspirasi_publik, public.v_masalah_kategori,
                public.v_masalah_dusun, public.v_peta_ringkas to anon, authenticated;
```

**Kriteria Selesai**
- [ ] Semua view dan 2 fungsi terbentuk tanpa error.
- [ ] Tidak ada kolom `nama` / `hp` pada `aspirasi_publik`.

---

## STEP 4 — Database: RLS & Storage (`0003_rls_storage.sql`)

```sql
-- Aktifkan RLS di semua tabel
alter table public.desa_profil enable row level security;
alter table public.dusun enable row level security;
alter table public.kategori enable row level security;
alter table public.aspirasi enable row level security;
alter table public.aspirasi_foto enable row level security;
alter table public.aspirasi_status_log enable row level security;
alter table public.program enable row level security;
alter table public.roadmap enable row level security;
alter table public.anggaran_item enable row level security;
alter table public.anggaran_realisasi enable row level security;
alter table public.potensi enable row level security;
alter table public.umkm enable row level security;
alter table public.faq enable row level security;
alter table public.chat_log enable row level security;
alter table public.notifikasi enable row level security;

-- Baca publik (tabel konten)
create policy "baca publik" on public.desa_profil for select to anon, authenticated using (true);
create policy "baca publik" on public.dusun for select to anon, authenticated using (true);
create policy "baca publik" on public.kategori for select to anon, authenticated using (true);
create policy "baca publik" on public.aspirasi_foto for select to anon, authenticated using (true);
create policy "baca publik" on public.aspirasi_status_log for select to anon, authenticated using (true);
create policy "baca publik" on public.program for select to anon, authenticated using (true);
create policy "baca publik" on public.roadmap for select to anon, authenticated using (true);
create policy "baca publik" on public.anggaran_item for select to anon, authenticated using (true);
create policy "baca publik" on public.anggaran_realisasi for select to anon, authenticated using (true);
create policy "baca publik" on public.potensi for select to anon, authenticated using (true);
create policy "baca publik" on public.umkm for select to anon, authenticated using (aktif);
create policy "baca publik" on public.notifikasi for select to anon, authenticated using (true);

-- aspirasi, faq, chat_log: TANPA policy untuk anon = tertutup. Akses hanya via view/RPC.
revoke all on public.aspirasi, public.faq, public.chat_log from anon, authenticated;

-- Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('aspirasi-foto', 'aspirasi-foto', true, 5242880, array['image/jpeg','image/png'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('konten', 'konten', true)                 -- foto program/potensi/umkm, diisi admin
on conflict (id) do nothing;

create policy "unggah foto aspirasi" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'aspirasi-foto' and name like 'uploads/%');
create policy "baca foto aspirasi" on storage.objects for select to anon, authenticated
  using (bucket_id = 'aspirasi-foto');
create policy "baca konten" on storage.objects for select to anon, authenticated
  using (bucket_id = 'konten');
```

**Kriteria Selesai**
- [ ] Uji: `supabase.from('aspirasi').select('*')` dengan anon key **gagal / kosong** (HP tidak bocor).
- [ ] Uji: `supabase.from('aspirasi_publik').select('*')` berhasil.
- [ ] Upload file > 5 MB atau bukan JPG/PNG ditolak bucket.

---

## STEP 5 — Seed Data (`supabase/seed.sql`)

Seed harus menghasilkan angka di layar **persis seperti gambar**.

**5.1 Statis**
- `desa_profil`: satu baris (nilai default sudah sesuai).
- `dusun` (11): **Dusun Karanganyar, Dusun Ngemplak, Dusun Bareng, Dusun Kedungbamban, Dusun Diren, Dusun Dalon, Dusun Gadingan, Dusun Jurug, Dusun Wani, Dusun Dayu, Dusun Geneng**, dengan koordinat seed perkiraan di sekitar titik tengah desa.
- `kategori` (11): Infrastruktur, Pertanian, UMKM, Irigasi, Pemuda, Kesehatan, Pendidikan, Kebersihan, Keamanan, Sosial, Lainnya.
- `notifikasi`: **3 baris** contoh (badge "3" di Menu).
- `faq` (4 baris, `kata_kunci` huruf kecil):
  | pertanyaan | kata_kunci | jawaban |
  |---|---|---|
  | Ada program UMKM apa? | `{umkm,usaha}` | Program Pengembangan UMKM sedang dalam tahap perencanaan dengan target 50 UMKM. Saat ini 12 sudah terealisasi. |
  | Bagaimana cara mengurus surat? | `{surat,mengurus}` | Silakan datang ke kantor desa pada jam pelayanan dengan membawa KTP dan KK. Layanan online akan segera hadir. `TODO: konfirmasi persyaratan` |
  | Kapan perbaikan jalan Dusun X? | `{jalan,perbaikan}` | Program Perbaikan Jalan Desa sedang berjalan: realisasi 375 m dari target 500 m (78%). Jadwal per dusun akan diumumkan pemerintah desa. |
  | Informasi potensi pertanian? | `{pertanian,tani,sawah}` | Komoditas utama Padi, Jagung, dan Kedelai dengan luas lahan ± 1,250 ha dan 12 kelompok tani. |

**5.2 Program** (3 baris, urutan 1–3)
| judul | kategori | status | target_teks | realisasi_teks | progres_persen |
|---|---|---|---|---|---|
| Perbaikan Jalan Desa | Infrastruktur | Dalam Proses | 500 m | 375 m | **78** |
| Pengembangan UMKM | Ekonomi | Perencanaan | 50 UMKM | 12 | 24 |
| Program Pertanian Modern | Pertanian | Berjalan | 100 ha | 40 ha | 40 |

`foto_path`: `/images/program-jalan.jpg`, `/images/program-umkm.jpg`, `/images/program-pertanian.jpg`.
`roadmap`: 5 baris (Tahun 1–5), judul/deskripsi contoh singkat.

**5.3 Anggaran 2026** (total masing-masing **1.245.000.000**)
| jenis | nama | nominal |
|---|---|---|
| pendapatan | Dana Desa | 560.250.000 |
| pendapatan | Alokasi Dana Desa | 373.500.000 |
| pendapatan | Bagi Hasil Pajak | 186.750.000 |
| pendapatan | Pendapatan Lainnya | 124.500.000 |
| belanja | Pembangunan | 684.750.000 |
| belanja | Pemberdayaan | 249.000.000 |
| belanja | Pemdes | 186.750.000 |
| belanja | Pembinaan | 124.500.000 |

`anggaran_realisasi`: 4 baris contoh (satu per bidang belanja, realisasi < pagu).

**5.4 Potensi**
- Pertanian: `komoditas_utama` = `Padi, Jagung, Kedelai`; `metrik` = `[{"label":"Luas Lahan","value":"± 1,250 ha"},{"label":"Kelompok Tani","value":"12 kelompok"}]`; foto `/images/potensi-pertanian.jpg`.
- Peternakan: judul "Peternakan", foto `/images/potensi-peternakan.jpg`, `komoditas_utama` & `metrik` contoh `TODO:`.
- UMKM dan Pemuda: satu baris contoh masing-masing.

**5.5 UMKM** (3 baris)
| nama | kategori | produk | dusun | foto |
|---|---|---|---|---|
| Keripik Pisang Sari Rasa | Makanan | Keripik pisang | Dusun Karanganyar | `/images/umkm-keripik.jpg` |
| Batik Lestari | Kerajinan | Batik tulis | Belum dikonfirmasi | `/images/umkm-batik.jpg` |
| Dapoer Bu Siti | Makanan | Nasi box, catering | Belum dikonfirmasi | `/images/umkm-dapoer.jpg` |

`whatsapp`: nomor contoh `6281200000001` dst. `TODO:` ganti nomor asli.

**5.6 Aspirasi demo — total 453 baris** (nama = "Warga Demo", `hp` = `081200000000`, tanggal acak 2025, lokasi tersebar antar dusun)

Sebaran **per kategori** (harus tepat, agar persen = 28/18/11/10/6 dan ranking top-5 sesuai gambar):
| Kategori | Jumlah |
|---|---|
| Infrastruktur | 127 |
| Pertanian | 83 |
| UMKM | 51 |
| Irigasi | 44 |
| Pemuda | 29 |
| Kesehatan 24, Pendidikan 22, Kebersihan 20, Keamanan 18, Sosial 15, Lainnya 20 | 119 |

Sebaran **dalam Infrastruktur** (`sub_kategori`) dan **jumlah aktif** (status bukan Selesai) untuk panel peta:
| Jenis | Total | Aktif (harus tepat) |
|---|---|---|
| Jalan (`Jalan`) | 60 | **22** |
| Lampu (`Lampu`) | 35 | 9 `TODO: angka di gambar tak terbaca` |
| Fasilitas Umum (`Fasilitas Umum`) | 20 | **4** |
| Sisanya (`Lainnya`) | 12 | bebas |

Kategori **Irigasi**: aktif **8**. Kategori **UMKM**: aktif **6**. Kategori lain: status campur bebas.
Aspirasi aktif yang punya `lat/lng` ≥ 20 buah (supaya pin tampil di peta).

**5.7 Aspirasi sorotan (wajib persis)**
- `kode` = `KD-2026-00127`, judul **Jalan rusak di Dusun Karanganyar**, kategori Infrastruktur, `sub_kategori` Jalan, dusun "Dusun Karanganyar", `created_at` = 2025-05-12, status **Diprioritaskan**.
- `aspirasi_status_log`: Diterima 2025-05-12, Diverifikasi 2025-05-14, Diprioritaskan 2025-05-20.
- `aspirasi_foto`: `/images/jalan-rusak-1.jpg` (urutan 0), `/images/jalan-rusak-2.jpg` (urutan 1).
- Baris lain memakai `kode` = `'KD-2026-' || lpad(i::text,5,'0')` untuk i = 1..453 kecuali i = 127. Setelah seed jalankan: `alter sequence seq_aspirasi_kode restart with 1000;`.
- Total baris `aspirasi` = 453 (452 generator + 1 sorotan).

**Kriteria Selesai**
- [ ] `select * from v_masalah_kategori` → Infrastruktur 127 (28%), Pertanian 83 (18%), UMKM 51 (11%), Irigasi 44 (10%), Pemuda 29 (6%).
- [ ] `select * from v_peta_ringkas` → jalan 22, irigasi 8, umkm 6, fasilitas 4, lampu 9.
- [ ] `KD-2026-00127` ada dengan 3 log status dan 2 foto.

---

## STEP 6 — Data Layer (klien, tipe, hooks)

1. `lib/supabase.ts`: `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`. Jika env kosong, tampilkan layar error jelas (bukan putih).
2. `types/db.ts`: tipe untuk semua tabel/view/RPC yang dipakai (tulis manual atau `supabase gen types`).
3. `lib/storage.ts`:
   - `fotoUrl(path)`: bila `path` diawali `/` kembalikan apa adanya (aset lokal); bila tidak, kembalikan URL publik bucket (`aspirasi-foto` untuk `uploads/…`, `konten` untuk lainnya).
   - `uploadFotoAspirasi(file)`: validasi JPG/PNG & ≤ 5 MB, upload ke `aspirasi-foto` di `uploads/{uuid}.{ext}`, kembalikan path.
4. `lib/format.ts`: `rupiah(n)` → `Rp 1.245.000.000`; `tanggalID(d)` → `12 Mei 2025`; `angka(n)` → `5.842`.
5. `lib/geo.ts`: `dusunTerdekat(lat,lng,dusun[])` (haversine).
6. `lib/constants.ts`: warna pin per jenis (`jalan` merah, `lampu` kuning, `irigasi` biru, `umkm` hijau, `fasilitas` ungu), fungsi `badgeStatus(status)`:
   - `Selesai` → "Selesai" (hijau); `Diterima` → "Diterima" (abu-biru); selain itu → **"Dalam Proses"** (oranye).
7. Semua hook di folder `hooks/` memakai TanStack Query, kunci cache jelas, `staleTime` 60 detik.
8. `lib/localState.ts`: `simpanKodeRiwayat(kode)`, `ambilKodeTerakhir()`; selalu dibungkus try/catch.

**Kriteria Selesai**
- [ ] Halaman uji sementara menampilkan `desa_profil.nama_desa` dari Supabase.
- [ ] `rupiah(1245000000)` = `Rp 1.245.000.000`.

---

## STEP 7 — Design System (Tailwind v4 `@theme` + komponen UI)

**7.1 Token di `@theme` (`src/index.css`)** — perkiraan dari gambar:

| Token | Nilai | Pemakaian |
|---|---|---|
| `--color-green-900` | `#06402B` | latar hero gelap |
| `--color-green-700` | `#0B6B3A` | tombol utama, tab aktif, ikon nav aktif |
| `--color-green-500` | `#22A559` | progress bar, centang timeline |
| `--color-green-50` | `#E8F5EC` | tombol soft, kotak info |
| `--color-blue-50/500` | `#E6F0FF` / `#3B82F6` | kartu Dusun, Irigasi |
| `--color-purple-50/500` | `#EFE9FF` / `#7C5CE6` | kartu RT/RW, Pemuda |
| `--color-orange-50/500` | `#FFF1E0` / `#F59E0B` | kartu UMKM, badge "Dalam Proses" |
| `--color-red-50/500` | `#FDE8E8` / `#EF4444` | Infrastruktur, titik notifikasi |
| `--color-ink-900` | `#14231B` | judul |
| `--color-ink-500` | `#6B7A72` | teks sekunder, placeholder |
| `--color-line` | `#E4EAE6` | border |
| `--color-page` | `#EEF3F7` | latar luar bingkai |
| `--font-sans` | Plus Jakarta Sans | seluruh teks |

**7.2 Tipografi:** judul app bar 16–17 px semibold; judul bagian 15 px bold; isi 13–14 px; label 11–12 px; judul hero 28–30 px bold.

**7.3 Komponen `components/ui/`:** `Button` (primary: hijau penuh tinggi 48 px radius 12; outline; soft), `Card` (putih, radius 14, border, shadow halus), `Chip` (aktif hijau penuh), `Tabs` (pil 2–4 segmen, aktif hijau penuh, bisa scroll horizontal), `Badge`, `Input/Select/Textarea` (border line, radius 10, status error merah), `ProgressBar`, `Toast` + `useToast`, `Skeleton`, `EmptyState`, `ErrorState`.

**Kriteria Selesai**
- [ ] Halaman `/__ui` sementara (hapus di STEP 21) menampilkan semua komponen.
- [ ] Token warna hanya didefinisikan di `@theme`, tidak ada hex tersebar di komponen.

---

## STEP 8 — Layout, Router, Bottom Nav

**8.1 `MobileFrame`:** lebar maks 390 px, tinggi penuh viewport, di tengah desktop, latar luar `--color-page`, konten area scroll sendiri; bottom nav menempel bawah bingkai.

**8.2 Route di `App.tsx`:** sesuai tabel bagian 1. Urutan: `/aspirasi/baru` sebelum `/aspirasi/:kode`. Tambahkan `ScrollToTop`.

**8.3 `BottomNav` (5 item)**
| Slot | Label | Ikon | Route |
|---|---|---|---|
| 1 | Beranda | rumah | `/beranda` |
| 2 | Aspirasi | megafon | `/aspirasi/baru` |
| 3 | Peta | peta | `/peta` |
| 4 | dinamis | dinamis | dinamis |
| 5 | Menu | hamburger | `/menu` |

Slot 4 dinamis menurut route aktif:
| Route | Label | Ikon | Rute tujuan slot |
|---|---|---|---|
| `/program`, `/masalah`, `/tanya`, `/welcome`, `/beranda`, `/peta`, `/menu` | Program | dokumen | `/program` |
| `/transparansi` | Transparansi | perisai/grafik | `/transparansi` |
| `/potensi` | Potensi | daun | `/potensi` |
| `/umkm` | UMKM | toko | `/umkm` |

Item aktif: ikon dalam kotak hijau penuh + label hijau tebal. Di `/masalah` dan `/tanya`, slot 4 "Program" aktif. Nav **tidak dirender** di `/aspirasi/baru` dan `/aspirasi/:kode`.

**Kriteria Selesai**
- [ ] Semua route terbuka (placeholder cukup) dan nav aktif sesuai tabel bagian 1.
- [ ] Refresh di route dalam (mis. `/peta`) tetap berfungsi (dev server + `vercel.json`).
- [ ] Layar 3 & 4 tanpa bottom nav.

---

## STEP 9 — Layar 1: Sambutan  `/welcome` (`WelcomePage.tsx`)

**Data:** `desa_profil` (opsional: nama & tagline).

**Layout (atas → bawah)**
1. Latar penuh foto `hero-desa.jpg` (gapura "DESA KARANGANYAR", gunung) + gradasi hijau gelap makin pekat ke bawah.
2. Kiri atas: logo desa (±48 px) + teks **Karanganyar Digital** (judul) dan **Data, Aspirasi, dan Masa Depan Desa** (kecil).
3. Kanan atas: ikon hamburger putih.
4. Blok teks utama rata kiri, putih. Judul 4 baris:
   ```
   Satu Desa.
   Satu Data.
   Satu Ruang untuk
   Bersama.
   ```
   Paragraf: *"Temukan informasi desa, sampaikan aspirasi, lihat progres pembangunan, dan ikuti perkembangan Karanganyar."*
5. Tombol hijau penuh **Jelajahi Desa →**.
6. Bottom nav gaya terang di atas hero (Beranda aktif).

**Interaksi:** tombol → `/beranda`; ☰ → `/menu`.

**Kriteria Selesai**
- [ ] Teks 4 baris persis; kontras teks terbaca di atas foto.

---

## STEP 10 — Layar 2: Beranda  `/beranda` (`BerandaPage.tsx`)

**Data:** `desa_profil`, `count(dusun)`, `notifikasi` (titik merah bila ada), cuaca (`useCuaca`: Open-Meteo memakai `lat/lng` profil; bila gagal pakai kolom `cuaca_*`).

**Layout**
1. **Header:** logo + **Karanganyar Digital** (tebal) + baris kecil `wilayah_teks`. Kanan: ikon lonceng (titik merah) dan avatar bulat `avatar-warga.jpg`.
2. **Kolom pencarian** ikon kaca pembesar, placeholder *"Cari informasi, program, atau layanan desa..."*.
3. Judul bagian **Data Karanganyar** (kiri) + tautan **Lihat Semua >** (kanan, hijau).
4. **Grid kartu pastel** (komponen `StatCard`):
   | Kartu | Nilai | Satuan | Warna | Sumber |
   |---|---|---|---|---|
   | Jumlah Penduduk | 5.842 | jiwa | hijau | `jumlah_penduduk` |
   | Dusun | 12 | Dusun | biru | `count(dusun)` |
   | RT / RW | 42 / 12 | RT / RW | ungu | `jumlah_rt` / `jumlah_rw` |
   | UMKM | 86 | UMKM | oranye | `jumlah_umkm` |
   | Potensi Desa | teks kecil "Pertanian, Peternakan, UMKM, Wisata" | | hijau, ikon daun | statis |
5. **Kartu cuaca** (`WeatherCard`): ikon matahari-berawan, **Cuaca Hari Ini**, **28°C**, **Cerah Berawan**, kanan **H: 32°  L: 22°**.
6. Judul **Akses Cepat** + 4 ikon bulat berlabel: **Peta Masalah**, **Program Desa**, **Aspirasi**, **Layanan Desa**.

**Interaksi**
- Lonceng & avatar → `/menu`. Lihat Semua → `/potensi`.
- Pencarian: hanya input (tanpa hasil di v2).
- Akses Cepat: Peta Masalah → `/peta`; Program Desa → `/program`; Aspirasi → `/aspirasi/baru`; Layanan Desa → toast "Segera hadir".
- Kartu Dusun → `/peta`; kartu UMKM → `/umkm`; kartu Potensi Desa → `/potensi`.

**Kriteria Selesai**
- [ ] Semua angka berasal dari database dan sama dengan tabel.
- [ ] Tidak ada overflow horizontal di 390 px.

---

## STEP 11 — Layar 3: Sampaikan Aspirasi  `/aspirasi/baru` (`AspirasiBaruPage.tsx`)

**Tanpa bottom nav.** App bar: ← + **Sampaikan Aspirasi**.

**Data:** `kategori` (opsi select), `dusun`. **Mutasi:** `useKirimAspirasi`.

**Isi (atas → bawah)**
1. Pengantar: *"Bersama kita bisa membangun Karanganyar lebih baik."*
2. Field (react-hook-form + zod):
   | Label | Tipe | Placeholder | Aturan |
   |---|---|---|---|
   | Nama | input teks | *Masukkan nama Anda* | wajib, 2–100 |
   | Nomor HP | input tel | *08xxxxxxxxxx* | wajib, `^08\d{8,12}$` |
   | Kategori | select | *Pilih kategori* | wajib, opsi dari tabel `kategori` |
   | Lokasi | tombol-input + ikon pin di kanan | *Pilih lokasi di peta* | opsional |
   | Judul | input teks | *Contoh: Jalan rusak di Dusun Karanganyar* | wajib, 5–150 |
   | Deskripsi | textarea ±4 baris | *Jelaskan masalah dengan detail...* | wajib, 10–2000 |
   | Upload Foto (opsional) | kotak + tombol `Pilih Foto` (ikon kamera) | bantuan kecil: *Maks. 5MB (JPG/PNG)* | JPG/PNG, ≤ 5 MB, maks 2 foto |
3. Tombol hijau penuh **Kirim Aspirasi**.

**Alur kirim**
1. Validasi → error merah di bawah field ("Wajib diisi" dst.).
2. Bila ada foto → `uploadFotoAspirasi` tiap file.
3. Panggil RPC `kirim_aspirasi` (lokasi: `lat/lng` dari picker, `dusun_id` dari `dusunTerdekat`, `lokasi_teks` = nama dusun).
4. Sukses → simpan kode ke localStorage, toast **"Aspirasi terkirim"**, navigasi ke `/aspirasi/{kode}`.
5. Gagal → toast pesan galat (mis. batas 5 aspirasi/24 jam). Tombol disabled + loading saat proses.
6. Anti-spam ringan: field tersembunyi *honeypot*; bila terisi, abaikan kirim.

**Lokasi:** menekan field membuka bottom sheet `LocationPicker` (peta Leaflet kecil, geser pin, tombol "Pilih"). Ini komponen fungsional tambahan; gayanya sederhana mengikuti design system. Hasil: field menampilkan nama dusun terdekat.

**Kriteria Selesai**
- [ ] Semua label & placeholder persis.
- [ ] Aspirasi baru tersimpan di DB (cek via Studio), HP tersimpan tetapi tidak muncul di `aspirasi_publik`.
- [ ] File > 5 MB atau bukan JPG/PNG ditolak dengan pesan jelas.
- [ ] Setelah kirim, halaman detail menampilkan kode baru dengan langkah "Diterima" selesai.

---

## STEP 12 — Layar 4: Detail Aspirasi  `/aspirasi/:kode` (`AspirasiDetailPage.tsx`)

**Tanpa bottom nav.** App bar: ← + **Detail Aspirasi**.

**Data:** `aspirasi_publik` (by `kode`), `aspirasi_foto`, `aspirasi_status_log`. Kode tidak ditemukan → `EmptyState` "Aspirasi tidak ditemukan".

**Isi**
1. Baris atas: badge kode (**KD-2026-00127**, abu-hijau) kiri; badge status kanan via `badgeStatus` (contoh gambar: **Dalam Proses**, oranye).
2. Judul: **Jalan rusak di Dusun Karanganyar**.
3. Meta (ikon + teks): **Infrastruktur  |  Jalan**; **Dusun Karanganyar**; **12 Mei 2025**.
4. `PhotoCarousel`: foto lebar penuh radius 12, scroll-snap, penanda **1/2** di pojok kanan bawah (berubah saat digeser). Tanpa foto → bagian disembunyikan.
5. Judul bagian **Status Penanganan** → `StatusTimeline` vertikal, 6 langkah tetap:
   | Langkah | Tampilan |
   |---|---|
   | Diterima | centang hijau + tanggal bila ada log |
   | Diverifikasi | idem |
   | Diprioritaskan | idem |
   | Dalam Perencanaan | lingkaran abu (belum) |
   | Dikerjakan | lingkaran abu |
   | Selesai | lingkaran abu |
   Garis penghubung hijau antar langkah selesai, abu sisanya. Format tanggal `12 Mei 2025`. Langkah selesai = ada baris di `aspirasi_status_log`.
6. Tombol outline hijau **Lihat di Peta** (ikon pin) → `/peta?fokus={kode}`.

**Catatan:** ID memuat "2026" sementara tanggal 2025 — **biarkan persis seperti gambar**.

**Kriteria Selesai**
- [ ] `/aspirasi/KD-2026-00127` sama dengan gambar: 3 langkah centang, 3 abu, foto 1/2.
- [ ] Aspirasi buatan pengguna tampil dengan hanya "Diterima" tercentang.

---

## STEP 13 — Layar 5: Peta Masalah Desa  `/peta` (`PetaPage.tsx`)

**Nav: Peta aktif.** App bar: ← + **Peta Masalah Desa**.

**Data:** `usePetaPin` (aspirasi_publik aktif, punya lat/lng, maks 200), `usePetaRingkas`, `dusun`, `desa_profil` (pusat peta).

**Layout**
1. Baris chip filter (scroll horizontal): **Semua** (aktif), **Jalan**, **Lampu**, **Irigasi**, **UMKM**, **Fasilitas**.
2. **Peta** memenuhi layar: Leaflet, tile satelit Esri `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` (atribusi Esri ditampilkan kecil). Matikan kontrol zoom bawaan. Label dusun putih (tooltip permanen) di koordinat dusun: **Dusun Karanganyar**, **Dusun Ngemplak**, **Dusun Bareng** dan dusun lain.
3. Pin `divIcon` berwarna per jenis: jalan merah, lampu kuning, irigasi biru, UMKM hijau, fasilitas ungu.
4. Kontrol kanan: **+**, **−** (bulat putih), dan tombol lokasi saya (target; geolocation, izin ditolak → toast).
5. **Bottom sheet** di atas bottom nav (daftar dari `v_peta_ringkas`):
   | Warna | Judul | Jumlah |
   |---|---|---|
   | merah | Jalan rusak | 22 laporan |
   | kuning | Lampu mati | 9 laporan |
   | biru | Irigasi | 8 laporan |
   | hijau | UMKM | 6 laporan |
   | ungu | Fasilitas umum | 4 laporan |
   Tiap baris ada panah `>`.

**Interaksi**
- Chip menyaring pin; **Semua** = tampil semua.
- Klik baris panel = aktifkan filter jenis tersebut.
- Klik pin → popup kecil: judul + tombol "Lihat Detail" → `/aspirasi/{kode}`.
- Query `?fokus={kode}`: peta zoom ke pin itu dan membuka popup.

**Kriteria Selesai**
- [ ] Pin tampil dari database, filter bekerja, zoom +/− bekerja.
- [ ] Angka panel = 22 / 9 / 8 / 6 / 4.
- [ ] Tidak ada ikon marker rusak (tanpa gambar default Leaflet).

---

## STEP 14 — Layar 6: Masalah Terbanyak  `/masalah` (`MasalahPage.tsx`)

**Nav: Program aktif.** App bar: ← + **Masalah Terbanyak**.

**Data:** `v_masalah_kategori` (urut jumlah menurun), `v_masalah_dusun`.

**Isi**
1. Tab **Kategori** (aktif) | **Wilayah**.
2. Daftar `ProblemRow` (ikon bulat berwarna, judul, "N laporan", persen kanan, progress bar):
   | Kategori | Jumlah | Persen | Warna |
   |---|---|---|---|
   | Infrastruktur | 127 laporan | 28% | merah |
   | Pertanian | 83 laporan | 18% | hijau |
   | UMKM | 51 laporan | 11% | oranye |
   | Irigasi | 44 laporan | 10% | biru |
   | Pemuda | 29 laporan | 6% | ungu |
   Default tampil **5 teratas**.
3. Tombol soft hijau **Lihat Semua** → menampilkan semua 11 kategori.
4. Kotak info hijau muda + ikon: *"Data ini membantu kami memahami kebutuhan masyarakat dalam perencanaan pembangunan."*

**Interaksi:** tab **Wilayah** → daftar per dusun (format baris sama, data `v_masalah_dusun`).
**Akses ke layar ini:** dari bagian kartu/menu (tambahkan tautan "Lihat Semua" di panel Peta atau tombol di Program bila diperlukan; minimal bisa dibuka lewat URL dan dari tombol **Lihat Semua** pada Peta `TODO: konfirmasi pengguna`).

**Kriteria Selesai**
- [ ] Angka & persen sama dengan tabel; panjang bar proporsional dengan persen.

---

## STEP 15 — Layar 7: Program Desa  `/program` (`ProgramPage.tsx`)

**Nav: Program aktif.** App bar: ← + **Program Desa**.

**Data:** `program` (prioritas), `roadmap`.

**Isi**
1. Tab **Program Prioritas** (aktif) | **Roadmap 5 Tahun**.
2. Tiga `ProgramCard` (foto kiri, teks kanan):
   | Program | Badge kategori | Badge status | Target | Realisasi | Progres |
   |---|---|---|---|---|---|
   | Perbaikan Jalan Desa | Infrastruktur (merah) | Dalam Proses (oranye) | 500 m | 375 m | 78% |
   | Pengembangan UMKM | Ekonomi (oranye) | Perencanaan (biru/ungu) | 50 UMKM | 12 | 24% |
   | Program Pertanian Modern | Pertanian (hijau) | Berjalan (hijau) | 100 ha | 40 ha | 40% |
   Format: judul tebal; baris badge; teks *"Target: … | Realisasi: …"*; progress bar + persen kanan.
   **Catatan:** 375/500 = 75%, tetapi tampilkan **78%** (`progres_persen`) persis seperti gambar.
3. Tab **Roadmap 5 Tahun**: daftar linimasa Tahun 1–5 dari tabel `roadmap`.

**Interaksi:** klik kartu → toast "Detail program segera hadir".

**Kriteria Selesai**
- [ ] Tiga kartu persis tabel; data dari DB.

---

## STEP 16 — Layar 8: Transparansi Desa  `/transparansi` (`TransparansiPage.tsx`)

**Nav: slot 4 "Transparansi" aktif.** App bar: ← + **Transparansi Desa**.

**Data:** `anggaran_item` (tahun 2026), `anggaran_realisasi`.

**Isi**
1. Tab **APBDes** | **Pembangunan** (aktif default, sesuai gambar) | **Realisasi**.
2. **Kartu Pendapatan Desa:** label **Pendapatan Desa**, nilai **Rp 1.245.000.000** (jumlah nominal), `StackedBar` multiwarna, legenda:
   | Sumber | Persen | Warna |
   |---|---|---|
   | Dana Desa | 45% | oranye |
   | Alokasi Dana Desa | 30% | hijau |
   | Bagi Hasil Pajak | 15% | coklat |
   | Pendapatan Lainnya | 10% | ungu |
3. **Kartu Belanja Desa:** label **Belanja Desa**, nilai **Rp 1.245.000.000**, `Donut` (kiri) + legenda (kanan):
   | Bidang | Persen | Warna |
   |---|---|---|
   | Pembangunan | 55% | abu-hijau |
   | Pemberdayaan | 20% | oranye |
   | Pemdes | 15% | ungu |
   | Pembinaan | 10% | biru |
4. Tombol hijau penuh **Lihat Detail Anggaran**.

Persen dihitung dari `nominal / total`. Tab **APBDes** dan **Realisasi**: tampilkan kartu sederhana (tabel pagu vs realisasi dari `anggaran_realisasi`) agar tab tidak kosong.

**Interaksi:** **Lihat Detail Anggaran** → toast "Detail anggaran segera hadir".

**Kriteria Selesai**
- [ ] Segmen bar dan donut sesuai persen; total 100%.

---

## STEP 17 — Layar 9: Potensi Desa  `/potensi` (`PotensiPage.tsx`)

**Nav: slot 4 "Potensi" aktif.** App bar: ← + **Potensi Desa**.

**Data:** `potensi` (filter `kategori`).

**Isi**
1. Tab 4 segmen (scroll horizontal): **Pertanian** (aktif) | **Peternakan** | **UMKM** | **Pemuda**.
2. **Kartu Pertanian:**
   - Foto sawah lebar penuh + lencana hijau pojok (ikon daun + **Pertanian**).
   - Baris **Komoditas utama** → *Padi, Jagung, Kedelai*.
   - Dua kolom: **Luas Lahan** → *± 1,250 ha*; **Kelompok Tani** → *12 kelompok* (dari `metrik`).
   - Tombol soft **Lihat Detail**.
3. **Kartu Peternakan** di bawahnya (terpotong): foto + lencana ikon + **Peternakan**.

**Interaksi:** tab mengganti kartu aktif; tab **UMKM** boleh menuju `/umkm`; **Lihat Detail** → toast.

**Kriteria Selesai**
- [ ] Teks "± 1,250 ha" persis; kartu dirender dari `metrik`.

---

## STEP 18 — Layar 10: Direktori UMKM  `/umkm` (`UmkmPage.tsx`)

**Nav: slot 4 "UMKM" aktif.** App bar: ← + **Direktori UMKM**.

**Data:** `umkm` (aktif) + nama dusun.

**Isi**
1. Pencarian: *"Cari nama usaha atau kategori..."*.
2. Chip: **Semua** (aktif), **Makanan**, **Kerajinan**, **Fashion**.
3. `UmkmCard` (foto kotak kiri, teks tengah, ikon WhatsApp hijau kanan):
   | Nama | Badge | Produk | Lokasi |
   |---|---|---|---|
   | Keripik Pisang Sari Rasa | Makanan | Keripik pisang | Dusun Karanganyar |
  | Batik Lestari | Kerajinan | Batik tulis | Belum dikonfirmasi |
  | Dapoer Bu Siti | Makanan | Nasi box, catering | Belum dikonfirmasi |
   Format: *"Produk: …"* dan ikon pin sebelum lokasi.

**Interaksi:** pencarian (nama/kategori/produk, tanpa membedakan huruf besar-kecil) + chip memfilter langsung di sisi klien; ikon WhatsApp → `https://wa.me/{whatsapp}` di tab baru (disembunyikan bila kosong).

**Kriteria Selesai**
- [ ] Filter + pencarian bekerja pada 3 data; hasil kosong menampilkan `EmptyState`.

---

## STEP 19 — Layar 11: Tanya Karanganyar  `/tanya` (`TanyaPage.tsx`)

**Nav: Program aktif.** App bar: ← + **Tanya Karanganyar**.

**Data:** RPC `tanya_karanganyar` (mutation `useTanya`).

**Isi**
1. Gelembung sambutan + avatar robot hijau: **Halo! Saya Tanya Karanganyar** / *"Asisten informasi desa. Silakan tanyakan apa yang Anda butuhkan."*
2. Label **Contoh pertanyaan:** + 4 chip klik:
   - *Ada program UMKM apa?*
   - *Bagaimana cara mengurus surat?*
   - *Kapan perbaikan jalan Dusun X?*
   - *Informasi potensi pertanian?*
3. Kotak input bawah: placeholder *"Tulis pertanyaan Anda..."* + tombol kirim hijau (ikon pesawat kertas).

**Interaksi**
- Kirim/klik chip → gelembung pengguna (kanan) muncul, indikator mengetik, lalu gelembung jawaban (kiri) dari RPC.
- Input kosong tidak terkirim. Tombol disabled saat menunggu. Gagal → gelembung "Maaf, terjadi kendala. Coba lagi."
- Riwayat percakapan hanya di state halaman (hilang saat refresh).

**Kriteria Selesai**
- [ ] Keempat chip menghasilkan jawaban dari FAQ; pertanyaan lain menghasilkan jawaban fallback.
- [ ] Baris tercatat di `chat_log`.

---

## STEP 20 — Layar 12: Menu / Profil  `/menu` (`MenuPage.tsx`)

**Nav: Menu aktif.**

**Data:** `notifikasi` (jumlah untuk badge).

**Isi**
1. Header: avatar bulat kiri; **Halo, Warga** (tebal) + **Pengguna** (kecil); kanan ikon gerigi.
2. Daftar menu (`MenuList`: ikon kiri, label, panah `>`):
   | Menu | Keterangan |
   |---|---|
   | Notifikasi | badge merah **3** (jumlah baris `notifikasi`) |
   | Akun Saya | |
   | Riwayat Aspirasi | → `/aspirasi/{kode terakhir}`; bila belum ada → `/aspirasi/KD-2026-00127` |
   | Pengaturan | |
   | Tentang Aplikasi | |
3. Banner bawah: foto `banner-menu.jpg` + gradasi gelap, teks putih **Bersama Membangun Karanganyar yang Lebih Baik**, tombol hijau **Sampaikan Aspirasi →**.

**Interaksi:** banner → `/aspirasi/baru`; Notifikasi, Akun Saya, Pengaturan, Tentang Aplikasi, dan gerigi → toast "Segera hadir".

**Kriteria Selesai**
- [ ] Badge "3" muncul dari database; banner dan Riwayat Aspirasi berfungsi.

---

## STEP 21 — QA Akhir & Deploy

**Kesesuaian dengan gambar**
- [ ] 12 layar ada, route sesuai bagian 1, teks (judul, label, placeholder, angka) persis dokumen.
- [ ] Layar 3 & 4 tanpa bottom nav; layar lain nav aktif benar (bagian 8.3).
- [ ] Warna, radius, bayangan konsisten dengan STEP 7. Tidak ada scroll horizontal pada 390 px (kecuali chip & tab).
- [ ] Semua tombol punya tindakan (navigasi atau toast).
- [ ] Tidak ada fitur di luar dokumen (kecuali `LocationPicker`, bagian STEP 11).

**Teknis & keamanan**
- [ ] `npm run build` dan `tsc --noEmit` bersih; tidak ada `console.error`.
- [ ] Tidak ada `service_role` key di repo; `.env.local` tidak ter-commit.
- [ ] Anon **tidak bisa** membaca `aspirasi`, `faq`, `chat_log`; tidak ada kolom HP/nama di respons publik mana pun.
- [ ] Setiap halaman punya skeleton loading, `ErrorState`, dan `EmptyState` yang relevan.
- [ ] Hapus halaman `/__ui` sementara.

**Alur uji manual**
`/welcome` → Jelajahi Desa → `/beranda` → Aspirasi → isi form + foto → Kirim → `/aspirasi/{kode baru}` → Lihat di Peta → `/peta` → `/program` → `/transparansi` → `/potensi` → `/umkm` → `/tanya` (klik 4 chip) → `/menu` → Riwayat Aspirasi.

**Deploy (opsional, bila diminta):** Vercel; set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`; `vercel.json` rewrite SPA sudah ada.

---

## LAMPIRAN A — Ketidakkonsistenan Gambar (JANGAN "DIPERBAIKI")

| Temuan | Perlakuan |
|---|---|
| ID `KD-2026-00127` vs tanggal 2025 | Biarkan persis (seed memakai tanggal 2025) |
| Program Jalan 375/500 tetapi 78% | Simpan & tampilkan 78% |
| Pendapatan dan Belanja sama-sama Rp 1.245.000.000 | Biarkan (anggaran seimbang) |
| Teks kecil kecamatan/kabupaten tak terbaca | `TODO:` isi `desa_profil.wilayah_teks` |
| Jumlah "Lampu mati" & "UMKM" di panel peta tak jelas | Lampu 9 (contoh); UMKM 6 |
| Jumlah UMKM di Beranda (86) tak jelas | Pakai 86 (kolom `jumlah_umkm`) |

## LAMPIRAN B — Di Luar Cakupan

Panel admin (data dikelola lewat Supabase Studio), login/registrasi warga, notifikasi push, pencarian global di Beranda, halaman Layanan Desa, chatbot berbasis LLM, pembayaran, halaman detail program/potensi/UMKM, multi-bahasa.

## LAMPIRAN C — Urutan Kerja Ringkas untuk Agent

1 Init proyek → 2 Skema → 3 View & RPC → 4 RLS & Storage → 5 Seed → 6 Data layer → 7 Design system → 8 Layout & router → 9–20 Layar 1–12 (berurutan) → 21 QA & deploy.
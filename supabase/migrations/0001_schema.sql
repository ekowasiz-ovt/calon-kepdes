create extension if not exists pgcrypto;

-- Profil desa (satu baris)
create table public.desa_profil (
  id int primary key default 1 check (id = 1),
  nama_desa text not null default 'Karanganyar',
  wilayah_teks text not null default 'Desa Karanganyar, Kec. Geyer, Kab. Grobogan',
  tagline text not null default 'Data, Aspirasi, dan Masa Depan Desa',
  jumlah_penduduk int not null default 5842,
  jumlah_rt int not null default 42,
  jumlah_rw int not null default 12,
  jumlah_umkm int not null default 86,
  lat numeric(9,6) not null default -7.216100,
  lng numeric(9,6) not null default 111.019700,
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
  sub_kategori text,
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
  storage_path text not null,
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
  kategori text not null,
  status text not null check (status in ('Perencanaan','Berjalan','Dalam Proses','Selesai')),
  target_teks text not null,
  realisasi_teks text not null,
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
  metrik jsonb not null default '[]',
  urutan smallint not null default 0
);

create table public.umkm (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null check (kategori in ('Makanan','Kerajinan','Fashion')),
  produk text not null,
  dusun_id smallint references public.dusun(id),
  whatsapp text,
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
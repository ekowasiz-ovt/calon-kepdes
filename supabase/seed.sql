-- Seed data contoh untuk Karanganyar Digital

insert into public.desa_profil (
  id, nama_desa, wilayah_teks, tagline, jumlah_penduduk, jumlah_rt, jumlah_rw,
  jumlah_umkm, lat, lng, cuaca_suhu, cuaca_kondisi, cuaca_max, cuaca_min
) values (
  1, 'Karanganyar', 'Desa Karanganyar, Kec. Geyer, Kab. Grobogan',
  'Data, Aspirasi, dan Masa Depan Desa', 5842, 42, 12, 86,
  -7.216100, 111.019700, 28, 'Cerah Berawan', 32, 22
) on conflict (id) do update set
  nama_desa = excluded.nama_desa,
  wilayah_teks = excluded.wilayah_teks,
  tagline = excluded.tagline,
  jumlah_penduduk = excluded.jumlah_penduduk,
  jumlah_rt = excluded.jumlah_rt,
  jumlah_rw = excluded.jumlah_rw,
  jumlah_umkm = excluded.jumlah_umkm,
  lat = excluded.lat,
  lng = excluded.lng,
  cuaca_suhu = excluded.cuaca_suhu,
  cuaca_kondisi = excluded.cuaca_kondisi,
  cuaca_max = excluded.cuaca_max,
  cuaca_min = excluded.cuaca_min;

update public.dusun set nama = '__seed_reconcile__' || id::text;

with dusun_seed (nama, lat, lng, urutan) as (
  values
    ('Dusun Karanganyar', -7.2161::numeric, 111.0197::numeric, 1),
    ('Dusun Ngemplak', -7.2181, 111.0177, 2),
    ('Dusun Bareng', -7.2141, 111.0247, 3),
    ('Dusun Kedungbamban', -7.2121, 111.0117, 4),
    ('Dusun Diren', -7.2201, 111.0187, 5),
    ('Dusun Dalon', -7.2111, 111.0317, 6),
    ('Dusun Gadingan', -7.2231, 111.0257, 7),
    ('Dusun Jurug', -7.2091, 111.0167, 8),
    ('Dusun Wani', -7.2171, 111.0107, 9),
    ('Dusun Dayu', -7.2131, 111.0297, 10),
    ('Dusun Geneng', -7.2211, 111.0227, 11)
)
update public.dusun d set
  nama = s.nama,
  lat = s.lat,
  lng = s.lng,
  urutan = s.urutan
from dusun_seed s
where d.urutan = s.urutan;

with dusun_seed (nama, lat, lng, urutan) as (
  values
    ('Dusun Karanganyar', -7.2161::numeric, 111.0197::numeric, 1),
    ('Dusun Ngemplak', -7.2181, 111.0177, 2),
    ('Dusun Bareng', -7.2141, 111.0247, 3),
    ('Dusun Kedungbamban', -7.2121, 111.0117, 4),
    ('Dusun Diren', -7.2201, 111.0187, 5),
    ('Dusun Dalon', -7.2111, 111.0317, 6),
    ('Dusun Gadingan', -7.2231, 111.0257, 7),
    ('Dusun Jurug', -7.2091, 111.0167, 8),
    ('Dusun Wani', -7.2171, 111.0107, 9),
    ('Dusun Dayu', -7.2131, 111.0297, 10),
    ('Dusun Geneng', -7.2211, 111.0227, 11)
)
insert into public.dusun (nama, lat, lng, urutan)
select s.nama, s.lat, s.lng, s.urutan
from dusun_seed s
where not exists (
  select 1 from public.dusun d where d.urutan = s.urutan
);

delete from public.dusun where urutan > 11;

insert into public.kategori (nama, urutan) values
  ('Infrastruktur', 1),
  ('Pertanian', 2),
  ('UMKM', 3),
  ('Irigasi', 4),
  ('Pemuda', 5),
  ('Kesehatan', 6),
  ('Pendidikan', 7),
  ('Kebersihan', 8),
  ('Keamanan', 9),
  ('Sosial', 10),
  ('Lainnya', 11)
on conflict (nama) do nothing;

insert into public.notifikasi (judul, isi) values
  ('Perbaikan Jalan', 'Progres perbaikan jalan desa sudah mencapai 78%.'),
  ('UMKM Desa', 'Program penguatan UMKM desa mulai dibuka untuk pendaftaran.'),
  ('Program Pertanian', 'Pendampingan usaha tani akan dimulai minggu depan.')
on conflict do nothing;

-- Dana Desa TA 2025 dari SIKD DJPK; angka sumber ribuan dikonversi ke rupiah.
insert into public.anggaran_item (tahun, jenis, nama, nominal, urutan)
select s.tahun, s.jenis, s.nama, s.nominal, s.urutan
from (values
  (2025::smallint, 'pendapatan', 'Alokasi Dasar Dana Desa', 741136000::bigint, 1::smallint),
  (2025::smallint, 'pendapatan', 'Alokasi Afirmasi Dana Desa', 0::bigint, 2::smallint),
  (2025::smallint, 'pendapatan', 'Alokasi Kinerja Dana Desa', 0::bigint, 3::smallint),
  (2025::smallint, 'pendapatan', 'Alokasi Formula Dana Desa', 892500000::bigint, 4::smallint)
) as s(tahun, jenis, nama, nominal, urutan)
where not exists (
  select 1 from public.anggaran_item a
  where a.tahun = s.tahun and a.jenis = s.jenis and a.nama = s.nama
);

insert into public.faq (pertanyaan, jawaban, kata_kunci) values
  ('Ada program UMKM apa?', 'Program Pengembangan UMKM sedang dalam tahap perencanaan dengan target 50 UMKM. Saat ini 12 sudah terealisasi.', array['umkm','usaha']),
  ('Bagaimana cara mengurus surat?', 'Silakan datang ke kantor desa pada jam pelayanan dengan membawa KTP dan KK. Layanan online akan segera hadir.', array['surat','mengurus']),
  ('Kapan perbaikan jalan Dusun X?', 'Program Perbaikan Jalan Desa sedang berjalan: realisasi 375 m dari target 500 m (78%). Jadwal per dusun akan diumumkan pemerintah desa.', array['jalan','perbaikan']),
  ('Informasi potensi pertanian?', 'Komoditas utama Padi, Jagung, dan Kedelai dengan luas lahan ± 1,250 ha dan 12 kelompok tani.', array['pertanian','tani','sawah'])
on conflict do nothing;

insert into public.program (judul, kategori, status, target_teks, realisasi_teks, progres_persen, foto_path, prioritas, urutan) values
  ('Perbaikan Jalan Desa', 'Infrastruktur', 'Dalam Proses', '500 m', '375 m', 78, '/images/program-jalan.jpg', true, 1),
  ('Pengembangan UMKM', 'Ekonomi', 'Perencanaan', '50 UMKM', '12', 24, '/images/program-umkm.jpg', true, 2),
  ('Program Pertanian Modern', 'Pertanian', 'Berjalan', '100 ha', '40 ha', 40, '/images/program-pertanian.jpg', true, 3)
on conflict do nothing;

insert into public.roadmap (tahun, judul, deskripsi, urutan) values
  (1, 'Peningkatan Infrastruktur', 'Perbaikan jalan, saluran air, dan fasilitas umum.', 1),
  (2, 'Penguatan UMKM', 'Peningkatan kapasitas produksi dan pemasaran digital.', 2),
  (3, 'Pertanian Berkelanjutan', 'Optimalisasi lahan dan pendampingan kelompok tani.', 3),
  (4, 'Kesehatan dan Pendidikan', 'Pemantapan layanan dasar masyarakat.', 4),
  (5, 'Digitalisasi Desa', 'Pemanfaatan data dan pelayanan berbasis teknologi.', 5)
on conflict do nothing;

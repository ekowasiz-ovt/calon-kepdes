-- STEP 3 — View & RPC

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

create view public.v_masalah_kategori with (security_invoker = false) as
select k.id, k.nama, count(a.id)::int as jumlah,
       round(100.0 * count(a.id) / nullif(sum(count(a.id)) over (), 0))::int as persen
from public.kategori k
left join public.aspirasi a on a.kategori_id = k.id
group by k.id, k.nama;

create view public.v_masalah_dusun with (security_invoker = false) as
select d.id, d.nama, count(a.id)::int as jumlah,
       round(100.0 * count(a.id) / nullif(sum(count(a.id)) over (), 0))::int as persen
from public.dusun d
left join public.aspirasi a on a.dusun_id = d.id
group by d.id, d.nama;

create view public.v_peta_ringkas with (security_invoker = false) as
select jenis, count(*)::int as jumlah
from public.aspirasi_publik
where status <> 'Selesai' and jenis <> 'lainnya'
group by jenis;

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

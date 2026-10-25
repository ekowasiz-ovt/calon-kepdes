-- STEP 5 — Dukungan warga
-- Data pribadi: NAMA + DUSUN. Tidak ada NIK, nomor HP, atau alamat lengkap.
-- Tabel TIDAK bisa dibaca anon; publik hanya melihat agregat lewat view.

create table public.dukungan (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 80),
  dusun_id smallint not null references public.dusun(id),
  created_at timestamptz not null default now()
);
create index on public.dukungan (dusun_id);
create index on public.dukungan (created_at desc);

alter table public.dukungan enable row level security;

-- Sama seperti aspirasi & chat_log: tanpa policy select untuk anon.
revoke all on public.dukungan from anon, authenticated;

create view public.v_dukungan_ringkas with (security_invoker = false) as
select count(*)::int as total,
       count(distinct dusun_id)::int as jumlah_dusun
from public.dukungan;

create or replace function public.kirim_dukungan(p_nama text, p_dusun_id int)
returns int
language plpgsql security definer set search_path = public as $$
declare v_total int;
begin
  if char_length(trim(p_nama)) < 2 then
    raise exception 'Nama minimal 2 karakter.';
  end if;

  if not exists (select 1 from dusun where id = p_dusun_id) then
    raise exception 'Dusun tidak dikenal.';
  end if;

  -- TODO: batas tanpa nomor HP hanya "1 nama per dusun", jadi nama kembar tertolak.
  -- Bila perlu, tambahkan kolom ip_hash atau verifikasi WhatsApp.
  if exists (select 1 from dukungan
             where dusun_id = p_dusun_id and lower(nama) = lower(trim(p_nama))) then
    raise exception 'Nama ini sudah tercatat mendukung di dusun tersebut.';
  end if;

  insert into dukungan (nama, dusun_id) values (trim(p_nama), p_dusun_id);

  select count(*)::int into v_total from dukungan;
  return v_total;
end $$;

revoke all on function public.kirim_dukungan from public;
grant execute on function public.kirim_dukungan to anon, authenticated;
grant select on public.v_dukungan_ringkas to anon, authenticated;

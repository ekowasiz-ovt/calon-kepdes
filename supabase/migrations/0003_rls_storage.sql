-- STEP 4 — RLS & Storage

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

revoke all on public.aspirasi, public.faq, public.chat_log from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('aspirasi-foto', 'aspirasi-foto', true, 5242880, array['image/jpeg','image/png'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('konten', 'konten', true)
on conflict (id) do nothing;

create policy "unggah foto aspirasi" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'aspirasi-foto' and name like 'uploads/%');

create policy "baca foto aspirasi" on storage.objects for select to anon, authenticated
  using (bucket_id = 'aspirasi-foto');

create policy "baca konten" on storage.objects for select to anon, authenticated
  using (bucket_id = 'konten');

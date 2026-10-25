export type DesaProfilRow = {
  id: number
  nama_desa: string
  wilayah_teks: string
  tagline: string
  jumlah_penduduk: number
  jumlah_rt: number
  jumlah_rw: number
  jumlah_umkm: number
  lat: number
  lng: number
  cuaca_suhu: number | null
  cuaca_kondisi: string | null
  cuaca_max: number | null
  cuaca_min: number | null
}

export type DusunRow = { id: number; nama: string; lat: number | null; lng: number | null; urutan: number }
export type KategoriRow = { id: number; nama: string; urutan: number }
export type AspirasiStatus = 'Diterima' | 'Diverifikasi' | 'Diprioritaskan' | 'Dalam Perencanaan' | 'Dikerjakan' | 'Selesai'
export type ProgramStatus = 'Perencanaan' | 'Berjalan' | 'Dalam Proses' | 'Selesai'

export type AspirasiRow = {
  id: string; kode: string; nama: string; hp: string; kategori_id: number; sub_kategori: string | null
  dusun_id: number | null; lokasi_teks: string | null; lat: number | null; lng: number | null
  judul: string; deskripsi: string; status: AspirasiStatus; created_at: string
}
export type AspirasiPublikRow = Omit<AspirasiRow, 'nama' | 'hp'> & {
  kategori: string; dusun: string | null; jenis: string
}
export type AspirasiFotoRow = { id: string; aspirasi_id: string; storage_path: string; urutan: number }
export type AspirasiStatusLogRow = { id: string; aspirasi_id: string; tahap: AspirasiStatus; tanggal: string }
export type ProgramRow = {
  id: string; judul: string; kategori: string; status: ProgramStatus; target_teks: string; realisasi_teks: string
  progres_persen: number; foto_path: string | null; prioritas: boolean; urutan: number
}
export type RoadmapRow = { id: string; tahun: number; judul: string; deskripsi: string | null; urutan: number }
export type AnggaranItemRow = { id: string; tahun: number; jenis: 'pendapatan' | 'belanja'; nama: string; nominal: number; urutan: number }
export type AnggaranRealisasiRow = { id: string; tahun: number; bidang: string; pagu: number; realisasi: number; urutan: number }
export type PotensiRow = {
  id: string; kategori: 'Pertanian' | 'Peternakan' | 'UMKM' | 'Pemuda'; judul: string; foto_path: string | null
  komoditas_utama: string | null; metrik: Json; urutan: number
}
export type UmkmRow = {
  id: string; nama: string; kategori: 'Makanan' | 'Kerajinan' | 'Fashion'; produk: string; dusun_id: number | null
  whatsapp: string | null; foto_path: string | null; aktif: boolean
}
export type FaqRow = { id: number; pertanyaan: string; jawaban: string; kata_kunci: string[] }
export type NotifikasiRow = { id: string; judul: string; isi: string | null; created_at: string }
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type DukunganRow = { id: string; nama: string; dusun_id: number; created_at: string }
export type DukunganRingkasRow = { total: number; jumlah_dusun: number }

export type MasalahKategoriRow = { id: number; nama: string; jumlah: number; persen: number | null }
export type MasalahDusunRow = { id: number; nama: string; jumlah: number; persen: number | null }
export type PetaRingkasRow = { jenis: string; jumlah: number }

type TableDefinition<Row> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}
type ViewDefinition<Row> = { Row: Row; Relationships: [] }

export type Database = {
  public: {
    Tables: {
      desa_profil: TableDefinition<DesaProfilRow>
      dusun: TableDefinition<DusunRow>
      kategori: TableDefinition<KategoriRow>
      aspirasi: TableDefinition<AspirasiRow>
      aspirasi_foto: TableDefinition<AspirasiFotoRow>
      aspirasi_status_log: TableDefinition<AspirasiStatusLogRow>
      program: TableDefinition<ProgramRow>
      roadmap: TableDefinition<RoadmapRow>
      anggaran_item: TableDefinition<AnggaranItemRow>
      anggaran_realisasi: TableDefinition<AnggaranRealisasiRow>
      potensi: TableDefinition<PotensiRow>
      umkm: TableDefinition<UmkmRow>
      faq: TableDefinition<FaqRow>
      chat_log: TableDefinition<{ id: number; pertanyaan: string; ditemukan: boolean; created_at: string }>
      notifikasi: TableDefinition<NotifikasiRow>
      dukungan: TableDefinition<DukunganRow>
    }
    Views: {
      aspirasi_publik: ViewDefinition<AspirasiPublikRow>
      v_masalah_kategori: ViewDefinition<MasalahKategoriRow>
      v_masalah_dusun: ViewDefinition<MasalahDusunRow>
      v_peta_ringkas: ViewDefinition<PetaRingkasRow>
      v_dukungan_ringkas: ViewDefinition<DukunganRingkasRow>
    }
    Functions: {
      kirim_aspirasi: {
        Args: {
          p_nama: string; p_hp: string; p_kategori_id: number; p_judul: string; p_deskripsi: string
          p_lokasi_teks?: string | null; p_dusun_id?: number | null; p_lat?: number | null; p_lng?: number | null
          p_foto_paths?: string[]
        }
        Returns: string
      }
      tanya_karanganyar: { Args: { p_pertanyaan: string }; Returns: string }
      kirim_dukungan: { Args: { p_nama: string; p_dusun_id: number }; Returns: number }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

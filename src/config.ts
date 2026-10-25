// Semua nilai yang bisa diedit untuk situs kampanye ada di berkas ini.
// Nilai bertanda [ISI: ...] belum final dan wajib diganti sebelum publikasi.

export const isi = {
  fotoLatar: '',
  fotoCalon: '',
  kandidat: 'AGUS PRANOTO',
  nomorUrut: '[ISI: nomor urut]',
  usia: '[ISI: usia]',
  pendidikan: '[ISI: pendidikan]',
  pengalaman: '[ISI: pengalaman]',
  motivasi: '[ISI: motivasi]',
  daftarLayanan: '[ISI: daftar layanan]',
  persyaratan: '[ISI: persyaratan]',
  biayaResmi: '[ISI: biaya resmi]',
  estimasiWaktu: '[ISI: estimasi waktu]',
  whatsapp: '[ISI: nomor WhatsApp]',
  email: '[ISI: alamat email]',
  posko: '[ISI: alamat posko]',
} as const

export const kampanye = {
  desa: 'Karanganyar',
  kecamatan: 'Geyer',
  kabupaten: 'Grobogan',
  provinsi: 'Jawa Tengah',
  kodePos: '58172',
  labelWilayah: 'CALON KEPALA DESA KARANGANYAR · GEYER · GROBOGAN',
} as const

export const slogan = ['Terbuka.', 'Melayani.', 'Serba Digital.'] as const

export const taglineHero = 'Terbuka. Melayani. Serba Digital.'
export const taglineMenu = 'Bersama Membangun Karanganyar Yang Lebih Baik'

export const ringkasVisi = 'Mewujudkan desa yang terbuka, maju, mandiri, dan sejahtera.'

export const visi =
  'Mewujudkan Desa Karanganyar yang terbuka, maju, mandiri, dan sejahtera melalui pelayanan yang berkualitas, pembangunan berkelanjutan, serta pemberdayaan masyarakat.'

export const kandidat = {
  fotoLatar: isi.fotoLatar,
  fotoCalon: isi.fotoCalon,
  nama: isi.kandidat,
  nomorUrut: isi.nomorUrut,
  usia: isi.usia,
  pendidikan: isi.pendidikan,
  pengalaman: isi.pengalaman,
  motivasi: isi.motivasi,
  // DRAFT — kutipan dapat diedit oleh tim kampanye.
  kutipan: 'Anggaran desa adalah hak warga untuk tahu.',
} as const

export const kontak = {
  whatsapp: isi.whatsapp,
  email: isi.email,
  posko: isi.posko,
} as const

export type GrupMisi = 'Tata Kelola dan Pelayanan' | 'Pembangunan dan Pemberdayaan'

export type Misi = {
  nomor: number
  grup: GrupMisi
  judul: string
  deskripsi: string
  indikator: string
}

export const misi: Misi[] = [
  {
    nomor: 1,
    grup: 'Tata Kelola dan Pelayanan',
    judul: 'Pemerintahan Transparan, Akuntabel, dan Partisipatif',
    deskripsi:
      'Menyelenggarakan pemerintahan yang terbuka dalam pengelolaan anggaran, pelaksanaan pembangunan, dan pengambilan keputusan, serta memberikan ruang bagi warga untuk menyampaikan aspirasi dan mengawasi pelaksanaan program desa.',
    indikator: 'Laporan APBDes dan realisasi dipublikasikan setiap triwulan.',
  },
  {
    nomor: 2,
    grup: 'Tata Kelola dan Pelayanan',
    judul: 'Pelayanan Publik yang Cepat, Jelas, dan Mudah Diakses',
    deskripsi:
      'Mewujudkan pelayanan administrasi desa yang tertib, responsif, dan mudah dipahami melalui standar pelayanan yang jelas, informasi persyaratan dan biaya resmi yang transparan, serta peningkatan kapasitas perangkat desa.',
    indikator: 'Standar waktu penyelesaian tersedia untuk setiap jenis layanan.',
  },
  {
    nomor: 3,
    grup: 'Tata Kelola dan Pelayanan',
    judul: 'Tata Kelola Desa Berbasis Digital yang Inklusif',
    deskripsi:
      'Memanfaatkan teknologi informasi untuk mempermudah akses informasi, penyampaian aspirasi, pengaduan, dan permohonan layanan, dengan tetap memperhatikan keamanan data serta kebutuhan warga yang belum terbiasa menggunakan teknologi.',
    indikator: 'Kanal aspirasi digital aktif dengan pencatatan tindak lanjut.',
  },
  {
    nomor: 4,
    grup: 'Pembangunan dan Pemberdayaan',
    judul: 'Infrastruktur dan Kesiapsiagaan Bencana',
    deskripsi:
      'Mendorong pembangunan dan pemeliharaan infrastruktur desa berdasarkan kebutuhan masyarakat, pemerataan manfaat, kondisi wilayah, dan prioritas keselamatan warga, termasuk kesiapsiagaan terhadap risiko bencana yang relevan di kawasan Geyer.',
    indikator: 'Daftar prioritas perbaikan jalan dan drainase dipublikasikan tiap tahun.',
  },
  {
    nomor: 5,
    grup: 'Pembangunan dan Pemberdayaan',
    judul: 'Ekonomi Masyarakat Berbasis Potensi Lokal',
    deskripsi:
      'Mendorong peningkatan produktivitas pertanian, penguatan UMKM, dan pengembangan potensi ekonomi lokal melalui pendampingan, peningkatan keterampilan, akses informasi, serta kerja sama dengan pihak terkait.',
    indikator: 'Program pendampingan petani dan UMKM berjalan setiap tahun.',
  },
  {
    nomor: 6,
    grup: 'Pembangunan dan Pemberdayaan',
    judul: 'Sumber Daya Manusia dan Kelestarian Lingkungan',
    deskripsi:
      'Mendorong peningkatan kualitas pendidikan, kesehatan, kepemudaan, dan pemberdayaan masyarakat serta membangun lingkungan desa yang bersih, sehat, dan berkelanjutan melalui kerja sama warga dan lembaga terkait.',
    indikator: 'Kegiatan kebersihan dan penghijauan berbasis warga terlaksana rutin.',
  },
]

export type Program = {
  kode: string
  judul: string
  ringkas: string
  aksi: string[]
  misiTerkait: number[]
}

export const program: Program[] = [
  {
    kode: 'aman',
    judul: 'Karanganyar Aman',
    ringkas: 'Infrastruktur dan Mitigasi Bencana',
    aksi: [
      'Pendataan dan prioritas perbaikan jalan serta drainase.',
      'Pembangunan infrastruktur berdasarkan kebutuhan dan pemerataan manfaat.',
      'Edukasi dan kesiapsiagaan bencana dengan memperhatikan kondisi wilayah sekitar Sesar Geyer.',
    ],
    misiTerkait: [4],
  },
  {
    kode: 'makmur',
    judul: 'Karanganyar Makmur',
    ringkas: 'Ekonomi Warga — Pertanian, UMKM, dan Wisata',
    aksi: [
      'Penguatan pertanian, termasuk komoditas jagung.',
      'Pendampingan kapasitas dan pemasaran UMKM.',
      'Kajian potensi wisata geologi Zona Kendeng secara bertahap dan bertanggung jawab.',
    ],
    misiTerkait: [5],
  },
  {
    kode: 'terbuka',
    judul: 'Karanganyar Terbuka',
    ringkas: 'Pemerintahan Transparan, Layanan Cepat, dan Desa Digital',
    aksi: [
      'Publikasi informasi APBDes dan laporan realisasi.',
      'Standar pelayanan administrasi yang jelas dan terbuka.',
      'Pengembangan website, WhatsApp, serta pemantauan aspirasi dan pengaduan.',
    ],
    misiTerkait: [1, 2, 3],
  },
  {
    kode: 'cerdas',
    judul: 'Karanganyar Cerdas dan Sehat',
    ringkas: 'Pendidikan, Kesehatan, dan Pemuda',
    aksi: [
      'Dukungan kegiatan pendidikan dan kesehatan masyarakat.',
      'Pengembangan keterampilan serta partisipasi pemuda.',
      'Kerja sama dengan lembaga terkait sesuai kewenangan dan kemampuan desa.',
    ],
    misiTerkait: [6],
  },
  {
    kode: 'hijau',
    judul: 'Karanganyar Bersih dan Hijau',
    ringkas: 'Lingkungan Hidup dan Kebersihan',
    aksi: [
      'Pengelolaan sampah berbasis partisipasi warga.',
      'Penghijauan dan perawatan lingkungan.',
      'Kegiatan kebersihan dan gotong royong di lingkungan desa.',
    ],
    misiTerkait: [6],
  },
]

export const navKampanye = [
  { label: 'Profil', href: '#profil' },
  { label: 'Visi & Misi', href: '#visi-misi' },
  { label: 'Program', href: '#program' },
  { label: 'Transparansi', href: '/transparansi' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Aspirasi', href: '/aspirasi' },
  { label: 'Dukung', href: '/dukungan' },
] as const

// Navigasi bilah bawah khusus mobile. Maksimal 5 slot agar label tetap terbaca.
export const navBawah = [
  { label: 'Beranda', to: '/', ikon: 'beranda' },
  { label: 'Peta', to: '/peta', ikon: 'peta' },
  { label: 'Aspirasi', to: '/aspirasi', ikon: 'aspirasi', utama: true },
  { label: 'Potensi', to: '/potensi', ikon: 'potensi' },
] as const

// Tujuan yang tidak muat di bilah bawah, dibuka lewat halaman menu.
export const navMenuLain = [
  { label: 'Detail Aspirasi', to: '/aspirasi/masuk', ikon: 'aspirasi' },
  { label: 'Layanan Administrasi', to: '/layanan', ikon: 'layanan' },
  { label: 'Transparansi Anggaran', to: '/transparansi', ikon: 'transparansi' },
  { label: 'Tanya Karanganyar', to: '/tanya', ikon: 'tanya' },
  { label: 'Profil Calon', to: '/#profil', ikon: 'profil' },
  { label: 'Visi & Misi', to: '/#visi-misi', ikon: 'visi' },
  { label: 'Program Unggulan', to: '/#program', ikon: 'program' },
] as const

export type Prinsip = { judul: string; keterangan: string }

export const prinsip: Prinsip[] = [
  { judul: 'Terbuka', keterangan: 'Anggaran dan keputusan desa dibuka untuk warga.' },
  { judul: 'Melayani', keterangan: 'Pelayanan administrasi yang tertib dan jelas standarnya.' },
  { judul: 'Serba Digital', keterangan: 'Informasi dan aspirasi dapat diakses lewat kanal digital.' },
]

// Kanal aspirasi kampanye; bukan kanal pengaduan resmi desa.
export const aspirasi = {
  kategori: ['Jalan', 'Air', 'Pertanian', 'Pelayanan', 'Lainnya'] as const,
} as const

// Sumber naskah kampanye. `node build.cjs` menurunkannya menjadi campaign.json,
// carousel.html, galeri, kalender, dan berkas caption per posting.
// Setiap angka berita punya sumber di sources.json; jangan mengubah angka tanpa memperbarui sumbernya.

const HRIS_URL = 'https://hris.lokakasir.id/'
const ACC_URL = 'https://accounting.lokakasir.id/'
const HRIS_CTA = 'Coba mode demo di hris.lokakasir.id'
const ACC_CTA = 'Trial 14 hari di accounting.lokakasir.id'

module.exports = [
  {
    slug: 'hris-kenalan', product: 'hris', date: '2026-11-22', time: '11:00', theme: 'sun',
    category: 'KETENAGAKERJAAN', newsDate: '21 NOV 2026', icon: 'users',
    title: 'Kenalan dengan Loka Kasir HRIS',
    headline: 'UMP, BSU, pesangon: seminggu ini HR jadi berita.',
    lead: 'Tiga-tiganya berujung ke satu hal: data karyawan yang rapi.',
    hero: { kind: 'ticker', rows: [
      ['UMP 2027', 'Batas penetapan 21 November'],
      ['BSU 2026', 'Rp900 ribu, dibayar sekaligus'],
      ['Dana pesangon', 'Aturan pelaksana masih disusun'],
    ] },
    facts: { title: 'Tiga kabar soal karyawan', items: [
      ['UMP 2027', 'Gubernur menetapkan paling lambat 21 November. Jakarta naik 7,1% jadi Rp6.136.941.'],
      ['BSU 2026', 'Rp900 ribu dibayar sekaligus. Yang dilihat: kepesertaan BPJS Ketenagakerjaan dan upah yang dilaporkan.'],
      ['Dana pesangon', 'Kemnaker: lembaga pengelolanya belum ditetapkan. Aturan pelaksana masih disusun.'],
    ], source: 'Sumber: Kompas.com (20/11), Kemnaker (5/11), ANTARA (15/11).' },
    bridge: { title: 'Semuanya butuh data yang sama', items: [
      ['Siapa saja karyawannya', 'Nama, jabatan, lokasi kerja, tanggal bergabung, dan statusnya.'],
      ['Berapa upahnya', 'Gaji pokok, tunjangan tetap, dan upah minimum di lokasi kerjanya.'],
      ['Apa yang sudah dibayar', 'Slip gaji, iuran BPJS, dan PPh 21 tiap bulan.'],
    ] },
    app: { title: 'Loka Kasir HRIS menyimpannya di satu tempat.',
      body: 'Karyawan, jadwal shift, absensi, cuti, lembur, sampai payroll. Karyawan absen dan melihat slip gaji dari Portal Saya.',
      path: ['Karyawan', 'Jadwal Shift', 'Absensi', 'Payroll'], capture: 'hris-ringkasan.png', photoFocus: [0, 250, 1120, 770], captureAlt: 'Ringkasan HR: absensi hari ini, karyawan aktif, hadir, terlambat, dan cuti menunggu', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · Kenalan dengan Loka Kasir HRIS

Seminggu ini urusan karyawan jadi berita terus. UMP 2027 ditetapkan (Jakarta naik 7,1% jadi Rp6.136.941), BSU Rp900 ribu dijadwalkan cair November–Desember, dan aturan pelaksana dana cadangan pesangon masih disusun.

Tiga-tiganya berujung ke data yang sama: siapa karyawanmu, berapa upahnya, dan apa saja yang sudah dibayar.

Loka Kasir HRIS menyimpan data itu di satu tempat: karyawan, jadwal shift, absensi, cuti, lembur, dan payroll dengan PPh 21 serta BPJS. Karyawan absen dan melihat slip gaji dari Portal Saya.

Coba mode demo dengan data contoh:
${HRIS_URL}

Sumber: Kompas.com (20/11), Kemnaker (5/11), ANTARA (15/11).

#LokaKasirHRIS #UMP2027 #BSU2026 #HRIS`,
    threads: `Loka Kasir HRIS · Seminggu ini urusan karyawan jadi berita terus: UMP 2027, BSU Rp900 ribu, dana cadangan pesangon.

Semuanya butuh data yang sama: siapa karyawanmu, berapa upahnya, apa yang sudah dibayar. Loka Kasir HRIS menyimpan karyawan, shift, absensi, cuti, dan payroll di satu tempat.

Coba mode demonya: ${HRIS_URL}`,
  },
  {
    slug: 'acc-gta6-harga-ppn', product: 'accounting', date: '2026-11-23', time: '11:00', theme: 'navy',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'versus', prefix: 'Rp', badge: '+11%', rows: [['Harga yang ramai dikutip', 1190000], ['PlayStation Store Indonesia', 1321000]] },
    category: 'GAME', newsDate: '19 NOV 2026', icon: 'gamepad-2',
    title: 'Harga GTA 6 dan PPN 11%',
    headline: 'GTA 6: Rp1,19 juta di berita, Rp1,32 juta di keranjang.',
    lead: 'Selisihnya Rp131.000. Hampir persis 11% dari harga awal.',
    hero: { kind: 'versus', badge: '+11%', rows: [
      ['Harga yang ramai dikutip', 'Rp1.190.000'],
      ['PlayStation Store Indonesia', 'Rp1.321.000'],
    ] },
    facts: { title: 'Hitungannya sederhana', items: [
      ['Rp1.190.000', 'Harga Standard Edition yang dikutip sejumlah media sejak pre-order dibuka.'],
      ['Rp1.321.000', 'Harga yang tercantum di PlayStation Store Indonesia saat rilis, 19 November.'],
      ['× 1,11', 'Rp1.190.000 × 1,11 = Rp1.320.900. Polanya cocok dengan harga sebelum dan sesudah PPN.'],
    ], source: 'Sumber harga: Kompas.com (19/11). Sony tidak merinci komponen pajaknya; angka 11% hitungan kami.' },
    bridge: { title: 'Kalau usahamu PKP, pelanggan juga bisa kaget', items: [
      ['Tulis harga dengan jelas', 'Sebutkan apakah harga sudah termasuk PPN atau belum.'],
      ['Pisahkan DPP dan PPN', 'Di faktur, nilai barang dan pajaknya punya baris sendiri.'],
      ['PPN bukan omzet', 'Pajak yang kamu pungut itu titipan untuk disetor.'],
    ] },
    app: { title: 'Faktur dengan PPN, langsung terpisah.',
      body: 'Pasang kode pajak di faktur penjualan. Accounting menghitung DPP, DPP nilai lain 11/12, dan PPN 12%, lalu menyiapkan ekspor e-Faktur.',
      path: ['Kode Pajak', 'Faktur Penjualan', 'e-Faktur Coretax'], capture: 'acc-pajak.png', focus: [660, 215, 1641, 368], captureAlt: 'Daftar faktur pajak keluaran dengan kolom DPP, DPP nilai lain, dan PPN 12%', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · Harga GTA 6 dan PPN 11%

GTA 6 rilis 19 November. Sebelum rilis, banyak yang mengutip harga Rp1.190.000. Di PlayStation Store Indonesia, yang tertulis Rp1.321.000.

Selisihnya Rp131.000. Coba hitung: Rp1.190.000 × 1,11 = Rp1.320.900. Polanya cocok dengan harga sebelum dan sesudah PPN (tarif 12% × DPP nilai lain 11/12 = 11% dari harga). Sony tidak merinci komponen pajaknya, jadi ini hitungan kami.

Pelajarannya buat usaha yang sudah PKP: tulis jelas apakah harga sudah termasuk PPN, pisahkan DPP dan PPN di faktur, dan ingat PPN yang dipungut bukan omzet.

Di Loka Kasir Accounting, kode pajak di faktur penjualan menghitung DPP dan PPN, lalu menyiapkan ekspor e-Faktur.

Trial 14 hari:
${ACC_URL}

Sumber harga: Kompas.com, 19 November 2026.

#LokaKasirAccounting #GTA6 #PPN #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · GTA 6: Rp1.190.000 di berita, Rp1.321.000 di PlayStation Store Indonesia.

Rp1.190.000 × 1,11 = Rp1.320.900. Polanya cocok dengan harga sebelum dan sesudah PPN. Ini hitungan kami; Sony tidak merinci pajaknya.

Kalau usahamu PKP: tulis jelas harga sudah termasuk PPN atau belum.

${ACC_URL}`,
  },
  {
    slug: 'hris-dokter-online-shift', product: 'hris', date: '2026-11-24', time: '11:00', theme: 'ink',
    category: 'VIRAL DI THREADS', newsDate: '17–21 NOV 2026', icon: 'stethoscope',
    title: 'Dokter online 24 jam dan jadwal shift',
    headline: 'Dokter online 24 jam? Jawabannya ada di jadwal.',
    lead: 'Ramai di Threads: benarkah ada dokter telemedicine yang online terus?',
    hero: { kind: 'stat', big: '24 jam', label: 'Status online yang bikin warganet penasaran', minis: [
      ['17 Nov', 'mulai ramai dibahas'], ['PB IDI', 'ikut menanggapi'],
    ] },
    facts: { title: 'Yang sebenarnya terjadi', items: [
      ['Awalnya', 'Seorang pengguna Threads heran melihat dokter telemedicine yang tampak online sampai larut malam.'],
      ['Kata dokter', 'Jam praktik disepakati sejak awal dan diisi di dashboard, termasuk shift malam.'],
      ['Kata PB IDI', 'Telemedicine untuk keluhan ringan. Bila perlu pemeriksaan fisik, pasien dirujuk.'],
    ], source: 'Sumber: detikHealth, 17–21 November 2026.' },
    bridge: { title: 'Di toko juga sama: jadwalnya harus jelas', items: [
      ['Satu orang, satu shift sehari', 'Jadwal yang bertumpuk bikin orang capek dan pelanggan menunggu.'],
      ['Jam kerja tertulis', 'Pagi, sore, atau malam: semua tahu kapan mulai dan selesai.'],
      ['Hadirnya tercatat', 'Absen masuk dan pulang dicocokkan dengan jadwalnya.'],
    ] },
    app: { title: 'Susun shift 7 hari per outlet.',
      body: 'Satu shift per karyawan per tanggal. Minggu ini beres? Salin ke pekan depan. Karyawan melihat jadwalnya di Portal Saya.',
      path: ['Jadwal Shift', 'Atur Shift', 'Salin ke pekan depan'], capture: 'hris-shift.png', photoFocus: [0, 150, 1120, 650], captureAlt: 'Jadwal shift tujuh hari: shift pagi dan sore tiap karyawan per outlet', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · Dokter online 24 jam dan jadwal shift

Minggu ini Threads ramai membahas dokter telemedicine yang kelihatan online terus. Ada yang menduga pakai admin, ada yang menduga AI.

Menurut para dokter yang diwawancarai detikHealth, jam praktik disepakati sejak awal dan diisi di dashboard, termasuk yang sengaja mengambil shift malam. PB IDI mengingatkan telemedicine ditujukan untuk keluhan ringan.

Di toko atau kafe, pertanyaannya mirip: siapa jaga jam berapa? Kalau jadwalnya tertulis, tidak ada yang perlu menebak.

Di Loka Kasir HRIS, jadwal shift disusun 7 hari per outlet, satu shift per karyawan per tanggal, dan bisa disalin ke pekan depan. Karyawan melihat jadwalnya di Portal Saya.

Coba mode demo:
${HRIS_URL}

Sumber: detikHealth, 17–21 November 2026.

#LokaKasirHRIS #JadwalShift #Telemedicine #HRIS`,
    threads: `Loka Kasir HRIS · Dokter telemedicine “online 24 jam” lagi ramai di sini.

Kata para dokter ke detikHealth: jam praktik disepakati sejak awal dan diisi di dashboard, termasuk shift malam.

Di toko juga sama. Kalau jadwal shift tertulis, tidak ada yang perlu menebak siapa jaga jam berapa.

${HRIS_URL}`,
  },
  {
    slug: 'acc-uu-perampasan-aset', product: 'accounting', date: '2026-11-25', time: '11:00', theme: 'navy',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'count', value: 74, suffix: ' pasal', label: 'UU Perampasan Aset, disahkan DPR', minis: [['19 Nov 2026', 'rapat paripurna DPR'], ['18 tahun', 'menunggu pengesahan']] },
    category: 'HUKUM', newsDate: '19 NOV 2026', icon: 'scale',
    title: 'UU Perampasan Aset dan catatan asal-usul aset',
    headline: 'Setelah 18 tahun, UU Perampasan Aset disahkan.',
    lead: 'Pengingat yang bagus buat pemilik usaha: aset sebaiknya punya catatan asal-usul.',
    hero: { kind: 'stat', big: '74 pasal', label: 'UU Perampasan Aset, disahkan DPR', minis: [
      ['19 Nov 2026', 'rapat paripurna DPR'], ['18 tahun', 'menunggu pengesahan'],
    ] },
    facts: { title: 'Yang disahkan DPR', items: [
      ['19 November', 'Rapat paripurna DPR menyetujui RUU Perampasan Aset menjadi undang-undang.'],
      ['74 pasal', 'Mengatur perampasan aset terkait tindak pidana korupsi dan tindak pidana lainnya.'],
      ['Tujuannya', 'Memulihkan kerugian negara dan korban dari aset hasil tindak pidana.'],
    ], source: 'Sumber: CNN Indonesia, Kompas.com, dan DPR RI, 19 November 2026.' },
    bridge: { title: 'Tiga catatan yang sebaiknya selalu ada', items: [
      ['Dari mana uangnya', 'Setoran modal, pinjaman, dan hasil usaha dicatat terpisah.'],
      ['Kapan dan berapa belinya', 'Tanggal, harga perolehan, dan bukti pembelian tiap aset.'],
      ['Siapa yang mencatat', 'Setiap perubahan data punya nama dan waktunya.'],
    ] },
    app: { title: 'Kartu aset lengkap dengan buktinya.',
      body: 'Catat aset tetap dengan tanggal dan harga perolehan. Lampirkan bukti di faktur pembeliannya, dan lihat riwayat perubahan di log aktivitas.',
      path: ['Aset Tetap', 'Faktur Pembelian', 'Log Aktivitas'], capture: 'acc-aset.png', captureAlt: 'Daftar aset: kode, nama aset, metode, perolehan, akumulasi penyusutan, dan nilai buku', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · UU Perampasan Aset dan catatan asal-usul aset

Rapat paripurna DPR pada 19 November 2026 mengesahkan RUU Perampasan Aset Terkait Tindak Pidana Korupsi dan Tindak Pidana Lainnya menjadi undang-undang. Isinya 74 pasal, setelah sekitar 18 tahun menunggu.

Undang-undang ini menyasar aset hasil tindak pidana. Buat pemilik usaha, ini pengingat yang bagus soal kebiasaan sederhana: setiap aset punya catatan asal-usul.

Tiga catatan yang sebaiknya selalu ada: dari mana uangnya, kapan dan berapa harga belinya, dan siapa yang mencatat.

Di Loka Kasir Accounting, aset tetap dicatat dengan tanggal dan harga perolehan, bukti dilampirkan di faktur pembeliannya, dan riwayat perubahan ada di log aktivitas.

Ini bukan nasihat hukum.

Trial 14 hari:
${ACC_URL}

Sumber: CNN Indonesia, Kompas.com, dan DPR RI, 19 November 2026.

#LokaKasirAccounting #UUPerampasanAset #AsetTetap #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · Setelah sekitar 18 tahun, UU Perampasan Aset disahkan DPR pada 19 November. Isinya 74 pasal.

Buat pemilik usaha, ini pengingat sederhana: setiap aset sebaiknya punya catatan asal-usul. Dari mana uangnya, kapan dibeli, berapa harganya, dan mana buktinya.

${ACC_URL}`,
  },
  {
    slug: 'acc-wapres-dua-tahap', product: 'accounting', date: '2026-11-26', time: '11:00', theme: 'navy',
    category: 'POLITIK', newsDate: '17 NOV 2026', icon: 'landmark',
    title: 'Pemilihan wakil presiden dan persetujuan pembayaran',
    headline: 'Presiden mengusulkan dua nama. MPR memilih satu.',
    lead: 'Kursi wakil presiden diisi lewat dua tahap. Uang usaha juga sebaiknya begitu.',
    hero: { kind: 'stat', big: '9 Des', label: 'Jadwal sidang paripurna MPR memilih wakil presiden', minis: [
      ['2 nama', 'diusulkan Presiden'], ['14 hari', 'sebelum sidang'],
    ] },
    facts: { title: 'Aturan mainnya', items: [
      ['Dua nama', 'Presiden mengusulkan dua calon wakil presiden kepada MPR.'],
      ['14 hari', 'Usulan diserahkan paling lambat dua pekan sebelum sidang paripurna.'],
      ['9 Desember', 'MPR menjadwalkan sidang untuk memilih, menetapkan, dan melantik wakil presiden.'],
    ], source: 'Sumber: CNN Indonesia dan Kompas.com, 17 November 2026.' },
    bridge: { title: 'Yang mengusulkan bukan yang memutuskan', items: [
      ['Pengaju', 'Staf membuat perintah pembayaran lengkap dengan tagihannya.'],
      ['Penyetuju', 'Orang lain memeriksa, lalu menyetujui atau menolak.'],
      ['Jejaknya tersimpan', 'Siapa mengajukan dan siapa menyetujui tercatat.'],
    ] },
    app: { title: 'Pembayaran lewat dua tangan.',
      body: 'Buat perintah pembayaran untuk tagihan pemasok. Pengguna yang berwenang menyetujuinya sebelum transfer. Log aktivitas mencatat setiap langkah.',
      path: ['Peran & Hak Akses', 'Perintah Pembayaran', 'Log Aktivitas'], capture: 'acc-audit.png', photoFocus: [0, 60, 840, 430], captureAlt: 'Log aktivitas: waktu, pengguna, aksi, dan entitas yang diubah', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · Pemilihan wakil presiden dan persetujuan pembayaran

MPR menjadwalkan sidang paripurna 9 Desember 2026 untuk memilih, menetapkan, dan melantik wakil presiden. Aturannya: Presiden mengusulkan dua nama paling lambat 14 hari sebelum sidang, lalu MPR memilih satu.

Terlepas dari siapa yang terpilih, mekanismenya menarik: yang mengusulkan dan yang memutuskan adalah dua pihak berbeda.

Uang usaha juga lebih aman kalau begitu. Satu orang mengajukan pembayaran, orang lain menyetujui, dan keduanya tercatat.

Di Loka Kasir Accounting, perintah pembayaran dibuat untuk tagihan pemasok dan disetujui pengguna yang berwenang sebelum transfer. Log aktivitas mencatat setiap langkah.

Trial 14 hari:
${ACC_URL}

Sumber: CNN Indonesia dan Kompas.com, 17 November 2026.

#LokaKasirAccounting #KontrolInternal #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · Wakil presiden baru dipilih lewat dua tahap: Presiden mengusulkan dua nama, MPR memilih satu. Sidangnya dijadwalkan 9 Desember.

Pembayaran usaha juga lebih aman kalau yang mengajukan dan yang menyetujui bukan orang yang sama, dan dua-duanya tercatat.

${ACC_URL}`,
  },
  {
    slug: 'hris-timnas-debut-onboarding', product: 'hris', date: '2026-11-27', time: '11:00', theme: 'sky',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'match', home: 'Timnas Indonesia', away: 'Bali United', note: 'Uji coba tertutup, 15 November 2026', events: [[1, 0, 'Gol Arlyansyah Abdulmanan, babak pertama'], [1, 1, 'Bali United menyamakan, babak kedua']] },
    category: 'OLAHRAGA', newsDate: '15 NOV 2026', icon: 'goal',
    title: 'Debutan Timnas dan hari pertama karyawan baru',
    headline: 'Panggilan pertama, langsung cetak gol.',
    lead: 'Arlyansyah Abdulmanan, 20 tahun, mencetak gol di uji coba Timnas. Karyawan barumu disambut bagaimana?',
    hero: { kind: 'stat', big: '1–1', label: 'Timnas Indonesia vs Bali United, uji coba 15 November', minis: [
      ['20 tahun', 'usia Arlyansyah'], ['22 pemain', 'dipanggil ke TC Bali'],
    ] },
    facts: { title: 'Dari pemusatan latihan di Bali', items: [
      ['Debutan', 'Arlyansyah Abdulmanan dari Persija mendapat panggilan pertama ke Timnas senior.'],
      ['Gol', 'Ia membuka skor di uji coba tertutup melawan Bali United yang berakhir 1–1.'],
      ['Kata pelatih', 'John Herdman memakai TC ini untuk menilai kedalaman skuad.'],
    ], source: 'Sumber: CNN Indonesia (10/11 dan 17/11), tvOnenews (15/11), detikSport (11/11).' },
    bridge: { title: 'Hari pertama menentukan', items: [
      ['Tahu tugasnya', 'Jabatan, lokasi kerja, dan atasannya jelas sejak awal.'],
      ['Tahu jadwalnya', 'Shift minggu pertama sudah ada sebelum ia datang.'],
      ['Pegang perlengkapannya', 'Seragam dan kunci diserahkan, lalu dicatat.'],
    ] },
    app: { title: 'Checklist masuk untuk karyawan baru.',
      body: 'Tambahkan karyawan, mulai checklist masuk dengan tenggatnya, dan catat serah terima aset. Undangan Portal Saya dibuat dari Akses Tim.',
      path: ['Karyawan', 'Siklus Karyawan', 'Akses Tim'], capture: 'hris-siklus.png', focus: [0, 0, 1682, 560], captureAlt: 'Halaman Siklus Karyawan: perhatian kontrak, checklist masuk dan keluar, serta tombol Mulai Checklist', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · Debutan Timnas dan hari pertama karyawan baru

Di pemusatan latihan Timnas Indonesia di Bali, Arlyansyah Abdulmanan (20 tahun, Persija) mendapat panggilan pertamanya dan langsung mencetak gol saat uji coba tertutup melawan Bali United, 15 November. Skor akhir 1–1.

Pemain baru bisa langsung berkontribusi kalau tahu perannya. Karyawan baru juga.

Hari pertama lebih lancar kalau tugas dan lokasinya jelas, shift minggu pertama sudah ada, dan perlengkapan kerja diserahkan lalu dicatat.

Di Loka Kasir HRIS, tambahkan karyawan, mulai checklist masuk dengan tenggatnya di Siklus Karyawan, dan catat serah terima aset. Undangan Portal Saya dibuat dari Akses Tim.

Coba mode demo:
${HRIS_URL}

Sumber: CNN Indonesia (17/11), tvOnenews (15/11).

#LokaKasirHRIS #TimnasIndonesia #Onboarding #HRIS`,
    threads: `Loka Kasir HRIS · Arlyansyah Abdulmanan, 20 tahun, dipanggil Timnas untuk pertama kali dan langsung cetak gol di uji coba lawan Bali United (1–1).

Karyawan baru juga bisa cepat nyetel kalau hari pertamanya jelas: tugas, jadwal shift, dan perlengkapan kerja.

${HRIS_URL}`,
  },
  {
    slug: 'acc-rupiah-18245', product: 'accounting', date: '2026-11-28', time: '11:00', theme: 'paper',
    category: 'EKONOMI', newsDate: '18 NOV 2026', icon: 'circle-dollar-sign',
    title: 'Rupiah Rp18.245 dan tagihan dalam dolar',
    headline: 'Dolar Rp18.245. Tagihan impormu ikut berubah?',
    lead: 'Tagihan dalam dolar nilainya bergerak sampai hari dibayar.',
    hero: { kind: 'stat', big: 'Rp18.245', label: 'Per dolar AS, 17 November 2026', minis: [
      ['0,66%', 'melemah dari akhir Oktober'], ['Rp18.278', 'JISDOR 20 November'],
    ] },
    facts: { title: 'Posisi rupiah', items: [
      ['Rp18.245', 'Nilai tukar per dolar AS pada 17 November menurut Bank Indonesia.'],
      ['0,66%', 'Pelemahan dibanding akhir Oktober 2026.'],
      ['Rp18.278', 'Kurs referensi JISDOR pada 20 November 2026.'],
    ], source: 'Sumber: Bank Indonesia, konferensi pers 18 November 2026 dan data JISDOR.' },
    bridge: { kicker: 'CONTOH HITUNGAN', title: 'Kalau kamu beli barang dalam dolar', items: [
      ['Saat faktur diterima', 'Tagihan US$1.000 dicatat Rp18.245.000.'],
      ['Saat dibayar', 'Kalau kurs jadi Rp18.500, yang keluar Rp18.500.000.'],
      ['Selisihnya', 'Rp255.000 itu rugi kurs, bukan harga barang.'],
    ] },
    app: { title: 'Catat valas dengan kursnya.',
      body: 'Atur mata uang dan kurs, lalu catat faktur pembelian dalam valuta asing. Revaluasi kurs menyesuaikan saldo yang belum dibayar.',
      path: ['Mata Uang', 'Faktur Pembelian', 'Kurs KMK'], capture: 'acc-pembelian.png', photoFocus: [0, 110, 840, 400], captureAlt: 'Daftar faktur pembelian dengan nomor, tanggal, status, dan nilai', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · Rupiah Rp18.245 dan tagihan dalam dolar

Bank Indonesia mencatat nilai tukar Rp18.245 per dolar AS pada 17 November 2026, melemah 0,66% dari akhir Oktober. Kurs JISDOR 20 November: Rp18.278.

Kalau kamu membeli barang dari luar negeri, tagihan dalam dolar nilainya bergerak sampai hari dibayar.

Contoh hitungan: tagihan US$1.000 dicatat Rp18.245.000 saat faktur diterima. Kalau saat dibayar kurs jadi Rp18.500, yang keluar Rp18.500.000. Selisih Rp255.000 itu rugi kurs, bukan harga barang. Kalau dicampur, harga pokok jadi keliru.

Di Loka Kasir Accounting, atur mata uang dan kursnya, catat faktur pembelian dalam valuta asing, lalu jalankan revaluasi kurs untuk saldo yang belum dibayar.

Trial 14 hari:
${ACC_URL}

Sumber: Bank Indonesia, 18 November 2026 dan data JISDOR.

#LokaKasirAccounting #Rupiah #SelisihKurs #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · Dolar Rp18.245 pada 17 November (Bank Indonesia), melemah 0,66% dari akhir Oktober.

Contoh: tagihan US$1.000 dicatat Rp18.245.000. Dibayar saat kurs Rp18.500, keluar Rp18.500.000. Selisih Rp255.000 itu rugi kurs, bukan harga barang.

${ACC_URL}`,
  },
  {
    slug: 'acc-persib-jdt-identik', product: 'accounting', date: '2026-11-29', time: '11:00', theme: 'cobalt',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'table', head: ['Main', 'Menang', 'Gol', 'Poin'], badge: 'Identik', rows: [['Johor Darul Ta’zim', '2', '2', '9–1', '6'], ['Persib Bandung', '2', '2', '9–1', '6']], note: 'Grup B ASEAN Club Championship, setelah dua laga' },
    category: 'OLAHRAGA', newsDate: '19 NOV 2026', icon: 'trophy',
    title: 'Persib, JDT, dan omzet yang sama',
    headline: 'Persib dan JDT: 6 poin, gol 9–1. Identik.',
    lead: 'Angka yang sama belum tentu cerita yang sama. Di laporan usaha juga begitu.',
    hero: { kind: 'versus', badge: '6 poin', rows: [
      ['Johor Darul Ta’zim', '9–1'],
      ['Persib Bandung', '9–1'],
    ] },
    facts: { title: 'Grup B setelah dua laga', items: [
      ['6–0', 'Persib mengalahkan Shan United di GBLA, Kamis 19 November.'],
      ['Sama persis', 'Persib dan JDT sama-sama 6 poin, mencetak 9 gol, kebobolan 1.'],
      ['Urutannya', 'JDT ditempatkan di posisi pertama, Persib kedua.'],
    ], source: 'Sumber: ANTARA dan Tirto.id, 19 November 2026 (ASEAN Club Championship).' },
    bridge: { kicker: 'CONTOH HITUNGAN', title: 'Dua toko, omzet sama. Sehatnya belum tentu.', items: [
      ['Omzet', 'Sama-sama Rp100 juta sebulan.'],
      ['Biaya', 'Toko A keluar Rp60 juta. Toko B keluar Rp85 juta.'],
      ['Laba', 'Rp40 juta dan Rp15 juta. Baru kelihatan bedanya.'],
    ] },
    app: { title: 'Lihat laba, bukan cuma omzet.',
      body: 'Dashboard menampilkan pendapatan dan laba bersih bulan berjalan. Rinciannya ada di laporan laba rugi.',
      path: ['Dashboard', 'Daftar Laporan', 'Laba rugi'], capture: 'acc-dashboard.png', captureAlt: 'Dashboard: pendapatan bulan ini, laba bersih, total aset, dan total kewajiban', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · Persib, JDT, dan omzet yang sama

Persib menang 6–0 atas Shan United di GBLA, 19 November. Setelah dua laga Grup B ASEAN Club Championship, Persib dan Johor Darul Ta’zim sama persis: 6 poin, mencetak 9 gol, kebobolan 1.

Angka yang sama belum tentu cerita yang sama. Di usaha juga begitu.

Contoh hitungan: dua toko sama-sama beromzet Rp100 juta sebulan. Toko A keluar biaya Rp60 juta, Toko B Rp85 juta. Labanya Rp40 juta dan Rp15 juta. Dari omzet saja, bedanya tidak kelihatan.

Di Loka Kasir Accounting, dashboard menampilkan pendapatan dan laba bersih bulan berjalan. Rinciannya ada di laporan laba rugi.

Trial 14 hari:
${ACC_URL}

Sumber: ANTARA dan Tirto.id, 19 November 2026.

#LokaKasirAccounting #Persib #LabaRugi #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · Persib dan JDT setelah dua laga: 6 poin, gol 9–1. Identik.

Angka sama belum tentu cerita sama. Dua toko beromzet Rp100 juta, biayanya Rp60 juta dan Rp85 juta. Labanya Rp40 juta dan Rp15 juta (contoh hitungan).

Lihat laba, bukan cuma omzet.

${ACC_URL}`,
  },
  {
    slug: 'hris-ump-2027', product: 'hris', date: '2026-11-30', time: '11:00', theme: 'ink',
    category: 'KETENAGAKERJAAN', newsDate: '21 NOV 2026', icon: 'wallet',
    title: 'UMP 2027 dan payroll Januari',
    headline: 'UMP 2027 sudah keluar. Payroll Januari sudah disesuaikan?',
    lead: 'Jakarta naik 7,1%. Bali naik 42,15%.',
    hero: { kind: 'stat', big: '7,1%', label: 'Kenaikan UMP Jakarta 2027', minis: [
      ['Rp6.136.941', 'UMP Jakarta 2027'], ['25 Nov', 'batas penetapan UMK'],
    ] },
    facts: { title: 'Angka yang sudah ditetapkan', items: [
      ['Jakarta', 'Rp6.136.941, naik Rp407.065 dari Rp5.729.876.'],
      ['Bali', 'Rp4.559.287, naik 42,15% dari Rp3.207.459.'],
      ['Jadwalnya', 'UMP paling lambat 21 November, UMK paling lambat 25 November 2026.'],
    ], source: 'Sumber: Kompas.com, 20–21 November 2026; ANTARA, 17 November 2026.' },
    bridge: { title: 'Sebelum gaji Januari dibayar', items: [
      ['Cek upah minimum lokasimu', 'Pakai angka provinsi atau kabupaten/kota tempat karyawan bekerja.'],
      ['Bandingkan dengan gaji sekarang', 'Siapa saja yang upahnya masih di bawah angka baru?'],
      ['Catat bulan berlakunya', 'Supaya payroll Desember dan Januari memakai angka yang benar.'],
    ] },
    app: { title: 'Atur upah minimum per karyawan.',
      body: 'Di Profil Payroll, isi bulan berlaku dan upah minimum lokasi tiap karyawan, bersama status PTKP dan program BPJS-nya.',
      path: ['Aturan Payroll', 'Atur Profil', 'Upah minimum lokasi'], capture: 'hris-profil-upah.png', captureAlt: 'Form Profil Payroll dengan isian Berlaku mulai dan Upah minimum lokasi', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · UMP 2027 dan payroll Januari

Batas penetapan UMP 2027 jatuh pada 21 November. Jakarta menetapkan Rp6.136.941, naik 7,1% atau Rp407.065. Bali naik 42,15% menjadi Rp4.559.287. UMK ditetapkan paling lambat 25 November.

Sebelum gaji Januari dibayar, cek tiga hal: upah minimum di lokasi kerja karyawan, siapa yang upahnya masih di bawah angka baru, dan mulai bulan apa angka itu dipakai.

Di Loka Kasir HRIS, Profil Payroll tiap karyawan punya isian bulan berlaku dan upah minimum lokasi, bersama status PTKP dan program BPJS-nya.

Cek angka resmi daerahmu di keputusan gubernur masing-masing.

Coba mode demo:
${HRIS_URL}

Sumber: Kompas.com, 20–21 November 2026; ANTARA, 17 November 2026.

#LokaKasirHRIS #UMP2027 #Payroll #HRIS`,
    threads: `Loka Kasir HRIS · UMP 2027 sudah ditetapkan. Jakarta Rp6.136.941 (naik 7,1%), Bali Rp4.559.287 (naik 42,15%). UMK menyusul paling lambat 25 November.

Sebelum gaji Januari dibayar: cek upah minimum lokasi kerja, lalu lihat siapa yang masih di bawah angka baru.

${HRIS_URL}`,
  },
  {
    slug: 'hris-gta6-cuti', product: 'hris', date: '2026-12-01', time: '11:00', theme: 'sky',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'versus', badge: 'peak viewers', rows: [['IShowSpeed', 371840], ['Windah Basudara', 392505]] },
    category: 'GAME', newsDate: '19 NOV 2026', icon: 'gamepad-2',
    title: 'GTA 6 rilis dan pengajuan cuti',
    headline: 'GTA 6 rilis. Mendadak banyak yang izin?',
    lead: '392.505 orang menonton satu siaran Windah Basudara pada saat bersamaan.',
    hero: { kind: 'versus', badge: 'peak viewers', rows: [
      ['IShowSpeed', '371.840'],
      ['Windah Basudara', '392.505'],
    ] },
    facts: { title: 'Rekor dari Indonesia', items: [
      ['392.505', 'Penonton serentak siaran GTA 6 Windah Basudara di YouTube. Tertinggi versi Streams Charts.'],
      ['371.840', 'Angka IShowSpeed di posisi kedua. Selisihnya 20.665 penonton.'],
      ['00.00 WIB', 'GTA 6 bisa dimainkan di Indonesia sejak 19 November di PS5 dan Xbox Series X|S.'],
    ], source: 'Sumber: Kompas.com, 19 November 2026 (data Streams Charts).' },
    bridge: { title: 'Hobi boleh. Izinnya lewat jalur yang jelas.', items: [
      ['Ajukan sebelum hari-H', 'Cuti yang direncanakan lebih mudah disetujui dan dicarikan pengganti.'],
      ['Sisa kuota kelihatan', 'Karyawan tahu jatahnya. Atasan tahu siapa yang sedang cuti.'],
      ['Jadwal ikut menyesuaikan', 'Shift yang kosong bisa diisi sebelum toko buka.'],
    ] },
    app: { title: 'Cuti diajukan dari Portal Saya.',
      body: 'Karyawan mengajukan cuti dan melihat sisa kuota tahunannya. Atasan meninjau, lalu menyetujui atau menolak.',
      path: ['Portal Saya', 'Ajukan Cuti', 'Cuti & Izin'], capture: 'hris-dialog-cuti.png', captureAlt: 'Detail pengajuan cuti tahunan dengan tombol Tolak dan Setujui', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · GTA 6 rilis dan pengajuan cuti

GTA 6 bisa dimainkan di Indonesia sejak 19 November pukul 00.00 WIB. Siaran Windah Basudara mencatat 392.505 penonton serentak, tertinggi di daftar Streams Charts, di atas IShowSpeed dengan 371.840.

Kalau hari itu ada yang mendadak izin, kamu tidak sendirian. Hobi boleh. Yang bikin repot itu izin dadakan tanpa pengganti.

Lebih enak kalau cuti diajukan sebelum hari-H, sisa kuotanya kelihatan, dan jadwal shift bisa disesuaikan sebelum toko buka.

Di Loka Kasir HRIS, karyawan mengajukan cuti dari Portal Saya dan melihat sisa kuota tahunannya. Atasan meninjau, lalu menyetujui atau menolak.

Coba mode demo:
${HRIS_URL}

Sumber: Kompas.com, 19 November 2026 (data Streams Charts).

#LokaKasirHRIS #GTA6 #CutiKaryawan #HRIS`,
    threads: `Loka Kasir HRIS · GTA 6 rilis 19 November. Siaran Windah Basudara ditonton 392.505 orang bersamaan, tertinggi versi Streams Charts.

Hari itu ada yang mendadak izin? Hobi boleh. Lebih enak kalau cuti diajukan sebelum hari-H dan sisa kuotanya kelihatan.

${HRIS_URL}`,
  },
  {
    slug: 'hris-dana-pesangon-cek-fakta', product: 'hris', date: '2026-12-02', time: '11:00', theme: 'sun',
    category: 'CEK FAKTA', newsDate: '17 NOV 2026', icon: 'shield-check',
    title: 'Dana cadangan pesangon dan kabar Danantara',
    headline: 'Dana pesangon wajib disetor ke Danantara? Kemnaker: tidak benar.',
    lead: 'Lembaga pengelolanya belum ditetapkan. Aturan pelaksananya masih disusun.',
    hero: { kind: 'stat', big: 'Tidak benar', label: 'Kabar setoran dana pesangon ke Danantara, menurut Kemnaker', minis: [
      ['Pasal 253', 'UU 27/2026'], ['Belum ada', 'lembaga pengelola'],
    ] },
    facts: { title: 'Yang sudah pasti dan yang belum', items: [
      ['Sudah ada', 'UU 27/2026 Pasal 253 mengamanatkan Dana Cadangan Pesangon.'],
      ['Belum ada', 'Lembaga pengelola dan mekanisme setoran. Peraturan turunannya sedang disiapkan.'],
      ['Tidak benar', 'Kabar bahwa pengusaha wajib menyetor ke Danantara mulai Oktober 2027.'],
    ], source: 'Sumber: ANTARA (15/11), Kompas.com (17/11), Jabar Saber Hoaks (17/11).' },
    bridge: { title: 'Sambil menunggu aturannya, rapikan dasarnya', items: [
      ['Tanggal bergabung', 'Masa kerja dihitung dari sini.'],
      ['Upah dan tunjangan tetap', 'Catat angkanya beserta bulan berlakunya.'],
      ['Status dan kontrak', 'Tetap, kontrak, atau paruh waktu, lengkap dengan akhir kontraknya.'],
    ] },
    app: { title: 'Data karyawan yang siap dihitung.',
      body: 'Simpan tanggal bergabung, jenis pekerjaan, akhir kontrak, dan gaji pokok tiap karyawan. Unduh data karyawan dalam CSV saat dibutuhkan.',
      path: ['Karyawan', 'Tambah Karyawan', 'Laporan'], capture: 'hris-karyawan-form.png', captureAlt: 'Form karyawan: jenis pekerjaan, akhir kontrak, tanggal bergabung, status, dan gaji pokok bulanan', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · Dana cadangan pesangon dan kabar Danantara

Beredar kabar bahwa pengusaha wajib menyetor dana cadangan pesangon ke Danantara. Kemnaker menyatakan kabar itu tidak benar.

Yang sudah ada: UU 27/2026 Pasal 253 mengamanatkan Dana Cadangan Pesangon. Yang belum ada: lembaga pengelola dan mekanisme setorannya. Peraturan turunannya masih disiapkan dan akan melalui konsultasi publik.

Sambil menunggu, yang bisa dirapikan sekarang adalah datanya: tanggal bergabung, upah dan tunjangan tetap, serta status dan akhir kontrak tiap karyawan.

Di Loka Kasir HRIS, data itu tersimpan di profil karyawan dan bisa diunduh dalam CSV.

Coba mode demo:
${HRIS_URL}

Sumber: ANTARA (15/11), Kompas.com (17/11), Jabar Saber Hoaks (17/11).

#LokaKasirHRIS #CekFakta #Pesangon #HRIS`,
    threads: `Loka Kasir HRIS · Cek fakta: kabar pengusaha wajib setor dana pesangon ke Danantara itu tidak benar, kata Kemnaker.

UU 27/2026 memang mengamanatkan Dana Cadangan Pesangon, tapi lembaga pengelola dan mekanismenya belum ditetapkan.

Sambil menunggu, rapikan data masa kerja dan upah karyawan.

${HRIS_URL}`,
  },
  {
    slug: 'acc-bi-rate-6-persen', product: 'accounting', date: '2026-12-03', time: '11:00', theme: 'cobalt',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'steps', label: 'BI-Rate sepanjang 2026', suffix: '%', decimals: 2, points: [['Apr', 4.75], ['Mei', 5.25], ['9 Jun', 5.5], ['18 Jun', 5.75], ['Nov', 6]] },
    category: 'EKONOMI', newsDate: '18 NOV 2026', icon: 'trending-up',
    title: 'BI-Rate naik ke 6%',
    headline: 'BI-Rate naik ke 6%. Cicilan usahamu ikut naik?',
    lead: 'Sejak April, suku bunga acuan sudah naik 125 basis poin.',
    hero: { kind: 'stat', big: '6,00%', label: 'BI-Rate per 18 November 2026', minis: [
      ['+25 bps', 'dari 5,75%'], ['4,75%', 'posisi April 2026'],
    ] },
    facts: { title: 'Keputusan Bank Indonesia', items: [
      ['6,00%', 'BI-Rate naik 25 basis poin dalam Rapat Dewan Gubernur 17–18 November.'],
      ['Alasannya', 'Memperkuat stabilitas rupiah dan menjaga inflasi 2026–2027 di sasaran 2,5±1%.'],
      ['Sejak April', 'BI-Rate naik bertahap dari 4,75% menjadi 6,00%.'],
    ], source: 'Sumber: Bank Indonesia, siaran pers dan data BI-Rate, 18 November 2026.' },
    bridge: { title: 'Tiga hal yang layak dicek bulan ini', items: [
      ['Pinjaman bunga mengambang', 'Tanyakan ke bank apakah cicilan bulan depan berubah.'],
      ['Pisahkan pokok dan bunga', 'Pokok mengurangi utang. Bunga masuk beban bulan itu.'],
      ['Hitung ulang anggaran', 'Kalau beban bunga naik, pos mana yang ditahan dulu?'],
    ] },
    app: { title: 'Catat cicilan, pantau bebannya.',
      body: 'Buat jurnal berulang untuk cicilan bulanan, lalu bandingkan anggaran dengan realisasi per akun.',
      path: ['Jurnal Berulang', 'Anggaran', 'Daftar Laporan'], capture: 'acc-anggaran.png', zoom: 1.7, captureAlt: 'Tabel anggaran, realisasi, selisih, dan capaian per akun beban', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · BI-Rate naik ke 6%

Bank Indonesia menaikkan BI-Rate 25 basis poin menjadi 6,00% pada 18 November 2026. Sejak April, suku bunga acuan sudah naik dari 4,75%.

Bunga pinjaman tidak otomatis ikut naik. Tapi kalau pinjaman usahamu berbunga mengambang, tanyakan ke bank apakah cicilan bulan depan berubah.

Di pembukuan, pisahkan pokok dan bunga. Pokok mengurangi utang, bunga masuk beban bulan itu. Dari situ kelihatan seberapa besar kenaikan bunga memakan laba.

Di Loka Kasir Accounting, cicilan bulanan bisa dibuat sebagai jurnal berulang, lalu anggaran dibandingkan dengan realisasi per akun.

Trial 14 hari:
${ACC_URL}

Sumber: Bank Indonesia, 18 November 2026.

#LokaKasirAccounting #BIRate #SukuBunga #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · BI-Rate naik 25 bps jadi 6,00% (18 November). Sejak April sudah naik dari 4,75%.

Punya pinjaman usaha berbunga mengambang? Tanyakan ke bank soal cicilan bulan depan. Di pembukuan, pisahkan pokok dan bunga supaya kelihatan berapa yang jadi beban.

${ACC_URL}`,
  },
  {
    slug: 'acc-pph-final-umkm-2027', product: 'accounting', date: '2026-12-04', time: '11:00', theme: 'paper',
    category: 'PAJAK', newsDate: '11 NOV 2026', icon: 'receipt-text',
    title: 'PPh final UMKM berakhir untuk sebagian badan usaha',
    headline: 'PT pakai PPh final UMKM sejak 2024? Tahun depan berubah.',
    lead: 'Mulai tahun pajak 2027, sebagian badan usaha pindah ke ketentuan umum.',
    hero: { kind: 'stat', big: '2027', label: 'Sebagian badan usaha keluar dari PPh final UMKM', minis: [
      ['PT', 'pakai sejak tahun pajak 2024'], ['CV, firma, BUMDes', 'pakai sejak 2023'],
    ] },
    facts: { title: 'Ketentuan peralihan PP 20/2026', items: [
      ['PT', 'Yang memakai PPh final UMKM sejak tahun pajak 2024 beralih ke ketentuan umum mulai 2027.'],
      ['CV, firma, BUMDes', 'Yang memakainya sejak tahun pajak 2023 juga beralih mulai 2027.'],
      ['Yang tetap', 'Orang pribadi dan perseroan perorangan, selama omzet setahun belum lebih dari Rp4,8 miliar.'],
    ], source: 'Sumber: DDTCNews, 11 November 2026. Cek kondisi usahamu ke konsultan pajak.' },
    bridge: { title: 'Ketentuan umum: pajak dihitung dari laba', items: [
      ['Butuh laporan laba rugi', 'Dasarnya laba, bukan lagi omzet.'],
      ['Biaya harus punya bukti', 'Nota dan faktur pembelian menentukan beban yang bisa diakui.'],
      ['Mulai dari saldo awal', 'Januari lebih ringan kalau saldo akhir Desember sudah rapi.'],
    ] },
    app: { title: 'Mulai pembukuan sebelum Januari.',
      body: 'Isi saldo awal, catat penjualan dan pembelian, lalu kunci periode tiap bulan. Laba rugi dan neraca tersusun dari jurnal yang sama.',
      path: ['Persiapan Data Perusahaan', 'Tutup Buku', 'Daftar Laporan'], capture: 'acc-tutup-buku.png', captureAlt: 'Periode terkunci: Oktober 2026, status Terkunci', cta: ACC_CTA },
    caption: `Loka Kasir Accounting · PPh final UMKM berakhir untuk sebagian badan usaha

Menurut ketentuan peralihan PP 20/2026 yang dikutip DDTCNews, PT yang memakai PPh final UMKM sejak tahun pajak 2024, serta CV, firma, dan BUMDes yang memakainya sejak 2023, beralih ke ketentuan umum mulai tahun pajak 2027.

Orang pribadi dan perseroan perorangan tetap bisa memakai PPh final selama omzet setahun belum lebih dari Rp4,8 miliar.

Di ketentuan umum, pajak dihitung dari laba. Artinya usaha perlu laporan laba rugi, bukti biaya, dan saldo awal yang rapi.

Di Loka Kasir Accounting, isi saldo awal, catat penjualan dan pembelian, lalu kunci periode tiap bulan. Laba rugi dan neraca tersusun dari jurnal yang sama.

Ini ringkasan berita, bukan nasihat pajak. Cek kondisi usahamu ke konsultan pajak.

Trial 14 hari:
${ACC_URL}

#LokaKasirAccounting #PPhFinal #PajakUMKM #PembukuanBisnis`,
    threads: `Loka Kasir Accounting · PT yang pakai PPh final UMKM sejak tahun pajak 2024, serta CV, firma, dan BUMDes sejak 2023, beralih ke ketentuan umum mulai 2027 (PP 20/2026, via DDTCNews).

Ketentuan umum = pajak dihitung dari laba. Butuh laporan laba rugi dan bukti biaya. Mulai rapikan sebelum Januari.

${ACC_URL}`,
  },
  {
    slug: 'hris-bsu-data-upah', product: 'hris', date: '2026-12-05', time: '11:00', theme: 'sun',
    // Posting ini tayang sebagai satu video (Reels); `video` mengatur visual pembuka di Remotion.
    video: { kind: 'count', prefix: 'Rp', value: 900, suffix: ' ribu', chips: ['Rp300 ribu', 'Rp300 ribu', 'Rp300 ribu'], label: 'BSU 2026, dibayar sekaligus', minis: [['Rp3,5 juta', 'batas upah per bulan'], ['Agustus 2026', 'peserta aktif sampai']] },
    category: 'KETENAGAKERJAAN', newsDate: '5 NOV 2026', icon: 'banknote',
    title: 'BSU 2026 dan data upah dari pemberi kerja',
    headline: 'BSU Rp900 ribu: yang dicek data dari kantor.',
    lead: 'Pekerja tidak perlu mendaftar. Penentunya upah dan kepesertaan yang dilaporkan pemberi kerja.',
    hero: { kind: 'stat', big: 'Rp900 ribu', label: 'BSU 2026, dibayar sekaligus', minis: [
      ['Rp300 ribu', '× 3 bulan'], ['Rp3,5 juta', 'batas upah per bulan'],
    ] },
    facts: { title: 'Syarat penerima BSU 2026', items: [
      ['Peserta aktif', 'Terdaftar di BPJS Ketenagakerjaan sampai Agustus 2026.'],
      ['Batas upah', 'Paling banyak Rp3,5 juta per bulan, atau setara upah minimum setempat bila lebih tinggi.'],
      ['Dasar datanya', 'Upah terakhir yang dilaporkan pemberi kerja: gaji pokok dan tunjangan tetap.'],
    ], source: 'Sumber: Kemnaker, 5 November 2026 (Permenaker 16/2026). Cek status di bsu.kemnaker.go.id.' },
    bridge: { title: 'Bagian pemberi kerja: datanya harus benar', items: [
      ['Upah yang dilaporkan sesuai', 'Gaji pokok dan tunjangan tetap sama dengan yang dibayarkan.'],
      ['Kepesertaan tidak putus', 'Karyawan baru didaftarkan, iuran dibayar tiap bulan.'],
      ['Rekap siap dibuka', 'Saat karyawan bertanya, angkanya bisa ditunjukkan.'],
    ] },
    app: { title: 'Rekap payroll dan BPJS tiap bulan.',
      body: 'Atur program BPJS dan dasar upah di profil payroll tiap karyawan. Setelah payroll final, unduh rekap payroll dan iuran BPJS dalam CSV.',
      path: ['Aturan Payroll', 'Payroll', 'Laporan'], capture: 'hris-laporan.png', captureAlt: 'Halaman Laporan: rekap lembur dan klaim, rekap payroll, rekap PPh 21 final, dan rekap iuran BPJS final', cta: HRIS_CTA },
    caption: `Loka Kasir HRIS · BSU 2026 dan data upah dari pemberi kerja

BSU 2026 sebesar Rp300 ribu per bulan untuk tiga bulan, dibayar sekaligus Rp900 ribu. Pekerja tidak perlu mendaftar.

Syaratnya menurut Kemnaker: WNI, peserta aktif BPJS Ketenagakerjaan sampai Agustus 2026, dan upah paling banyak Rp3,5 juta per bulan atau setara upah minimum setempat. Yang dipakai adalah upah terakhir yang dilaporkan pemberi kerja: gaji pokok dan tunjangan tetap.

Jadi bagian pemberi kerja jelas: upah yang dilaporkan sesuai dengan yang dibayarkan, dan kepesertaan tidak putus.

Di Loka Kasir HRIS, program BPJS dan dasar upah diatur di profil payroll tiap karyawan. Setelah payroll final, rekap payroll dan iuran BPJS bisa diunduh dalam CSV. Pelaporan ke BPJS tetap dilakukan di kanal resminya.

Cek status BSU di bsu.kemnaker.go.id.

Coba mode demo:
${HRIS_URL}

Sumber: Kemnaker, 5 November 2026.

#LokaKasirHRIS #BSU2026 #BPJSKetenagakerjaan #Payroll`,
    threads: `Loka Kasir HRIS · BSU 2026: Rp900 ribu dibayar sekaligus, tanpa perlu mendaftar.

Yang dicek: peserta aktif BPJS Ketenagakerjaan sampai Agustus 2026 dan upah terakhir yang dilaporkan pemberi kerja (maks. Rp3,5 juta atau setara upah minimum setempat).

Pemberi kerja, pastikan datanya sesuai.

${HRIS_URL}`,
  },
]

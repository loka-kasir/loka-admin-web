// Naskah kampanye perkenalan Loka Kasir Billing (billing rental PlayStation & warnet).
// `node build.cjs` menurunkannya menjadi campaign.json, carousel.html, galeri, kalender, dan caption.
// Fitur yang disebut mengikuti README dan halaman billing.lokakasir.id per 22 November 2026.
// Angka rupiah di posting "contoh hitungan" adalah contoh dan diberi label begitu.
// Slot tayang berasal dari ../2026-kalender-2x-sehari/moves.json (billing_slots).

const URL = 'https://billing.lokakasir.id/'
const CTA = 'Gratis 14 hari di billing.lokakasir.id'
// Bagian layar kasir (2360 × 1640 px) yang ditampilkan: area isi tanpa sidebar.
const area = (top) => [496, top, 2360, top + 900]

module.exports = [
  {
    slug: 'billing-kenalan', product: 'billing', date: '2026-11-24', time: '20:00', theme: 'navy',
    chip: 'BARU', category: 'RENTAL PS & WARNET', newsDate: '', icon: 'gamepad-2',
    title: 'Kenalan dengan Loka Kasir Billing',
    headline: 'Rental PS: timernya jalan sendiri di tiap TV.',
    lead: 'Kenalan dengan Loka Kasir Billing, sistem billing untuk rental PlayStation dan warnet.',
    hero: { kind: 'shot', image: 'tv-playing.png', alt: 'Layar TV saat sesi berjalan: cincin sisa waktu, rincian tagihan, dan tombol Pesan Makanan, Tambah Waktu, Panggil Kasir', caption: 'Tampilan di TV saat sesi berjalan · data contoh' },
    facts: { kicker: 'Cara kerjanya', title: 'Satu sistem, tiga layar', items: [
      ['Android TV', 'Aplikasi di tiap TV menampilkan sisa waktu dan tagihan. PlayStation tetap tersambung lewat HDMI.'],
      ['Kasir web', 'Mulai, tambah waktu, jeda, dan stop sesi dari browser PC, laptop, atau tablet.'],
      ['PC warnet', 'Aplikasi Windows mengunci layar saat PC kosong dan menampilkan timer saat sesi berjalan.'],
    ], source: 'Fitur per November 2026. Rinciannya di billing.lokakasir.id.' },
    bridge: { kicker: 'Di rental', title: 'Yang biasanya bikin repot', items: [
      ['Waktu dicatat manual', 'Stopwatch dan buku gampang terlewat saat rental ramai.'],
      ['Bolak-balik ke TV', 'Kasir mengingatkan pemain satu per satu.'],
      ['Rekap tiap malam', 'Pendapatan dihitung ulang dari catatan.'],
    ] },
    app: { title: 'Semua stasiun di satu layar.',
      body: 'Monitor Stasiun menampilkan sisa waktu, status, dan tagihan berjalan tiap TV. Perubahan di kasir langsung tampil di TV.',
      path: ['Perangkat', 'Stasiun & Tarif', 'Monitor Stasiun'], capture: 'kasir-monitor.png', photoFocus: [540, 830, 1730, 1410], focus: [540, 830, 2330, 1640], captureAlt: 'Monitor Stasiun: tiga TV dengan cincin hitung mundur, nama pemain, dan tagihan berjalan', cta: CTA },
    caption: `Loka Kasir Billing · Kenalan dengan Loka Kasir Billing

Punya rental PlayStation atau warnet? Loka Kasir Billing mengurus waktunya.

Aplikasi di tiap Android TV menampilkan hitung mundur dan tagihan. PlayStation tetap tersambung lewat HDMI seperti biasa, tanpa modifikasi. Saat waktu habis, layar Waktu Habis muncul di atas game.

Kasir memantau semua stasiun dari browser: mulai, tambah waktu, jeda, stop, dan pindah stasiun. Untuk warnet ada aplikasi Windows yang mengunci PC saat kosong.

Pendapatan, jam ramai, dan performa tiap stasiun ada di laporan.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #Warnet #BillingRental`,
    threads: `Loka Kasir Billing · Punya rental PlayStation atau warnet?

Aplikasi di tiap Android TV menghitung mundur sendiri dan menampilkan layar Waktu Habis di atas game. Kasir memantau semua stasiun dari browser. PlayStation tidak perlu dimodifikasi.

Gratis 14 hari: ${URL}`,
  },
  {
    slug: 'billing-gta6-rental-ramai', product: 'billing', date: '2026-11-28', time: '20:00', theme: 'ink',
    category: 'GAME', newsDate: '19 NOV 2026', icon: 'gamepad-2',
    title: 'GTA 6 dan rental PS5 yang ramai',
    headline: 'GTA 6 Rp1,3 juta. Rental PS5 siap ramai?',
    lead: 'Game baru biasanya bikin orang penasaran mencoba. Rentalmu siap kalau antre?',
    hero: { kind: 'stat', big: 'Rp1.321.000', label: 'Harga GTA 6 Standard Edition di PlayStation Store Indonesia', minis: [
      ['PS5 & Xbox', 'platform saat rilis'], ['19 Nov 2026', 'tanggal rilis'],
    ] },
    video: { kind: 'count', prefix: 'Rp', value: 1321000, label: 'Harga GTA 6 Standard Edition di PlayStation Store Indonesia', minis: [['PS5 & Xbox', 'platform saat rilis'], ['19 Nov 2026', 'tanggal rilis']] },
    facts: { title: 'Rilis yang lama ditunggu', items: [
      ['19 November', 'GTA 6 bisa dimainkan di Indonesia sejak pukul 00.00 WIB.'],
      ['PS5 dan Xbox', 'Rilis untuk PlayStation 5 dan Xbox Series X|S.'],
      ['Rp1.321.000', 'Harga Standard Edition di PlayStation Store Indonesia.'],
    ], source: 'Sumber: Kompas.com, 19 November 2026.' },
    bridge: { kicker: 'Buat rentalmu', title: 'Kalau rental mendadak ramai', items: [
      ['Antrean perlu jadwal', 'Booking per stasiun mencegah dua orang dijanjikan TV yang sama.'],
      ['Waktu harus tepat', 'Timer berhenti sendiri, jadi giliran berikutnya tidak molor.'],
      ['Tarif harus jelas', 'Paket dan harga per jam terlihat sebelum main.'],
    ] },
    app: { title: 'Booking per stasiun, tanpa bentrok.',
      body: 'Klik slot kosong di jadwal untuk memesan. Saat pemain datang, check-in satu klik langsung memulai sesi.',
      path: ['Booking', 'Booking baru', 'Check-in'], capture: 'kasir-booking.png', photoFocus: area(300), focus: area(300), captureAlt: 'Halaman Booking: jadwal per stasiun dalam garis waktu per jam', cta: CTA },
    caption: `Loka Kasir Billing · GTA 6 dan rental PS5 yang ramai

GTA 6 rilis 19 November untuk PlayStation 5 dan Xbox Series X|S. Harga Standard Edition di PlayStation Store Indonesia Rp1.321.000.

Game besar biasanya bikin banyak orang penasaran mencoba. Kalau rentalmu punya PS5, siapkan tiga hal sebelum antre:

1. Jadwal. Booking per stasiun mencegah dua orang dijanjikan TV yang sama.
2. Waktu. Timer yang berhenti sendiri menjaga giliran berikutnya tidak molor.
3. Tarif. Paket dan harga per jam terlihat sebelum main.

Di Loka Kasir Billing, booking dibuat dari jadwal per stasiun, dan check-in satu klik langsung memulai sesi.

Gratis 14 hari, tanpa kartu kredit:
${URL}

Sumber: Kompas.com, 19 November 2026.

#LokaKasirBilling #GTA6 #RentalPS #BillingRental`,
    threads: `Loka Kasir Billing · GTA 6 rilis untuk PS5 dan Xbox Series X|S, harganya Rp1.321.000 di PlayStation Store Indonesia.

Punya rental PS5? Siapkan jadwal booking per stasiun, timer yang berhenti sendiri, dan tarif yang jelas sebelum antre.

${URL}`,
  },
  {
    slug: 'billing-menit-bocor', product: 'billing', date: '2026-12-04', time: '11:00', theme: 'cobalt',
    chip: 'CONTOH HITUNGAN', category: 'RENTAL PS', newsDate: '', icon: 'calendar-clock',
    title: 'Menit yang lewat tanpa tagihan',
    headline: '“Lima menit lagi, Bang.” Sebulan jadi berapa?',
    lead: 'Menit yang lewat tanpa tercatat kelihatannya kecil.',
    hero: { kind: 'stat', big: 'Rp1,6 juta', label: 'Contoh: 10 menit lewat di tiap sesi, selama sebulan', minis: [
      ['8 TV', '5 sesi sehari per TV'], ['Rp8.000', 'tarif per jam'],
    ] },
    facts: { kicker: 'Contoh hitungan', title: 'Dari mana Rp1,6 juta?', items: [
      ['40 sesi', '8 TV, masing-masing 5 sesi sehari.'],
      ['400 menit', 'Tiap sesi lewat 10 menit: hampir 7 jam main tanpa tagihan per hari.'],
      ['Rp53.333', '400 menit × Rp8.000 per jam. Dikali 30 hari: Rp1,6 juta.'],
    ], source: 'Contoh hitungan, bukan data rental. Coba dengan angka rentalmu sendiri.' },
    bridge: { kicker: 'Di rental', title: 'Bukan salah kasirnya', items: [
      ['Rental lagi ramai', 'Satu kasir memantau banyak TV sekaligus.'],
      ['Nggak enak menegur', 'Mengingatkan pemain berkali-kali itu canggung.'],
      ['Stopwatch bisa lupa', 'Sekali terlewat, menitnya hilang.'],
    ] },
    app: { title: 'Waktu habis, layar TV yang bilang.',
      body: 'Beberapa menit sebelum habis, peringatan muncul di TV. Saat waktu habis, layar Waktu Habis menutup game dan menampilkan tagihan.',
      path: ['Peringatan di TV', 'Waktu Habis', 'Bayar di kasir'], capture: 'tv-timeup.png', captureAlt: 'Layar TV Waktu Habis dengan total tagihan dan tombol Panggil Kasir', cta: CTA },
    caption: `Loka Kasir Billing · Menit yang lewat tanpa tagihan

“Lima menit lagi, Bang.” Kedengarannya sepele.

Contoh hitungan: rental dengan 8 TV, tiap TV 5 sesi sehari, tarif Rp8.000 per jam. Kalau tiap sesi lewat 10 menit tanpa ditagih, itu 400 menit sehari atau Rp53.333. Sebulan: Rp1,6 juta.

Ini bukan salah kasirnya. Satu orang memantau banyak TV, dan menegur pemain berkali-kali itu canggung.

Di Loka Kasir Billing, yang mengingatkan adalah layar TV. Peringatan muncul beberapa menit sebelum habis. Saat waktu habis, layar Waktu Habis menutup game dan menampilkan tagihan.

Angka di atas contoh. Coba hitung dengan angka rentalmu.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #BillingRental #TipsUsaha`,
    threads: `Loka Kasir Billing · “Lima menit lagi, Bang.”

Contoh: 8 TV, 5 sesi sehari, tarif Rp8.000 per jam. Tiap sesi lewat 10 menit = Rp53.333 sehari, Rp1,6 juta sebulan.

Di Loka Kasir Billing, layar TV yang mengingatkan dan menutup game saat waktu habis.

${URL}`,
  },
  {
    slug: 'billing-shift-selisih', product: 'billing', date: '2026-12-06', time: '11:00', theme: 'navy',
    chip: 'CONTOH HITUNGAN', category: 'SHIFT KASIR', newsDate: '', icon: 'wallet',
    title: 'Selisih kas per shift',
    headline: 'Laci kurang Rp20 ribu. Ketahuannya kapan?',
    lead: 'Kalau baru dihitung akhir minggu, sudah susah ditelusuri.',
    hero: { kind: 'versus', badge: '−Rp20 ribu', rows: [
      ['Kas seharusnya', 'Rp700.000'],
      ['Uang di laci', 'Rp680.000'],
    ] },
    video: { kind: 'versus', prefix: 'Rp', badge: 'Selisih Rp20 ribu', rows: [['Uang di laci', 680000], ['Kas seharusnya', 700000]] },
    facts: { kicker: 'Contoh hitungan', title: 'Hitungan satu shift', items: [
      ['Rp300.000', 'Modal awal di laci saat shift dibuka.'],
      ['Rp400.000', 'Isi ulang saldo member yang dibayar tunai selama shift.'],
      ['Rp700.000', 'Kas yang seharusnya ada. Kalau dihitung Rp680.000, selisihnya Rp20.000.'],
    ], source: 'Contoh hitungan dari data contoh, bukan data rental.' },
    bridge: { kicker: 'Buat rentalmu', title: 'Biar selisih cepat ketemu', items: [
      ['Buka shift tiap jaga', 'Catat modal awal sebelum transaksi pertama.'],
      ['Hitung saat tutup', 'Uang fisik dihitung, bukan dikira-kira.'],
      ['Satu kasir, satu shift', 'Laporan bisa dilihat per kasir.'],
    ] },
    app: { title: 'Tutup shift, selisih langsung kelihatan.',
      body: 'Shift Kasir menghitung kas yang seharusnya dari modal awal dan transaksi tunai. Masukkan hasil hitung uang fisik, selisihnya tampil dan bisa dicetak.',
      path: ['Shift Kasir', 'Buka shift', 'Tutup shift'], capture: 'kasir-shift.png', photoFocus: area(190), focus: area(190), captureAlt: 'Halaman Shift Kasir: shift berjalan, kas seharusnya di laci Rp700.000, dan rincian shift', cta: CTA },
    caption: `Loka Kasir Billing · Selisih kas per shift

Laci kurang Rp20 ribu. Kalau baru ketahuan akhir minggu, sudah susah dicari penyebabnya.

Contoh hitungan satu shift: modal awal Rp300.000, isi ulang saldo member yang dibayar tunai Rp400.000. Kas yang seharusnya ada Rp700.000. Saat dihitung ternyata Rp680.000. Selisih Rp20.000 langsung kelihatan di hari yang sama.

Tiga kebiasaan yang membantu: buka shift tiap jaga, hitung uang fisik saat tutup, dan satu kasir satu shift.

Di Loka Kasir Billing, Shift Kasir menghitung kas yang seharusnya dari modal awal dan transaksi tunai. Hasil hitung dimasukkan saat tutup shift, selisihnya tampil dan bisa dicetak.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #ShiftKasir #BillingRental`,
    threads: `Loka Kasir Billing · Laci kurang Rp20 ribu. Ketahuannya kapan?

Contoh: modal awal Rp300.000 + tunai masuk Rp400.000 = seharusnya Rp700.000. Dihitung Rp680.000. Kalau shift ditutup tiap jaga, selisihnya ketemu hari itu juga.

${URL}`,
  },
  {
    slug: 'billing-pesan-dari-tv', product: 'billing', date: '2026-12-09', time: '11:00', theme: 'ink',
    chip: 'FITUR', category: 'F&B DI RENTAL', newsDate: '', icon: 'megaphone',
    title: 'Pesan makanan dari TV',
    headline: 'Lagi seru main, lapar. Pesannya dari TV.',
    lead: 'Pemain memilih menu pakai remote. Kasir tinggal menyetujui.',
    hero: { kind: 'shot', image: 'tv-order_menu.png', alt: 'Layar TV Pesan Makanan & Minuman dengan daftar menu dan tombol Kirim Pesanan', caption: 'Menu pesan makanan di TV · data contoh' },
    facts: { kicker: 'Alurnya', title: 'Dari remote sampai struk', items: [
      ['Pesan', 'Pemain membuka Pesan Makanan di TV dan memilih menu.'],
      ['Setujui', 'Pesanan muncul di kasir. Satu klik, langsung masuk tagihan sesi.'],
      ['Bayar', 'Sewa dan makanan dibayar sekaligus. Stok berkurang otomatis.'],
    ], source: 'Menu dan harga di gambar adalah data contoh.' },
    bridge: { kicker: 'Di rental', title: 'Yang berubah di rental', items: [
      ['Pemain tetap di kursi', 'Pesanan dikirim tanpa meninggalkan permainan.'],
      ['Kasir tidak perlu mencatat', 'Pesanan sudah tertulis dan terikat ke stasiunnya.'],
      ['Tagihan tidak tercecer', 'Makanan dan sewa ada di satu struk.'],
    ] },
    app: { title: 'Makanan masuk ke tagihan sesi.',
      body: 'Untuk pembeli yang tidak sedang main, pakai Kasir F&B. Menu dan stoknya diatur di Produk F&B.',
      path: ['Pesan Makanan', 'Kasir F&B', 'Produk F&B'], capture: 'kasir-pos.png', photoFocus: [496, 300, 1630, 860], focus: [496, 300, 1630, 1100], captureAlt: 'Halaman Kasir F&B: daftar makanan dan minuman dengan stok dan harga', cta: CTA },
    caption: `Loka Kasir Billing · Pesan makanan dari TV

Lagi seru main, lapar. Daripada berdiri dan meninggalkan permainan, pemain bisa memesan dari TV.

Alurnya: pemain membuka Pesan Makanan di TV dan memilih menu dengan remote. Pesanan muncul di kasir. Satu klik untuk menyetujui, lalu pesanan masuk ke tagihan sesi itu. Saat selesai, sewa dan makanan dibayar sekaligus, dan stok berkurang otomatis.

Kasir tidak perlu mencatat di kertas, dan tagihan makanan tidak tercecer dari tagihan sewa.

Untuk pembeli yang tidak sedang main, ada Kasir F&B.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #Warnet #BillingRental`,
    threads: `Loka Kasir Billing · Lagi seru main, lapar.

Pemain memesan makanan dari TV pakai remote. Kasir menyetujui satu klik, pesanan masuk ke tagihan sesi, dan stok berkurang otomatis. Sewa dan makanan dibayar sekaligus.

${URL}`,
  },
  {
    slug: 'billing-member-saldo', product: 'billing', date: '2026-12-13', time: '11:00', theme: 'cobalt',
    chip: 'FITUR', category: 'MEMBER & SALDO', newsDate: '', icon: 'hand-coins',
    title: 'Member dan saldo deposit',
    headline: 'Isi saldo sekali, main berkali-kali.',
    lead: 'Isi ulang di kasir. Main dan jajan dipotong dari saldo.',
    hero: { kind: 'stat', big: 'Rp110 ribu', label: 'Contoh saldo setelah isi Rp100 ribu dengan bonus Rp10 ribu', minis: [
      ['Rp100 ribu', 'isi ulang'], ['Rp10 ribu', 'bonus promo'],
    ] },
    video: { kind: 'count', prefix: 'Rp', value: 110, suffix: ' ribu', chips: ['Isi Rp100 ribu', 'Bonus Rp10 ribu'], label: 'Contoh saldo member setelah isi ulang', minis: [['Main', 'dipotong dari saldo'], ['F&B', 'juga bisa pakai saldo']] },
    facts: { kicker: 'Cara kerjanya', title: 'Saldo member', items: [
      ['Isi ulang', 'Pelanggan mengisi saldo di kasir. Bonus promo bisa ditambahkan.'],
      ['Bayar', 'Main dan F&B dibayar dari saldo saat checkout.'],
      ['Riwayat', 'Setiap mutasi saldo tercatat, termasuk refund saat transaksi dibatalkan.'],
    ], source: 'Angka bonus adalah contoh. Besarnya ditentukan pemilik rental.' },
    bridge: { kicker: 'Buat pemilik', title: 'Yang perlu diingat pemilik', items: [
      ['Saldo itu titipan', 'Uang isi ulang belum jadi pendapatan sampai dipakai.'],
      ['Bonus itu biaya', 'Hitung dulu sebelum menjadikannya promo.'],
      ['Catat tiap mutasi', 'Supaya saldo pelanggan dan kas cocok.'],
    ] },
    app: { title: 'Member & Saldo di satu halaman.',
      body: 'Lihat saldo yang beredar, isi ulang, dan riwayat tiap member. Jumlah kunjungan dan total belanja ikut tercatat.',
      path: ['Member & Saldo', 'Member baru', 'Isi ulang'], capture: 'kasir-member.png', photoFocus: area(190), focus: area(190), captureAlt: 'Halaman Member & Saldo: saldo member beredar, jumlah member, dan daftar member dengan saldonya', cta: CTA },
    caption: `Loka Kasir Billing · Member dan saldo deposit

Pelanggan tetap bisa menyimpan saldo di rentalmu. Isi ulang di kasir, lalu main dan jajan dipotong dari saldo.

Contoh: isi Rp100 ribu dengan bonus promo Rp10 ribu, saldonya jadi Rp110 ribu. Besar bonus ditentukan pemilik rental.

Tiga hal yang perlu diingat pemilik:
1. Saldo itu titipan. Belum jadi pendapatan sampai dipakai.
2. Bonus itu biaya. Hitung dulu sebelum dijadikan promo.
3. Setiap mutasi harus tercatat supaya saldo pelanggan dan kas cocok.

Di Loka Kasir Billing, halaman Member & Saldo menampilkan saldo yang beredar, riwayat mutasi, jumlah kunjungan, dan total belanja tiap member. Refund saat transaksi dibatalkan tercatat otomatis.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #Member #BillingRental`,
    threads: `Loka Kasir Billing · Pelanggan tetap bisa menyimpan saldo di rentalmu: isi ulang di kasir, main dan jajan dipotong dari saldo.

Ingat: saldo itu titipan, belum jadi pendapatan sampai dipakai. Bonus isi ulang itu biaya. Setiap mutasi harus tercatat.

${URL}`,
  },
  {
    slug: 'billing-internet-mati', product: 'billing', date: '2026-12-16', time: '11:00', theme: 'sky',
    chip: 'SERING DITANYA', category: 'INTERNET & LISTRIK', newsDate: '', icon: 'shield-check',
    title: 'Internet mati dan mati lampu',
    headline: 'Internet mati. Timer di TV ikut mati?',
    lead: 'Jawabannya tergantung letak servernya.',
    hero: { kind: 'ticker', rows: [
      ['Server lokal', 'Kasir, TV, dan PC tetap jalan lewat jaringan lokal'],
      ['Server internet', 'Sesi paket tetap terkunci tepat waktu'],
      ['Mati lampu', 'Sesi dijeda otomatis sejak server mati'],
    ] },
    facts: { kicker: 'Jawabannya', title: 'Tiga keadaan', items: [
      ['Server di PC rental', 'Internet putus, kasir web, TV, dan PC tetap berjalan lewat Wi-Fi atau LAN.'],
      ['Server di internet saja', 'Kasir tidak bisa memulai atau menutup sesi. Sesi paket yang berjalan tetap terkunci tepat waktu.'],
      ['Mati lampu', 'Setelah server menyala lagi, kasir memilih: waktu mati diganti atau tetap dihitung.'],
    ], source: 'Sumber: panduan Loka Kasir Billing. Server lokal bersifat opsional.' },
    bridge: { kicker: 'Buat rentalmu', title: 'Saran pemasangan', items: [
      ['Mau jalan tanpa internet', 'Pasang server lokal di PC rental.'],
      ['Pakai UPS', 'Untuk PC server dan router.'],
      ['IP server tetap', 'Atur di router supaya TV selalu menemukan server.'],
    ] },
    app: { title: 'TV tetap menghitung mundur.',
      body: 'Aplikasi TV menampilkan sisa waktu dan tagihan, dengan tombol Pesan Makanan, Tambah Waktu, dan Panggil Kasir.',
      path: ['Pesan Makanan', 'Tambah Waktu', 'Panggil Kasir'], capture: 'tv-playing.png', captureAlt: 'Layar TV saat sesi berjalan: cincin sisa waktu 01:30:00, rincian tagihan, dan tombol aksi', cta: CTA },
    caption: `Loka Kasir Billing · Internet mati dan mati lampu

Pertanyaan yang sering muncul: kalau internet mati, timer di TV ikut mati?

Jawabannya tergantung letak server.

Server di PC rental (lokal): kasir web, TV, dan PC tetap berjalan lewat Wi-Fi atau LAN walau internet putus.

Server di internet saja: kasir tidak bisa memulai atau menutup sesi selama internet putus. Sesi paket yang sedang berjalan tetap terkunci tepat waktu.

Mati lampu: setelah server menyala lagi, sesi yang tadi berjalan dijeda otomatis sejak server mati. Kasir memilih apakah waktu mati diganti atau tetap dihitung.

Saran: kalau mau tetap jalan tanpa internet, pasang server lokal. Pakai UPS untuk PC server dan router, dan atur IP server tetap di router.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #Warnet #BillingRental`,
    threads: `Loka Kasir Billing · Internet mati, timer di TV ikut mati?

Server lokal di PC rental: semua tetap jalan lewat LAN. Server di internet saja: kasir tidak bisa mulai atau tutup sesi, tapi sesi paket tetap terkunci tepat waktu.

Saran: server lokal + UPS untuk PC server dan router.

${URL}`,
  },
  {
    slug: 'billing-tarif-per-jam', product: 'billing', date: '2026-12-19', time: '11:00', theme: 'paper',
    chip: 'FITUR', category: 'TARIF RENTAL', newsDate: '', icon: 'badge-percent',
    title: 'Tarif berdasarkan jam',
    headline: 'Siang sepi, malam penuh. Tarifnya masih sama?',
    lead: 'Tarif bisa berbeda menurut jam dan hari.',
    hero: { kind: 'stat', big: 'Rp10 ribu', label: 'Contoh tarif per jam di malam hari', minis: [
      ['Rp6 ribu', 'happy hour siang'], ['Rp8 ribu', 'tarif biasa'],
    ] },
    video: { kind: 'steps', label: 'Contoh tarif per jam', prefix: 'Rp', suffix: ' ribu', decimals: 0, points: [['Siang', 6], ['Sore', 8], ['Malam', 10]] },
    facts: { kicker: 'Cara kerjanya', title: 'Tarif berdasarkan jam', items: [
      ['Happy hour', 'Tarif lebih murah di jam sepi, misalnya siang hari kerja.'],
      ['Malam, akhir pekan', 'Tarif bisa dibuat berbeda untuk jam dan hari ramai.'],
      ['Argo', 'Main per jam dihitung menit demi menit sesuai tarif yang berlaku saat itu.'],
    ], source: 'Angka tarif adalah contoh. Tarif ditentukan pemilik rental.' },
    bridge: { kicker: 'Buat pemilik', title: 'Sebelum mengubah tarif', items: [
      ['Lihat jam ramai', 'Laporan menunjukkan jam berapa stasiun paling terpakai.'],
      ['Ubah satu hal dulu', 'Coba happy hour di satu rentang jam, lalu bandingkan.'],
      ['Tulis dengan jelas', 'Tarif yang berlaku tampil di monitor dan di TV.'],
    ] },
    app: { title: 'Lihat dulu jam ramainya.',
      body: 'Laporan menampilkan pendapatan, jam ramai, performa stasiun, dan produk terlaris. Tarif per jam diatur di Stasiun & Tarif.',
      path: ['Laporan', 'Stasiun & Tarif'], capture: 'kasir-laporan.png', photoFocus: area(230), focus: area(230), captureAlt: 'Halaman Laporan: total pendapatan, sewa, F&B, jumlah transaksi, dan total jam main', cta: CTA },
    caption: `Loka Kasir Billing · Tarif berdasarkan jam

Siang sepi, malam penuh. Kalau tarifnya sama sepanjang hari, jam sepi tetap sepi.

Di Loka Kasir Billing, tarif bisa berbeda menurut jam dan hari: happy hour siang, tarif malam, dan akhir pekan. Untuk main per jam (argo), tagihan dihitung menit demi menit sesuai tarif yang berlaku saat itu. Tarif yang sedang berlaku tampil di monitor kasir dan di TV.

Contoh: Rp6 ribu per jam di siang hari, Rp8 ribu sore, Rp10 ribu malam. Angkanya contoh; tarif ditentukan pemilik rental.

Sebelum mengubah tarif, lihat dulu jam ramai di Laporan. Ubah satu rentang jam, lalu bandingkan hasilnya.

Gratis 14 hari, tanpa kartu kredit:
${URL}

#LokaKasirBilling #RentalPS #HappyHour #BillingRental`,
    threads: `Loka Kasir Billing · Siang sepi, malam penuh. Tarifnya masih sama?

Tarif bisa berbeda menurut jam dan hari: happy hour siang, tarif malam, akhir pekan. Main per jam dihitung menit demi menit sesuai tarif yang berlaku.

Lihat dulu jam ramai di Laporan sebelum mengubah tarif.

${URL}`,
  },
]

# KML Tools Workspace

KML Tools Workspace adalah kumpulan aplikasi geospasial berbasis peramban untuk membantu pengolahan data KML, KMZ, CSV, dan Excel dalam satu ruang kerja terpusat. Seluruh proses inti dijalankan di sisi klien, sehingga data utama diproses langsung di peramban tanpa memerlukan backend khusus untuk fungsi utamanya.

Repositori ini dibangun sebagai situs statis. Aplikasi dapat dijalankan secara lokal melalui peramban, melalui server HTTP sederhana, maupun dipublikasikan dengan GitHub Pages.

## Gambaran Umum

Ruang kerja ini terdiri atas satu halaman utama dan lima modul operasional:

1. `index.html` sebagai ruang kerja utama yang memuat seluruh modul.
2. `converter.html` untuk konversi dua arah antara CSV dan KML.
3. `tiangnew.html` untuk pembuatan placemark tiang baru secara otomatis di sepanjang jalur.
4. `asesoristiang.html` untuk analisis kebutuhan asesoris berdasarkan data KML/KMZ eksisting.
5. `splitline.html` untuk memecah path KML menjadi beberapa segmen.
6. `ukurallpro.html` untuk menghitung jarak jalan aktual secara massal menggunakan OSRM dan OpenStreetMap.

Karakteristik utama proyek ini adalah sebagai berikut:

- Tidak memerlukan tahap kompilasi atau bundel aset.
- Memanfaatkan halaman HTML mandiri yang dapat diakses langsung.
- Menggunakan iframe pada `index.html` untuk menyatukan seluruh modul dalam satu antarmuka.
- Mendukung pratinjau peta interaktif melalui Leaflet dan OpenStreetMap.
- Memanfaatkan pustaka CDN untuk beberapa fungsi tambahan seperti pembacaan KMZ, CSV, dan Excel.

## Ringkasan Modul

| Modul | Fungsi Utama | Input Utama | Output Utama |
| --- | --- | --- | --- |
| `index.html` | Ruang kerja utama dan navigasi antarmodul | Tidak ada input data khusus | Akses terpadu ke seluruh modul |
| `converter.html` | Konversi CSV ke KML dan KML ke CSV | `.csv`, `.kml`, `.txt` | File `.kml` atau `.csv` |
| `tiangnew.html` | Pembuatan placemark tiang otomatis berdasarkan interval | `.kml`, `.kmz` | File KML baru berisi placemark |
| `asesoristiang.html` | Analisis dan penambahan folder asesoris pada KML eksisting | `.kml`, `.kmz` | File KML asesoris, ringkasan, tabel, peta |
| `splitline.html` | Pemecahan jalur KML menjadi segmen-segmen lebih pendek | `.kml`, `.xml` | KML gabungan atau beberapa file KML segmen |
| `ukurallpro.html` | Perhitungan jarak jalan aktual dari banyak titik ke titik target terdekat | `.xlsx`, `.xls`, `.csv`, `.kml` | Tabel hasil, peta rute, file Excel |

## Uraian Tiap Aplikasi

### 1. Workspace Utama (`index.html`)

Halaman ini berfungsi sebagai pusat akses seluruh modul. Modul dimuat di dalam iframe dan tinggi konten disesuaikan otomatis melalui `postMessage`, sehingga setiap aplikasi tetap dapat dibuka dalam satu halaman tanpa kehilangan konteks kerja.

Fitur utama:

- Navigasi antarmodul dari satu halaman.
- Tombol pembukaan modul dalam tab atau jendela tersendiri.
- Penyesuaian mode tersemat untuk penggunaan dalam iframe.
- Dukungan penyesuaian tampilan bila dijalankan di lingkungan Telegram WebApp.
- Tombol `Force Reload Core` untuk membersihkan cache, cookie, dan storage bila diperlukan.

### 2. Konverter CSV dan KML (`converter.html`)

Modul ini menyediakan konversi dua arah antara data tabular dan data spasial sederhana berbasis placemark.

Kemampuan utama:

- Mengubah CSV menjadi KML.
- Mengubah KML menjadi CSV.
- Menentukan nama folder KML dan deskripsi folder.
- Memilih ikon default placemark untuk hasil KML.
- Menyediakan berkas contoh CSV.
- Menampilkan hasil KML pada peta sebagai pratinjau.

Ketentuan penting:

- Untuk konversi CSV ke KML, kolom minimum yang diperlukan adalah `name`, `latitude`, dan `longitude`.
- Kolom `description` bersifat opsional.
- Konversi KML ke CSV difokuskan pada `Placemark` bertipe `Point`.

### 3. Auto Placemark Tiang (`tiangnew.html`)

Modul ini digunakan untuk menghasilkan titik-titik placemark baru secara otomatis di sepanjang path Google Earth berdasarkan interval jarak tertentu.

Kemampuan utama:

- Membaca file jalur berformat KML dan KMZ.
- Menempatkan titik pertama di awal jalur dan titik-titik berikutnya berdasarkan interval meter.
- Menyediakan nama placemark kustom atau nama default berurutan.
- Menampilkan pratinjau koordinat hasil.
- Menampilkan jalur dan placemark pada peta.
- Mengekspor KML baru dengan struktur folder yang disesuaikan untuk kebutuhan jaringan.

Catatan operasional:

- Hasil ekspor mempertahankan jalur asli pada folder `KABEL`.
- Placemark baru ditempatkan pada folder `TIANG`.
- File hasil diunduh dengan pola nama `<nama_file>_placemarks.kml`.

### 4. Hitung Asesoris Tiang Eksisting (`asesoristiang.html`)

Modul ini menganalisis file KML atau KMZ yang telah berisi path dan titik lapangan, lalu menghitung kebutuhan asesoris berdasarkan aturan spasial yang tertanam di aplikasi.

Kemampuan utama:

- Membaca data yang sudah ada tanpa membuat placemark tiang baru.
- Mempertahankan data yang sudah ada dan hanya menambahkan folder baru bernama `ASESORIS TIANG`.
- Menghasilkan kategori asesoris seperti `PU-AS-DE-50/70`, `PU-AS-HL`, dan `PU-AS-SC`.
- Menampilkan ringkasan hasil, tabel, dan peta.
- Mengekspor KML hasil analisis.

Aturan yang terlihat di implementasi:

- Perhitungan memanfaatkan radius referensi tertentu, termasuk aturan jarak 250 meter pada kondisi tertentu.
- Folder dan label seperti `CATUAN`, `ODP PLAN`, serta kategori tiang `TE`, `TN`, `TB`, dan `TP` ikut dipertimbangkan.
- Jika folder `ASESORIS TIANG` sudah ada, folder tersebut akan diganti dengan hasil perhitungan baru.

Catatan teknis:

- Modul ini masih memuat rutinitas pembersihan cookie, cache peramban, `localStorage`, dan `sessionStorage` pada kondisi tertentu.
- File hasil diunduh dengan pola nama `<nama_file>_asesoris_tiang.kml`.

### 5. Google Earth Split Line (`splitline.html`)

Modul ini digunakan untuk memecah path KML menjadi beberapa segmen yang lebih pendek berdasarkan panjang segmen yang ditentukan pengguna.

Kemampuan utama:

- Membaca file KML atau XML yang berisi `LineString`.
- Memecah jalur menjadi beberapa segmen dengan panjang target dalam meter.
- Melakukan interpolasi titik jika jarak antarkoordinat terlalu jauh.
- Menyediakan unduhan dalam satu file gabungan atau file terpisah per segmen.
- Menampilkan visualisasi hasil segmentasi pada peta.

Catatan operasional:

- Modul ini hanya relevan untuk `Placemark` yang memiliki `LineString`.
- Nama segmen dibentuk dari nama placemark asal ditambah nomor segmen.
- File gabungan diunduh sebagai `combined_path_segments.kml`.

### 6. Ukur Jarak Allpro Masal (`ukurallpro.html`)

Modul ini menghitung jarak jalan aktual dari banyak titik asal ke titik alat produksi terdekat berdasarkan database KML.

Kemampuan utama:

- Membaca data titik asal dari Excel (`.xlsx`, `.xls`) atau CSV.
- Membaca database titik target dari file KML.
- Menentukan titik target terdekat terlebih dahulu dengan jarak lurus.
- Meminta rute jalan aktual ke layanan OSRM publik.
- Menampilkan progres perhitungan, ringkasan statistik, tabel hasil, dan peta rute.
- Mengekspor hasil ke file Excel.

Ketentuan data:

- File Excel atau CSV diharapkan memiliki tiga kolom utama: nama lokasi, latitude, dan longitude.
- File KML digunakan sebagai basis data titik alat produksi.

Catatan teknis:

- Bila permintaan rute ke OSRM gagal, aplikasi menggunakan mekanisme cadangan berupa estimasi berbasis jarak lurus dengan faktor pengali.
- File hasil diunduh sebagai `hasil_jarak_jalan_alat_produksi.xlsx`.

## Teknologi yang Digunakan

Repositori ini tidak menggunakan pengelola paket maupun proses kompilasi. Seluruh dependensi frontend dipanggil langsung dari CDN.

Komponen utama yang digunakan:

- HTML5
- CSS3
- JavaScript ES6+
- Leaflet.js
- OpenStreetMap tiles
- Font Awesome
- JSZip
- PapaParse
- SheetJS / XLSX
- OSRM public routing API
- GitHub Pages

## Struktur Proyek

```text
.
|-- index.html
|-- converter.html
|-- tiangnew.html
|-- asesoristiang.html
|-- splitline.html
|-- ukurallpro.html
|-- kml.png
|-- README.md
|-- scripts/
|   |-- app-shell.js
|   `-- tool-embed.js
|-- styles/
|   `-- kmltools-pro.css
`-- .github/
    `-- workflows/
        `-- static.yml
```

Keterangan berkas pendukung:

- `scripts/app-shell.js` menangani navigasi ruang kerja utama, sinkronisasi metadata modul, mode tersemat, dan pembersihan cache dari halaman utama.
- `scripts/tool-embed.js` mengirimkan tinggi konten halaman anak ke iframe induk agar ukuran tampilan menyesuaikan otomatis.
- `styles/kmltools-pro.css` memuat gaya visual utama seluruh aplikasi.

## Cara Menjalankan

### Opsi 1: Membuka langsung dari peramban

1. Unduh atau clone repositori ini.
2. Buka file `index.html` di peramban modern.
3. Pilih modul yang ingin digunakan dari ruang kerja utama.

Pendekatan ini dapat digunakan untuk sebagian besar fungsi. Namun, pada beberapa peramban, pembacaan berkas lokal atau kebijakan keamanan tertentu dapat membatasi fitur tertentu.

### Opsi 2: Menjalankan melalui server lokal

Pendekatan ini lebih disarankan agar pemuatan berkas, iframe, dan aset berjalan lebih konsisten.

Contoh menggunakan Python:

```bash
python -m http.server 8000
```

Setelah itu, buka:

```text
http://localhost:8000
```

## Publikasi dengan GitHub Pages

Repositori ini telah menyiapkan workflow GitHub Actions pada `.github/workflows/static.yml`.

Saat terdapat push ke branch `main`, workflow akan:

1. melakukan checkout repositori,
2. menyiapkan GitHub Pages,
3. mengunggah isi repositori sebagai artifact,
4. melakukan deployment ke GitHub Pages.

Karena proyek ini berupa situs statis, seluruh isi repositori dapat dipublikasikan tanpa tahap kompilasi tambahan.

## Kebutuhan Koneksi Internet

Walaupun sebagian besar logika aplikasi berjalan secara lokal di peramban, beberapa fitur tetap bergantung pada koneksi internet, yaitu:

- pemuatan pustaka eksternal dari CDN,
- tile peta dari OpenStreetMap,
- ikon KML yang merujuk ke URL Google Maps,
- layanan routing OSRM pada modul `ukurallpro.html`.

Tanpa internet, fungsi yang sepenuhnya lokal masih dapat berjalan terbatas, tetapi fitur peta, ikon eksternal, serta routing tidak akan berfungsi secara penuh.

## Catatan Implementasi Penting

- Repositori ini tidak menyertakan backend aplikasi khusus untuk proses utama.
- Beberapa halaman masih memanggil endpoint opsional `track_visitors.php`, tetapi berkas tersebut tidak disertakan dalam repositori ini.
- Jika endpoint tersebut tidak tersedia, fungsi utama aplikasi tetap dapat digunakan, walaupun peramban dapat menampilkan kegagalan permintaan di konsol.
- Beberapa modul memiliki perilaku pembersihan cache atau penyimpanan peramban untuk menjaga sesi kerja tetap bersih. Perilaku ini perlu diperhatikan sebelum dipublikasikan ke lingkungan produksi yang lebih luas.

## Tim

- System Architect: Amirun Rayan Ariandi S.M
- QA Engineering: Egantara Satria Utama S.Kom
- Project Lead: Herodin Bening Wicaksono S.Kom

---

Dikembangkan secara privat untuk keperluan otomasi operasional infrastruktur jaringan.

# KML Tools Workspace

KML Tools Workspace adalah kumpulan utilitas geospasial berbasis browser dengan shell workspace di `index.html`.
Versi ini dapat dipakai mandiri tanpa mengubah versi tool sebelumnya.

## Fitur Utama KML Tools Workspace

- Workspace utama yang memuat semua tool dari satu halaman.
- Navigasi modul berbasis tab dengan lazy-load `iframe`.
- Dukungan deep link ke tool tertentu melalui query string atau hash.
- Tombol buka penuh untuk membuka modul aktif sebagai halaman standalone.
- Reset aplikasi dengan konfirmasi untuk membersihkan cache/storage lokal saat diperlukan.
- Modul Auto Cluster Household Polygon untuk mencocokkan titik household ke area polygon.
- Preview peta Auto Cluster untuk melihat polygon, master household, dan titik yang masuk area.
- Preview tabel Asesoris Tiang memakai pagination agar data banyak tetap nyaman dibaca.
- PWA ringan melalui `manifest.webmanifest` dan `sw.js` saat dibuka lewat HTTP/GitHub Pages.

KML Tools Workspace adalah kumpulan utilitas geospasial berbasis browser untuk mengolah `KML`, `KMZ`, `CSV`, `TXT`, dan `Excel` dalam satu workspace statis. Sebagian besar proses utama berjalan langsung di sisi klien, sehingga file kerja tidak perlu dikirim ke backend untuk fungsi inti seperti konversi, rename, segmentasi, analisis, dan visualisasi peta.

Repositori ini dirancang sebagai situs statis tanpa build step. Semua halaman dapat dibuka langsung di browser, dijalankan lewat HTTP server lokal, atau dipublikasikan ke GitHub Pages.

## Sorotan

- Tidak memakai bundler, framework, atau backend wajib.
- Setiap tool bisa dibuka langsung sebagai halaman mandiri.
- `index.html` berfungsi sebagai shell utama yang memuat tool melalui `iframe`.
- Tinggi `iframe` disinkronkan otomatis lewat `postMessage` agar tampilan tetap rapi saat embedded.
- Mayoritas data diproses secara lokal di browser pengguna.
- Peta interaktif memakai Leaflet dan tile OpenStreetMap.

## Daftar Modul

| File | Fungsi | Input utama | Output utama |
| --- | --- | --- | --- |
| `index.html` | Workspace utama dan navigasi semua tool | - | Akses terpadu ke seluruh modul |
| `converter.html` | Konversi data tabular ke KML dan KML/KMZ ke CSV | `.csv`, `.txt`, `.xlsx`, `.xls`, `.kml`, `.kmz` | `.kml` atau `.csv` |
| `bulkrename.html` | Rename massal untuk data bernama | `.kml`, `.kmz`, `.csv`, `.txt`, `.xlsx`, `.xls` | File dengan format asal |
| `clusterhousehold.html` | Cluster titik household ke polygon area | `.kml`, `.kmz` | ZIP KML per area dan rekap Excel |
| `tiangnew.html` | Generate placemark otomatis di sepanjang path | `.kml`, `.kmz` | KML baru berisi path dan titik |
| `asesoristiang.html` | Hitung kebutuhan asesoris tiang existing | `.kml`, `.kmz` | KML analisis, ringkasan, tabel paginasi, peta |
| `splitline.html` | Pecah jalur KML/KMZ menjadi beberapa segmen | `.kml`, `.kmz`, `.xml` | KML gabungan atau file segmen terpisah |
| `ukurallpro.html` | Hitung jarak jalan massal berbasis OSRM | `.xlsx`, `.xls`, `.csv`, `.kml` | Tabel hasil, peta rute, file Excel |
| `pemetaanalpro.html` | Filter Alpro berdasar Polygon, buat Laporan, dan Ukur Jalan | `.kml`, `.kmz` | ZIP KML Visual, Excel Laporan |

## Ringkasan Fitur Per Modul

### 1. Workspace utama (`index.html`)

Halaman ini adalah entry point utama. Shell memuat tiap modul secara lazy-load di dalam `iframe`, menyimpan tool aktif lewat query string atau hash, lalu menyinkronkan metadata judul, deskripsi, dan tombol pembuka halaman standalone.

Fitur penting:

- Navigasi semua tool dari satu halaman.
- Dukungan deep link seperti `index.html?tool=bulkrename` atau `index.html#tool-ukurallpro`.
- Tombol `Buka Penuh` untuk membuka tool aktif di tab terpisah.
- Tombol `Reset Aplikasi` dengan konfirmasi untuk membersihkan cookie, storage, dan cache browser.
- Mode Telegram WebApp bila objek `Telegram.WebApp` tersedia.

### 2. Konverter Data <-> KML (`converter.html`)

Tool ini menangani konversi dua arah antara data tabular dan placemark point pada KML.

Fitur penting:

- Konversi `CSV`, `TXT`, `XLSX`, atau `XLS` ke `KML`.
- Konversi `KML` atau `KMZ` ke `CSV`.
- Pengaturan nama folder dan deskripsi folder saat ekspor KML.
- Pemilihan ikon placemark default.
- Unduhan file contoh CSV.
- Preview hasil KML di peta Leaflet.

Catatan:

- Data tabular minimum membutuhkan kolom `name`, `latitude`, dan `longitude`.
- Kolom `description` bersifat opsional.
- Konversi `KML/KMZ -> CSV` difokuskan pada `Placemark` bertipe `Point`.

### 3. Bulk Rename Nama (`bulkrename.html`)

Tool ini ditujukan untuk penggantian nama secara massal tanpa edit satu per satu.

Fitur penting:

- Mendukung file `KML`, `KMZ`, `CSV`, `TXT`, `XLSX`, dan `XLS`.
- Rename dengan pola `find/replace`.
- Penambahan `prefix` dan `suffix`.
- Template nama dengan token `{name}` dan `{n}`.
- Nomor urut otomatis dengan pengaturan digit padding.
- Preview sebelum dan sesudah rename.
- Ekspor hasil dalam format yang sama seperti file sumber.

Catatan:

- Untuk `KML` dan `KMZ`, tool memproses `Placemark > name`.
- Untuk `CSV` dan Excel, tool mengharapkan kolom `name`.
- Untuk `TXT`, setiap baris non-kosong dianggap satu entri nama.

### 4. Auto Cluster Household Polygon (`clusterhousehold.html`)

Tool ini mencocokkan titik household dari master KML/KMZ ke satu atau banyak polygon area.

Fitur penting:

- Input master household dari `KML` atau `KMZ` yang berisi placemark `Point`.
- Input satu atau banyak file polygon `KML`/`KMZ`.
- Membaca polygon biasa maupun polygon di dalam `MultiGeometry`.
- Menghitung jumlah household yang masuk ke setiap polygon memakai Turf.js di browser.
- Menyediakan setting style output KML untuk polygon dan household, termasuk warna, opacity, lebar garis, mode fill/outline, icon, dan scale.
- Menampilkan preview peta berisi polygon area, master household, dan household yang masuk polygon.
- Membuat output KML per area dengan folder `POLYGON` dan `HOUSEHOLD`.
- Mengekspor semua KML hasil sebagai satu file ZIP.
- Mengekspor rekap Excel dengan sheet `Detail_Household` dan `Ringkasan_Polygon`.

Catatan:

- Point yang masuk lebih dari satu polygon akan ikut tercatat pada semua polygon yang memuat titik tersebut.
- Output KML dibuat ulang dari hasil proses, bukan mempertahankan seluruh style asli file sumber.
- Untuk file sangat besar, performa bergantung pada kemampuan perangkat pengguna.

### 5. Auto Placemark Tiang (`tiangnew.html`)

Tool ini membuat placemark baru secara otomatis di sepanjang jalur berdasarkan interval meter tertentu.

Fitur penting:

- Mendukung input `KML` dan `KMZ`.
- Bisa klik upload atau drag-and-drop file.
- Menempatkan titik secara berurutan sepanjang path.
- Nama placemark bisa kustom atau auto-numbering.
- Menampilkan preview koordinat dan visualisasi peta.
- Menghasilkan KML dengan folder `KABEL` dan `TIANG`.

Catatan:

- File hasil diunduh sebagai `<nama_file>_placemarks.kml`.
- Jalur asli tetap disertakan di hasil ekspor.

### 6. Hitung Asesoris Tiang (`asesoristiang.html`)

Tool ini menganalisis KML/KMZ existing untuk menambahkan hasil perhitungan asesoris tanpa menghapus data utama yang sudah ada.

Fitur penting:

- Mendukung upload klik maupun drag-and-drop.
- Membaca data line dan titik dari file existing.
- Menambahkan folder `ASESORIS TIANG` ke hasil akhir.
- Menampilkan ringkasan, tabel hasil dengan pagination, dan peta hasil analisis.
- Tabel preview mendukung pilihan `10`, `25`, `50`, atau `100` baris per halaman.
- Mengekspor KML hasil analisis.

Aturan yang tampak di implementasi saat ini:

- `PU-AS-DE-50/70` dan `PU-AS-HL` dihitung berdasarkan kondisi belokan, line lurus, dan interval tertentu termasuk aturan `250 meter`.
- Folder seperti `CATUAN` dan `ODP PLAN` ikut dipakai sebagai pemicu pada path terdekat.
- `PU-AS-SC` dihitung sepanjang ruas path terkait dengan penghindaran titik yang bertumpuk atau terlalu dekat.
- Jika folder `ASESORIS TIANG` sudah ada, hasil baru akan menggantikannya.

Catatan:

- File hasil diunduh sebagai `<nama_file>_asesoris_tiang.kml`.
- Pagination hanya memengaruhi tampilan preview di browser; hasil export KML tetap memuat seluruh asesoris yang terdeteksi.

### 7. Google Earth Split Line (`splitline.html`)

Tool ini memecah path KML/KMZ panjang menjadi segmen-segmen yang lebih pendek.

Fitur penting:

- Menerima file `KML`, `KMZ`, atau `XML`.
- Menghasilkan segmen berdasarkan panjang target dalam meter.
- Melakukan interpolasi bila titik pada jalur terlalu renggang.
- Menyediakan dua mode unduh:
  - satu file gabungan `combined_path_segments.kml`
  - file terpisah untuk tiap segmen
- Menyediakan peta visualisasi hasil segmentasi.

Catatan:

- Tool ini hanya relevan untuk `Placemark` yang memiliki `LineString`.

### 8. Ukur Jarak Allpro Masal (`ukurallpro.html`)

Tool ini menghitung jarak jalan aktual dari banyak titik asal ke titik target terdekat pada database KML.

Fitur penting:

- Input titik asal dari `Excel` (`.xlsx`, `.xls`) atau `CSV`.
- Input database target dari `KML`.
- Pencarian target terdekat diawali dengan jarak lurus.
- Perhitungan rute jalan aktual memakai OSRM publik.
- Progress proses, tabel hasil, ringkasan statistik, dan peta rute.
- Ekspor hasil ke Excel.

Catatan:

- Format minimal file lokasi asal mengikuti tiga kolom utama: nama lokasi, latitude, longitude.
- Saat routing OSRM gagal, tool memiliki fallback berbasis jarak lurus dengan faktor pengali.
- File hasil diunduh sebagai `hasil_jarak_jalan_alat_produksi.xlsx`.

### 9. Pemetaan Alpro (`pemetaanalpro.html`)

Tool ini menyaring (filter) material Alpro dari database KML berdasarkan batas polygon, serta membuat laporan Excel dan menghitung panjang jalan secara otomatis.

Fitur penting:

- Input database KML/KMZ yang berisi point (titik) dan linestring (kabel).
- Input satu atau banyak file polygon `KML`/`KMZ`.
- KML Visual: Mengekstrak semua titik dan kabel yang masuk ke dalam tiap polygon area beserta mempertahankan style dan icon aslinya, lalu dibundel dalam satu file ZIP.
- Laporan Alpro: Menghitung presisi jumlah aset dan panjang kabel riil (memotong sesuai batas bidang polygon) dengan keluaran file Excel.
- Panjang Jalan: Menarik data satelit OpenStreetMap (Overpass API) untuk mengkalkulasi panjang jalan yang berada di dalam area polygon.
- Visualisasi Peta: Menampilkan polygon area beserta seluruh aset database yang telah tersaring secara interaktif.

Catatan:

- Fitur proses KML Visual dan Laporan Alpro berjalan offline di browser menggunakan Turf.js.
- Pemrosesan database KML berukuran sangat besar memakai chunking asinkron untuk mencegah browser macet (freeze).
- Fitur Ukur Panjang Jalan membutuhkan koneksi internet untuk menarik data dari Overpass API.

## Arsitektur Frontend

Repositori ini sekarang memakai shell frontend sederhana agar semua tool terasa seperti satu aplikasi utuh walau tetap berbasis halaman HTML terpisah.

Komponen utamanya:

- `index.html`
  - shell workspace ringkas, hero section, navigasi modul, dan area `iframe`
- `scripts/app-shell.js`
  - aktivasi tab
  - lazy-load `iframe`
  - sinkronisasi hash/query ke tool aktif
  - pembaruan metadata tool aktif
  - auto-resize `iframe`
  - dukungan Telegram WebApp
  - `Reset Aplikasi`
- `scripts/tool-embed.js`
  - dipasang pada halaman tool
  - mengukur tinggi konten halaman anak
  - mengirim tinggi ke parent via `postMessage` dengan tipe `kmltools:frame-size`
- `styles/kmltools-pro.css`
  - stylesheet bersama untuk shell utama dan seluruh modul
- `sw.js`
  - service worker PWA ringan dengan cache asset inti workspace

Setiap halaman tool mendeteksi mode embedded dengan:

```js
if (window.self !== window.top) {
  document.documentElement.classList.add('embedded-tool');
}
```

Dengan pola ini, satu tool bisa dipakai dalam dua mode:

- standalone, langsung buka file HTML-nya
- embedded, dimuat dari `index.html`

## Teknologi Yang Dipakai

Semua dependensi frontend dimuat langsung dari CDN.

- HTML5
- CSS3
- JavaScript ES6+
- Leaflet
- OpenStreetMap
- Font Awesome
- JSZip
- PapaParse
- SheetJS / XLSX
- Turf.js
- OSRM public routing API
- GitHub Pages

## Struktur Proyek

```text
.
|-- index.html
|-- converter.html
|-- bulkrename.html
|-- clusterhousehold.html
|-- tiangnew.html
|-- asesoristiang.html
|-- splitline.html
|-- ukurallpro.html
|-- pemetaanalpro.html
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

## Menjalankan Proyek

### Opsi 1: buka langsung di browser

1. Clone atau unduh repositori ini.
2. Buka `index.html` di browser modern.
3. Pilih tool yang ingin digunakan dari workspace utama.

Mode ini cocok untuk penggunaan cepat, tetapi beberapa browser bisa lebih ketat terhadap akses file lokal, cache, atau perilaku `iframe`.

### Opsi 2: jalankan lewat server lokal

Cara ini lebih direkomendasikan agar seluruh halaman, `iframe`, dan asset eksternal berjalan lebih konsisten.

Contoh dengan Python:

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

Contoh deep link:

```text
http://localhost:8000/index.html?tool=converter
http://localhost:8000/index.html#tool-bulkrename
```

## Deploy Ke GitHub Pages

Workflow deploy sudah tersedia di [`.github/workflows/static.yml`](.github/workflows/static.yml).

Saat ada `push` ke branch `main`, workflow akan:

1. checkout repository
2. menjalankan `configure-pages`
3. mengunggah seluruh isi repository sebagai artifact
4. deploy artifact ke GitHub Pages

Karena proyek ini murni situs statis, tidak ada build step tambahan sebelum deploy.

## Koneksi Internet Dan Batasan

Walau logika utama berjalan di browser, beberapa fitur tetap membutuhkan koneksi internet:

- library frontend dimuat dari CDN
- tile peta berasal dari OpenStreetMap
- beberapa ikon KML memakai URL ikon Google Maps
- modul `ukurallpro.html` membutuhkan layanan routing OSRM publik

Implikasinya:

- konversi atau manipulasi file lokal masih bisa berjalan terbatas
- preview peta tidak akan tampil penuh tanpa internet
- routing jarak jalan akan gagal bila OSRM tidak dapat diakses

## Catatan Privasi

Untuk fungsi inti, file kerja diproses di browser pengguna. Itu berarti data utama tidak perlu diunggah ke server aplikasi ini. Namun, saat pengguna menyalakan fitur peta atau routing, browser tetap berkomunikasi dengan layanan pihak ketiga seperti CDN, OpenStreetMap, dan OSRM.

## Pengembang

Developed by Amirun Rayan Ariandi

---

Workspace ini dikembangkan secara privat untuk kebutuhan otomasi operasional dan pengolahan data geospasial lapangan.

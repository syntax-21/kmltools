# KML Tools Workspace - Enterprise Edition

KML Tools Workspace adalah rangkaian utilitas pemrosesan data spasial (KML/KMZ) dan koordinat yang berjalan sepenuhnya di sisi klien (*client-side browser*). Aplikasi ini didesain secara khusus untuk mempercepat alur kerja perancangan dan manajemen infrastruktur jaringan telekomunikasi (seperti penempatan tiang, jalur kabel, dan penghitungan asesoris).

Semua proses komputasi spasial berjalan langsung di dalam RAM perangkat (browser) sehingga sangat cepat dan menjamin kerahasiaan data (tidak ada data KML/CSV yang diunggah ke server pihak ketiga).

## ✨ Fitur Utama

Aplikasi ini memiliki 5 modul sistem aktif yang terintegrasi dalam satu Workspace dengan desain *Dark Theme / Glassmorphism*:

### 1. 🔄 Matriks Konversi (CSV <-> KML)
Mesin konversi dua arah berkecepatan tinggi antara format tabular (CSV) dan KML spasial. 
- Memudahkan transformasi data hasil survei lapangan menjadi titik-titik (*placemarks*) di Google Earth.
- Mampu membalik ekstraksi KML kembali menjadi tabel data (CSV).

### 2. 📍 Auto Placemark Tiang (Generator Node)
Sistem penyebaran otomatis titik (placemark tiang) berdasarkan interval jarak tertentu di sepanjang vektor rute kabel (LineString).
- **Input:** Path/jalur kabel dari Google Earth.
- **Output:** Titik tiang baru yang berjarak konsisten (misal: tiap 50 meter) beserta koordinatnya.

### 3. 🛠️ Kalkulator Asesoris Eksisting
Pemindai cerdas (Scanner) untuk menghitung secara otomatis total kebutuhan asesoris (material jaringan) pada jalur KML eksisting.
- Mendeteksi kelengkungan (belokan) path untuk menentukan tipe asesoris (PU-AS-DE, PU-AS-HL, PU-AS-SC).
- Memberikan tabel pratinjau lengkap dan titik potong langsung pada peta Leaflet.

### 4. ✂️ Split Line Google Earth
Modul fragmentasi otomatis yang berfungsi memecah/memotong jalur KML (LineString) masif menjadi beberapa blok/segmen parsial.
- Fitur ini sangat cocok untuk membagi jalur utama ke tim instalasi per segmen meter.
- Mendukung unduhan file KML secara massal maupun terpisah.

### 5. 📏 Ukur Jarak Allpro (OSRM Routing)
Telemetri routing yang terhubung dengan *OpenStreetMap* untuk menghitung jarak nyata (via jalan raya) antar titik masal.
- Menghasilkan perhitungan yang lebih akurat dibandingkan garis lurus (Haversine).

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini tidak memerlukan instalasi backend (Node.js/PHP/Python). Anda cukup membukanya menggunakan browser modern apa saja:

1. Ekstrak folder proyek ke direktori komputer Anda.
2. Buka folder `V2`.
3. Klik ganda (buka) file `index.html` menggunakan browser standar (Chrome, Firefox, Edge, atau Safari).
4. *Workspace* akan langsung terbuka secara luring (*offline*), kecuali fitur Peta (Leaflet) dan OSRM Routing yang membutuhkan koneksi internet.

## 🛠️ Stack Teknologi
- **Frontend Core:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **UI/UX:** Custom Dark Theme (Neon/Glassmorphism hybrid).
- **Map Engine:** Leaflet.js terintegrasi dengan CartoDB Dark Matter tiles.
- **Geospatial Processing:** Algoritma Haversine dan manipulasi DOM Parser lokal.
- **Zip Utilities:** JSZip (untuk ekstraksi format `.kmz`).

## 👥 Tim Pengembang
- **System Architect:** Amirun Rayan Ariandi S.M
- **QA Engineering:** Egantara Satria Utama S.Kom
- **Project Lead:** Herodin Bening Wicaksono S.Kom

---
*Dikembangkan secara privat untuk keperluan otomasi operasional infrastruktur jaringan.*

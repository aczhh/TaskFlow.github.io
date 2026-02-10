# TaskFlow – Task Management Web App

TaskFlow adalah aplikasi manajemen tugas berbasis web (Single Page Application) yang membantu pengguna mengatur, memantau, dan menyelesaikan tugas harian secara efisien. Aplikasi ini dibangun menggunakan **HTML, CSS, dan JavaScript murni** tanpa framework, serta memanfaatkan **LocalStorage** untuk penyimpanan data.

---

## Fitur Utama

- **Dashboard**
  - Menampilkan total tugas
  - Menampilkan jumlah tugas yang telah selesai
  - Menampilkan tanggal hari ini

- **Task Management (CRUD)**
  - Tambah tugas baru
  - Edit tugas
  - Hapus tugas
  - Tandai tugas sebagai *Completed*

- **Task List**
  - Pencarian tugas berdasarkan judul
  - Pengurutan tugas berdasarkan:
    - Prioritas
    - Deadline
  - Tampilan tabel interaktif (klik baris untuk memilih tugas)

- **History Log**
  - Mencatat semua aktivitas:
    - Create
    - Update
    - Delete
    - Complete
  - Menyimpan hingga 20 aktivitas terakhir

- **LocalStorage**
  - Data tersimpan di browser
  - Tidak hilang saat halaman direfresh

- **Responsive Design**
  - Tampilan optimal di desktop dan mobile
  - Sidebar berubah menjadi drawer pada layar kecil

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|--------|------------|
| HTML5 | Struktur halaman |
| CSS3 | Desain dan layout responsif |
| JavaScript (Vanilla) | Logika aplikasi |
| LocalStorage | Penyimpanan data lokal browser |

---

## Struktur Folder

```plaintext
TaskFlow/
├── index.html
├── style.css
├── script.js
└── README.md

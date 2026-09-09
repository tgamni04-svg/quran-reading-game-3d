
# 🕌 Permainan Membaca Quran 3D

Aplikasi pembelajaran membaca Quran interaktif berbasis web dengan avatar 3D, audio bacaan referensi, dan fitur rekam suara untuk pelajar. Admin dapat meninjau dan menilai rekaman pelajar.

## 🎮 Fitur Utama

### Untuk Pelajar (Student)
- ✅ Masukkan nama untuk memulai permainan
- ✅ Pelajaran 6 Surah Quran dengan teks dan tanda waqaf
- 🔊 Dengarkan audio bacaan referensi
- 🎤 Rekam suara dengan menekan & menahan tombol
- 📊 Rakaman otomatis tersimpan ke server
- 🎯 Navigasi antara pelajaran

### Untuk Admin
- 🔐 Login dengan kata laluan
- 📋 Lihat semua rakaman pelajar
- 🎵 Putar & dengarkan rakaman pelajar
- 👤 Filter berdasarkan nama pelajar & surah
- 📅 Timestamp setiap rakaman

### Teknologi
- **Frontend**: HTML5, CSS3, JavaScript, Three.js (3D)
- **Backend**: Node.js + Express
- **Database**: MongoDB (dapat dikonfigurasi)
- **Audio**: Web Audio API, Multer untuk upload

## 📋 Daftar Surah

1. **Al-Fatihah** (الفاتحة) - Ayat 1
2. **Al-Ikhlas** (الإخلاص) - Ayat 1
3. **An-Nas** (الناس) - Ayat 1
4. **Al-Falaq** (الفلق) - Ayat 1
5. **Al-Kafiroon** (الكافرون) - Ayat 1
6. **Al-Asr** (العصر) - Ayat 1

## 🚀 Cara Mulai

### Prerequisites
- Node.js 14+
- npm atau yarn
- MongoDB (opsional, untuk production)

### Instalasi

```bash
# Clone repository
git clone https://github.com/tgamni04-svg/quran-reading-game-3d.git
cd quran-reading-game-3d

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Jalankan server
npm run dev
```

Buka browser di `http://localhost:5000`

## 📁 Struktur Project

```
quran-reading-game-3d/
├── public/
│   ├── index.html          # Halaman utama
│   ├── styles.css          # Styling
│   ├── app.js              # Logic aplikasi
│   ├── audio/              # File audio bacaan
│   └── recordings/         # Folder rakaman pelajar
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── lessons.js          # Lessons API
│   ├── recordings.js       # Recording upload & management
│   └── admin.js            # Admin routes
├── server.js               # Express server
├── package.json
├── .env.example
└── README.md
```

## 🎯 Alur Penggunaan

### Untuk Pelajar
1. Masukkan nama Anda
2. Pilih surah dari 6 pilihan
3. Baca teks Quran dengan tanda waqaf
4. Tekan 🔊 **Dengar Bacaan Referensi**
5. Tekan & tahan 🎤 **Tombol Rekod** untuk merekam
6. Lepas tombol → Rakaman tersimpan
7. Lanjut ke pelajaran berikutnya

### Untuk Admin
1. Klik **Panel Admin**
2. Masukkan kata laluan admin
3. Lihat semua rakaman pelajar
4. Putar & dengarkan setiap rakaman
5. Review progress pelajar

## 🔧 Konfigurasi

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quran-reading-game
NODE_ENV=development
ADMIN_PASSWORD=admin123
```

### Mengubah Kata Laluan Admin
Edit file `.env` dan ubah `ADMIN_PASSWORD`

## 📦 API Endpoints

### Student Routes
```
POST /api/auth/login
- Input: { name: "Nama Pelajar" }
- Output: { success: true, studentName: "..." }
```

### Lessons Routes
```
GET /api/lessons
- Output: Array of lessons

GET /api/lessons/:id
- Output: Lesson detail
```

### Recordings Routes
```
POST /api/recordings/save (multipart form-data)
- Input: { studentName, surah, verse, audio, timestamp }
- Output: { success: true, data: recordingData }

GET /api/recordings/student/:name
- Output: Array of student's recordings
```

### Admin Routes
```
POST /api/admin/login
- Input: { password: "..." }
- Output: { success: true, sessionId: "..." }

GET /api/admin/recordings?sessionId=...
- Output: Array of all recordings

POST /api/admin/logout
- Input: { sessionId: "..." }
```

## 🎨 3D Avatar

Avatar 3D dibuat menggunakan **Three.js**:
- Kepala berbentuk bola
- Mata
- Badan
- Lengan

Animasi: Avatar berputar perlahan saat membaca

## 🔊 Audio & Recording

- **Format Audio**: WebM (browser native support)
- **Recording Quality**: 16-bit, 44.1kHz (default browser)
- **Penyimpanan**: Server lokal di folder `/public/recordings`

## 🗄️ Database Schema (MongoDB)

### Recording Collection
```javascript
{
  _id: ObjectId,
  studentName: String,
  surah: String,
  verse: Number,
  audioFile: String,     // Filename
  timestamp: Date,
  fileSize: Number,
  createdAt: Date
}
```

## 🐛 Troubleshooting

### Mikrofon tidak berfungsi
- Pastikan browser meminta izin akses mikrofon
- Coba refresh halaman
- Periksa privacy settings browser

### Audio tidak diputar
- Pastikan file audio ada di `/public/audio/`
- Cek console untuk error message
- Format audio: MP3 atau WebM

### Rakaman tidak tersimpan
- Periksa folder `/public/recordings` ada & writable
- Lihat server logs untuk error
- Pastikan disk space cukup

## 📝 Untuk Pengembangan Lebih Lanjut

- [ ] Integrasi MongoDB untuk penyimpanan permanen
- [ ] Sistem rating/scoring untuk setiap rakaman
- [ ] Export rakaman dalam format MP3
- [ ] Dashboard analytics untuk teacher
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time waveform visualization
- [ ] Automatic speech recognition (ASR) untuk feedback

## 📄 Lisensi

MIT License - Bebas digunakan untuk pembelajaran & komersial

## 👨‍💻 Kontribusi

Sumbangan sambut! Fork repo, buat branch, dan submit pull request.

```bash
git checkout -b feature/your-feature
git commit -m 'Add your feature'
git push origin feature/your-feature
```

## 📞 Support

Untuk bantuan atau pertanyaan, buka issue di GitHub.

---

**Assalamu'alaikum wa Rahmatullahi wa Barakatuh** 🕌✨

Semoga aplikasi ini membantu generasi muda mempelajari Al-Quran dengan cara yang menyenangkan dan interaktif!

# Contributing to Indonesia GeoJSON API

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## Cara Berkontribusi

### Melaporkan Bug

1. Pastikan bug belum dilaporkan dengan mencari di [Issues](https://github.com/mohdlabib/leafletMAP/issues)
2. Jika belum ada, buat issue baru dengan template berikut:
   - **Deskripsi**: Jelaskan bug secara singkat
   - **Langkah Reproduksi**: Bagaimana cara mereproduksi bug
   - **Hasil yang Diharapkan**: Apa yang seharusnya terjadi
   - **Hasil Aktual**: Apa yang sebenarnya terjadi
   - **Screenshot**: Jika memungkinkan

### Mengusulkan Fitur Baru

1. Cari di [Issues](https://github.com/mohdlabib/leafletMAP/issues) untuk memastikan fitur belum diusulkan
2. Buat issue baru dengan label `enhancement`
3. Jelaskan fitur yang diusulkan dan use case-nya

### Pull Request

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Lakukan perubahan
4. Commit dengan pesan yang jelas: `git commit -m 'Add: fitur baru'`
5. Push ke branch: `git push origin feature/nama-fitur`
6. Buat Pull Request

### Konvensi Commit Message

- `Add:` untuk fitur baru
- `Fix:` untuk perbaikan bug
- `Update:` untuk pembaruan data atau dokumentasi
- `Refactor:` untuk refactoring kode
- `Docs:` untuk perubahan dokumentasi saja

### Update Data GeoJSON

Jika ingin mengupdate atau menambahkan data GeoJSON:

1. Pastikan data valid (gunakan [GeoJSON Validator](https://geojsonlint.com/))
2. Ikuti struktur folder yang ada
3. Update `map_index.json` jika diperlukan
4. Jalankan `node generate_map_index.js` untuk regenerate index
5. Test dengan demo page

## Code Style

### JavaScript

- Gunakan ES6+ syntax
- Gunakan `const` dan `let`, hindari `var`
- Gunakan arrow functions untuk callbacks
- Indentasi: 4 spaces

### GeoJSON

- Gunakan format yang terstandar
- Pastikan properties konsisten
- Koordinat dalam format [longitude, latitude]

## Struktur Folder

```
leafletMAP/
├── api/                    # JavaScript client library
├── docs/                   # Dokumentasi
├── examples/               # Contoh penggunaan
├── indonesia-district/     # Data GeoJSON
├── map_index.json          # Master index
├── provinces.json          # Daftar provinsi
└── README.md
```

## Pertanyaan?

Jika ada pertanyaan, silakan buat issue dengan label `question` atau hubungi maintainer.

Terima kasih telah berkontribusi! 🙏

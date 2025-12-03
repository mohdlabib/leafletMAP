# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-03

### Added
- 🗺️ Data GeoJSON lengkap untuk seluruh Indonesia
  - 34 Provinsi
  - 514 Kabupaten/Kota
  - 7.277 Kecamatan
  - Data Desa/Kelurahan
- 📚 Dokumentasi API lengkap
  - README.md dengan contoh penggunaan
  - docs/API.md - Dokumentasi API detail
  - docs/USAGE.md - Panduan penggunaan
  - docs/ENDPOINTS.md - Referensi endpoint
- 🔧 JavaScript Client Library
  - api/indonesia-geojson.js - Library client
  - api/indonesia-geojson.min.js - Versi minified
- 📄 Master Index
  - map_index.json - Hierarki lengkap wilayah
  - provinces.json - Daftar provinsi sederhana
- 🎯 Demo
  - examples/demo.html - Demo interaktif
- 📜 LICENSE - MIT License

### Features
- CDN support melalui jsDelivr
- Caching built-in pada client library
- Search functionality
- Drill-down navigation (Provinsi → Kabupaten → Kecamatan → Desa)
- Compatible dengan Leaflet.js, React, Vue, dan framework lainnya

## [Unreleased]

### Planned
- [ ] TypeScript definitions
- [ ] NPM package
- [ ] Python package
- [ ] Data update automation
- [ ] Simplified versions untuk semua level

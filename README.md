# 🗺️ Indonesia GeoJSON API

[![GitHub](https://img.shields.io/badge/GitHub-mohdlabib%2FleafletMAP-blue?logo=github)](https://github.com/mohdlabib/leafletMAP)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange?logo=jsdelivr)](https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Indonesia GeoJSON API** adalah kumpulan data geospasial lengkap Indonesia dalam format GeoJSON yang dapat diakses melalui CDN jsDelivr. Dataset ini mencakup data administratif dari tingkat **Provinsi**, **Kabupaten/Kota**, **Kecamatan**, hingga **Desa/Kelurahan**.

---

## 📋 Daftar Isi

- [🚀 Quick Start](#-quick-start)
- [📡 CDN Base URL](#-cdn-base-url)
- [📚 API Reference](#-api-reference)
  - [Data Index](#data-index)
  - [Peta Provinsi](#peta-provinsi)
  - [Peta Kabupaten/Kota](#peta-kabupatenkota)
  - [Peta Kecamatan](#peta-kecamatan)
  - [Peta Desa/Kelurahan](#peta-desakelurahan)
- [🗂️ Struktur Data](#️-struktur-data)
- [💻 Contoh Penggunaan](#-contoh-penggunaan)
- [📊 Daftar Provinsi](#-daftar-provinsi)
- [🔗 URL Pattern](#-url-pattern)
- [📦 Integrasi](#-integrasi)
- [🤝 Kontribusi](#-kontribusi)
- [📄 Lisensi](#-lisensi)

---

## 🚀 Quick Start

### Menggunakan Fetch API (JavaScript)

```javascript
// Ambil data semua provinsi
const response = await fetch('https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/map_index.json');
const provinces = await response.json();
console.log(provinces);
```

### Menggunakan Leaflet.js

```javascript
// Load GeoJSON ke Leaflet Map
L.geoJSON('https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037%20simplified.geojson')
  .addTo(map);
```

---

## 📡 CDN Base URL

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/
```

| Versi | URL |
|-------|-----|
| Latest (Master) | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/` |
| Specific Commit | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@{commit-hash}/` |

---

## 📚 API Reference

### Data Index

#### 📁 Master Index - Semua Data Hierarki

```
GET /map_index.json
```

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/map_index.json
```

**Response:** Array berisi semua provinsi dengan struktur hierarki lengkap (Provinsi → Kabupaten → Kecamatan)

```json
[
  {
    "id": "11",
    "name": "Aceh",
    "folder": "id11_aceh",
    "regencies": [
      {
        "id": "1101",
        "name": "Simeulue",
        "folder": "id1101_simeulue",
        "file": "indonesia-district/id11_aceh/id1101_simeulue/id1101_simeulue.geojson",
        "districts": [
          {
            "id": "1101010",
            "name": "Teupah Selatan",
            "file": "indonesia-district/id11_aceh/id1101_simeulue/id1101010_teupah_selatan.geojson"
          }
        ]
      }
    ]
  }
]
```

---

#### 📁 Provinces Index - Daftar Provinsi Sederhana

```
GET /provinces.json
```

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/provinces.json
```

**Response:**
```json
[
  {
    "file": "indonesia-district/id11_aceh/id11_aceh_district.geojson",
    "name": "Aceh"
  },
  {
    "file": "indonesia-district/id12_sumatera_utara/id12_sumatera_utara_district.geojson",
    "name": "Sumatera Utara"
  }
]
```

---

### Peta Provinsi

#### 🗺️ Seluruh Indonesia (Simplified)

```
GET /indonesia-district/prov%2037%20simplified.geojson
```

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037%20simplified.geojson
```

**Deskripsi:** Peta seluruh provinsi Indonesia dalam format simplified (ukuran file lebih kecil)

---

#### 🗺️ Seluruh Indonesia (Full Detail)

```
GET /indonesia-district/prov%2037.geojson
```

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037.geojson
```

---

### Peta Kabupaten/Kota

#### 🗺️ Seluruh Kabupaten Indonesia

```
GET /indonesia-district/kab%2037.geojson
```

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/kab%2037.geojson
```

---

#### 🗺️ Kabupaten Per Provinsi

**Pattern:**
```
GET /indonesia-district/{province_folder}/{province_id}_{province_name}_district.geojson
```

**Contoh - Aceh:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id11_aceh_district.geojson
```

**Contoh - Jawa Barat:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id32_jawa_barat/id32_jawa_barat_district.geojson
```

---

### Peta Kecamatan

#### 🗺️ Kecamatan Per Kabupaten

**Pattern:**
```
GET /indonesia-district/{province_folder}/{regency_folder}/{regency_id}_{regency_name}.geojson
```

**Contoh - Kabupaten Simeulue, Aceh:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id1101_simeulue/id1101_simeulue.geojson
```

**Contoh - Kota Bandung, Jawa Barat:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id32_jawa_barat/id3273_kota_bandung/id3273_kota_bandung.geojson
```

---

### Peta Desa/Kelurahan

#### 🗺️ Desa Per Kecamatan

**Pattern:**
```
GET /indonesia-district/{province_folder}/{regency_folder}/{district_id}_{district_name}.geojson
```

**Contoh - Kecamatan Teupah Selatan:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id1101_simeulue/id1101010_teupah_selatan.geojson
```

---

## 🗂️ Struktur Data

### Hierarki Administratif Indonesia

```
Indonesia
├── Provinsi (38 Provinsi)
│   ├── Kabupaten/Kota (514 Kabupaten/Kota)
│   │   ├── Kecamatan (7.277 Kecamatan)
│   │   │   └── Desa/Kelurahan (83.931 Desa/Kelurahan)
```

### Struktur Folder

```
leafletMAP/
├── map_index.json              # Master index dengan hierarki lengkap
├── provinces.json              # Daftar provinsi sederhana
├── indonesia-district/
│   ├── prov 37.geojson         # Peta semua provinsi (full)
│   ├── prov 37 simplified.geojson  # Peta semua provinsi (simplified)
│   ├── kab 37.geojson          # Peta semua kabupaten
│   ├── id11_aceh/              # Folder Provinsi Aceh
│   │   ├── id11_aceh_district.geojson  # Semua kabupaten di Aceh
│   │   ├── id1101_simeulue/    # Folder Kabupaten Simeulue
│   │   │   ├── id1101_simeulue.geojson  # Peta Kabupaten Simeulue
│   │   │   ├── id1101010_teupah_selatan.geojson  # Kec. Teupah Selatan
│   │   │   └── ...
│   │   └── ...
│   ├── id12_sumatera_utara/
│   └── ...
```

### GeoJSON Properties

Setiap feature dalam GeoJSON memiliki properties berikut:

| Property | Tipe | Deskripsi |
|----------|------|-----------|
| `prov_id` | String | Kode provinsi (2 digit) |
| `prov_name` | String | Nama provinsi |
| `regency_id` | String | Kode kabupaten/kota (4 digit) |
| `name` | String | Nama wilayah |
| `district` | String | Nama kecamatan (jika level desa) |
| `village` | String | Nama desa/kelurahan |

---

## 💻 Contoh Penggunaan

### JavaScript (Vanilla)

```javascript
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

// Fungsi untuk mengambil data
async function fetchGeoJSON(path) {
    const response = await fetch(`${CDN_BASE}/${path}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

// Contoh: Ambil semua provinsi
async function getAllProvinces() {
    return await fetchGeoJSON('map_index.json');
}

// Contoh: Ambil peta kabupaten di suatu provinsi
async function getRegencyMap(provinceFolder, provinceId, provinceName) {
    const path = `indonesia-district/${provinceFolder}/${provinceId}_${provinceName}_district.geojson`;
    return await fetchGeoJSON(path);
}

// Contoh: Ambil peta kecamatan
async function getDistrictMap(provinceFolder, regencyFolder, regencyId, regencyName) {
    const path = `indonesia-district/${provinceFolder}/${regencyFolder}/${regencyId}_${regencyName}.geojson`;
    return await fetchGeoJSON(path);
}
```

---

### Leaflet.js

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        #map { height: 100vh; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
        
        // Inisialisasi peta
        const map = L.map('map').setView([-2.5489, 118.0149], 5);
        
        // Tambahkan tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        // Load GeoJSON provinsi
        fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`)
            .then(res => res.json())
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        fillColor: '#3388ff',
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.5
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(feature.properties.name);
                    }
                }).addTo(map);
            });
    </script>
</body>
</html>
```

---

### React.js

```jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

function IndonesiaMap() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`)
            .then(res => res.json())
            .then(data => setGeoData(data));
    }, []);

    return (
        <MapContainer center={[-2.5489, 118.0149]} zoom={5} style={{ height: '100vh' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
    );
}

export default IndonesiaMap;
```

---

### Vue.js

```vue
<template>
  <div id="map" style="height: 100vh;"></div>
</template>

<script>
import L from 'leaflet';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

export default {
  name: 'IndonesiaMap',
  mounted() {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`)
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data).addTo(map);
      });
  }
}
</script>
```

---

### Python

```python
import requests

CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master'

def get_provinces():
    """Ambil daftar semua provinsi"""
    response = requests.get(f'{CDN_BASE}/map_index.json')
    return response.json()

def get_geojson(path):
    """Ambil GeoJSON dari path tertentu"""
    response = requests.get(f'{CDN_BASE}/{path}')
    return response.json()

# Contoh penggunaan
provinces = get_provinces()
for prov in provinces:
    print(f"{prov['id']}: {prov['name']}")
```

---

### cURL

```bash
# Ambil daftar provinsi
curl -s "https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/map_index.json" | jq '.[].name'

# Ambil peta provinsi
curl -O "https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037%20simplified.geojson"

# Ambil peta kabupaten Aceh
curl -O "https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id11_aceh_district.geojson"
```

---

## 📊 Daftar Provinsi

| Kode | Nama Provinsi | Folder |
|------|---------------|--------|
| 11 | Aceh | `id11_aceh` |
| 12 | Sumatera Utara | `id12_sumatera_utara` |
| 13 | Sumatera Barat | `id13_sumatera_barat` |
| 14 | Riau | `id14_riau` |
| 15 | Jambi | `id15_jambi` |
| 16 | Sumatera Selatan | `id16_sumatera_selatan` |
| 17 | Bengkulu | `id17_bengkulu` |
| 18 | Lampung | `id18_lampung` |
| 19 | Kepulauan Bangka Belitung | `id19_kepulauan_bangka_belitung` |
| 21 | Kepulauan Riau | `id21_kepulauan_riau` |
| 31 | DKI Jakarta | `id31_dki_jakarta` |
| 32 | Jawa Barat | `id32_jawa_barat` |
| 33 | Jawa Tengah | `id33_jawa_tengah` |
| 34 | DI Yogyakarta | `id34_daerah_istimewa_yogyakarta` |
| 35 | Jawa Timur | `id35_jawa_timur` |
| 36 | Banten | `id36_banten` |
| 51 | Bali | `id51_bali` |
| 52 | Nusa Tenggara Barat | `id52_nusa_tenggara_barat` |
| 53 | Nusa Tenggara Timur | `id53_nusa_tenggara_timur` |
| 61 | Kalimantan Barat | `id61_kalimantan_barat` |
| 62 | Kalimantan Tengah | `id62_kalimantan_tengah` |
| 63 | Kalimantan Selatan | `id63_kalimantan_selatan` |
| 64 | Kalimantan Timur | `id64_kalimantan_timur` |
| 65 | Kalimantan Utara | `id65_kalimantan_utara` |
| 71 | Sulawesi Utara | `id71_sulawesi_utara` |
| 72 | Sulawesi Tengah | `id72_sulawesi_tengah` |
| 73 | Sulawesi Selatan | `id73_sulawesi_selatan` |
| 74 | Sulawesi Tenggara | `id74_sulawesi_tenggara` |
| 75 | Gorontalo | `id75_gorontalo` |
| 76 | Sulawesi Barat | `id76_sulawesi_barat` |
| 81 | Maluku | `id81_maluku` |
| 82 | Maluku Utara | `id82_maluku_utara` |
| 91 | Papua Barat | `id91_papua_barat` |
| 94 | Papua | `id94_papua` |

---

## 🔗 URL Pattern

### Pattern Generator

```javascript
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

const URLs = {
    // Master Index
    masterIndex: `${CDN_BASE}/map_index.json`,
    
    // Provinsi
    provincesSimplified: `${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`,
    provincesFull: `${CDN_BASE}/indonesia-district/prov%2037.geojson`,
    
    // Semua Kabupaten
    allRegencies: `${CDN_BASE}/indonesia-district/kab%2037.geojson`,
    
    // Kabupaten per Provinsi
    provinceDistricts: (provId, provName) => 
        `${CDN_BASE}/indonesia-district/id${provId}_${provName}/id${provId}_${provName}_district.geojson`,
    
    // Kecamatan per Kabupaten
    regencyMap: (provId, provName, regId, regName) => 
        `${CDN_BASE}/indonesia-district/id${provId}_${provName}/id${regId}_${regName}/id${regId}_${regName}.geojson`,
    
    // Desa per Kecamatan
    districtMap: (provId, provName, regId, regName, distId, distName) => 
        `${CDN_BASE}/indonesia-district/id${provId}_${provName}/id${regId}_${regName}/id${distId}_${distName}.geojson`
};
```

---

## 📦 Integrasi

### NPM / Yarn (Coming Soon)

```bash
# Akan tersedia di npm
npm install indonesia-geojson-api
```

### CDN Tags

```html
<!-- Langsung import sebagai module -->
<script type="module">
    const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
    
    const response = await fetch(`${CDN_BASE}/map_index.json`);
    const data = await response.json();
    console.log(data);
</script>
```

---

## ⚡ Tips Performa

1. **Gunakan Simplified Version** - Untuk tampilan overview, gunakan `prov 37 simplified.geojson`
2. **Lazy Loading** - Muat data kabupaten/kecamatan hanya saat diperlukan
3. **Caching** - jsDelivr sudah memiliki caching global, manfaatkan dengan baik
4. **Compression** - jsDelivr otomatis mengompresi response dengan gzip

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Kontak

- **GitHub:** [@mohdlabib](https://github.com/mohdlabib)
- **Repository:** [leafletMAP](https://github.com/mohdlabib/leafletMAP)

---

## 🙏 Credits

- Data GeoJSON berdasarkan data administratif Indonesia
- Powered by [jsDelivr CDN](https://www.jsdelivr.com/)
- Built with [Leaflet.js](https://leafletjs.com/)

---

<p align="center">
  Made with ❤️ for Indonesian Developers
</p>

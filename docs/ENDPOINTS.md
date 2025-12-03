# 📋 API Endpoints Reference

Dokumentasi lengkap semua endpoint yang tersedia di Indonesia GeoJSON API.

---

## Base URL

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master
```

---

## Quick Reference Table

| Endpoint | Deskripsi | Format |
|----------|-----------|--------|
| `/map_index.json` | Master index semua wilayah | JSON |
| `/provinces.json` | Daftar provinsi sederhana | JSON |
| `/indonesia-district/prov 37 simplified.geojson` | Peta provinsi (simplified) | GeoJSON |
| `/indonesia-district/prov 37.geojson` | Peta provinsi (full) | GeoJSON |
| `/indonesia-district/kab 37.geojson` | Peta semua kabupaten | GeoJSON |

---

## Endpoints Detail

### 1. Master Index

**Endpoint:** `GET /map_index.json`

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/map_index.json
```

**Deskripsi:** Berisi struktur hierarki lengkap dari Provinsi → Kabupaten → Kecamatan

**Response Schema:**
```typescript
interface MapIndex {
    id: string;           // Kode BPS
    name: string;         // Nama provinsi
    folder: string;       // Nama folder
    regencies: Regency[]; // Daftar kabupaten
}

interface Regency {
    id: string;
    name: string;
    folder: string;
    file: string;         // Path ke GeoJSON
    districts: District[];
}

interface District {
    id: string;
    name: string;
    file: string;
}
```

---

### 2. Provinces List

**Endpoint:** `GET /provinces.json`

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/provinces.json
```

**Deskripsi:** Daftar sederhana provinsi dengan path ke file district

---

### 3. All Provinces Map (Simplified)

**Endpoint:** `GET /indonesia-district/prov%2037%20simplified.geojson`

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037%20simplified.geojson
```

**Deskripsi:** Peta semua provinsi Indonesia dalam format simplified (ukuran lebih kecil, load lebih cepat)

**GeoJSON Properties:**
- `prov_id`: Kode provinsi
- `name`: Nama provinsi

---

### 4. All Provinces Map (Full Detail)

**Endpoint:** `GET /indonesia-district/prov%2037.geojson`

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/prov%2037.geojson
```

**Deskripsi:** Peta semua provinsi dengan detail geometry lengkap

---

### 5. All Regencies Map

**Endpoint:** `GET /indonesia-district/kab%2037.geojson`

**Full URL:**
```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/kab%2037.geojson
```

**Deskripsi:** Peta semua kabupaten/kota Indonesia

**GeoJSON Properties:**
- `prov_id`: Kode provinsi
- `name`: Nama kabupaten/kota

---

### 6. Province Districts

**Pattern:** `GET /indonesia-district/{province_folder}/{province_folder}_district.geojson`

**Examples:**

| Provinsi | URL |
|----------|-----|
| Aceh | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id11_aceh_district.geojson` |
| Sumatera Utara | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id12_sumatera_utara/id12_sumatera_utara_district.geojson` |
| Jawa Barat | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id32_jawa_barat/id32_jawa_barat_district.geojson` |
| DKI Jakarta | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id31_dki_jakarta/id31_dki_jakarta_district.geojson` |

---

### 7. Regency Map (Districts)

**Pattern:** `GET /indonesia-district/{province_folder}/{regency_folder}/{regency_folder}.geojson`

**Examples:**

| Kabupaten/Kota | URL |
|----------------|-----|
| Kab. Simeulue | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id1101_simeulue/id1101_simeulue.geojson` |
| Kota Banda Aceh | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id1171_kota_banda_aceh/id1171_kota_banda_aceh.geojson` |

---

### 8. District Map (Villages)

**Pattern:** `GET /indonesia-district/{province_folder}/{regency_folder}/{district_id}_{district_name}.geojson`

**Examples:**

| Kecamatan | URL |
|-----------|-----|
| Teupah Selatan | `https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/indonesia-district/id11_aceh/id1101_simeulue/id1101010_teupah_selatan.geojson` |

---

## Province Folders Reference

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

## URL Builder Helper

### JavaScript

```javascript
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

const IndonesiaGeoJSONAPI = {
    // Master index
    masterIndex: () => `${CDN_BASE}/map_index.json`,
    
    // Provinces list
    provincesList: () => `${CDN_BASE}/provinces.json`,
    
    // All provinces map
    allProvinces: (simplified = true) => {
        const file = simplified ? 'prov%2037%20simplified.geojson' : 'prov%2037.geojson';
        return `${CDN_BASE}/indonesia-district/${file}`;
    },
    
    // All regencies map
    allRegencies: () => `${CDN_BASE}/indonesia-district/kab%2037.geojson`,
    
    // Province districts
    provinceDistricts: (provinceFolder) => {
        return `${CDN_BASE}/indonesia-district/${provinceFolder}/${provinceFolder}_district.geojson`;
    },
    
    // Regency map
    regencyMap: (provinceFolder, regencyFolder) => {
        return `${CDN_BASE}/indonesia-district/${provinceFolder}/${regencyFolder}/${regencyFolder}.geojson`;
    },
    
    // District map (villages)
    districtMap: (provinceFolder, regencyFolder, districtId, districtName) => {
        const safeName = districtName.toLowerCase().replace(/ /g, '_');
        return `${CDN_BASE}/indonesia-district/${provinceFolder}/${regencyFolder}/${districtId}_${safeName}.geojson`;
    }
};

// Usage examples:
console.log(IndonesiaGeoJSONAPI.masterIndex());
console.log(IndonesiaGeoJSONAPI.allProvinces());
console.log(IndonesiaGeoJSONAPI.provinceDistricts('id11_aceh'));
console.log(IndonesiaGeoJSONAPI.regencyMap('id11_aceh', 'id1101_simeulue'));
```

### Python

```python
CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master'

class IndonesiaGeoJSONAPI:
    @staticmethod
    def master_index():
        return f'{CDN_BASE}/map_index.json'
    
    @staticmethod
    def provinces_list():
        return f'{CDN_BASE}/provinces.json'
    
    @staticmethod
    def all_provinces(simplified=True):
        file = 'prov%2037%20simplified.geojson' if simplified else 'prov%2037.geojson'
        return f'{CDN_BASE}/indonesia-district/{file}'
    
    @staticmethod
    def all_regencies():
        return f'{CDN_BASE}/indonesia-district/kab%2037.geojson'
    
    @staticmethod
    def province_districts(province_folder):
        return f'{CDN_BASE}/indonesia-district/{province_folder}/{province_folder}_district.geojson'
    
    @staticmethod
    def regency_map(province_folder, regency_folder):
        return f'{CDN_BASE}/indonesia-district/{province_folder}/{regency_folder}/{regency_folder}.geojson'
    
    @staticmethod
    def district_map(province_folder, regency_folder, district_id, district_name):
        safe_name = district_name.lower().replace(' ', '_')
        return f'{CDN_BASE}/indonesia-district/{province_folder}/{regency_folder}/{district_id}_{safe_name}.geojson'

# Usage
print(IndonesiaGeoJSONAPI.master_index())
print(IndonesiaGeoJSONAPI.province_districts('id11_aceh'))
```

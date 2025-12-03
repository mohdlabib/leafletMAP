# 📖 Indonesia GeoJSON API - Dokumentasi Lengkap

## Pendahuluan

Indonesia GeoJSON API menyediakan akses ke data geospasial administratif Indonesia melalui CDN jsDelivr. API ini bersifat RESTful dan mengembalikan data dalam format GeoJSON.

---

## Base URL

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/
```

---

## Endpoints

### 1. Master Index

Endpoint untuk mendapatkan struktur hierarki lengkap data administratif Indonesia.

#### Request

```http
GET /map_index.json
```

#### Response

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

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Kode wilayah BPS |
| `name` | String | Nama wilayah |
| `folder` | String | Nama folder di repository |
| `file` | String | Path ke file GeoJSON |
| `regencies` | Array | Daftar kabupaten/kota (level provinsi) |
| `districts` | Array | Daftar kecamatan (level kabupaten) |

---

### 2. Provinces List

Endpoint untuk mendapatkan daftar sederhana provinsi.

#### Request

```http
GET /provinces.json
```

#### Response

```json
[
    {
        "file": "indonesia-district/id11_aceh/id11_aceh_district.geojson",
        "name": "Aceh"
    }
]
```

---

### 3. Indonesia Map - Provinces

#### Simplified Version (Recommended for Overview)

```http
GET /indonesia-district/prov%2037%20simplified.geojson
```

#### Full Detail Version

```http
GET /indonesia-district/prov%2037.geojson
```

#### Response (GeoJSON FeatureCollection)

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "prov_id": "11",
                "name": "Aceh"
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [...]
            }
        }
    ]
}
```

---

### 4. Indonesia Map - All Regencies

```http
GET /indonesia-district/kab%2037.geojson
```

#### Response Properties

| Property | Type | Description |
|----------|------|-------------|
| `prov_id` | String | Kode provinsi |
| `name` | String | Nama kabupaten/kota |
| `regency_id` | String | Kode kabupaten/kota |

---

### 5. Province Districts Map

Peta semua kabupaten/kota dalam satu provinsi.

#### URL Pattern

```http
GET /indonesia-district/{province_folder}/{province_folder}_district.geojson
```

#### Examples

| Provinsi | URL |
|----------|-----|
| Aceh | `/indonesia-district/id11_aceh/id11_aceh_district.geojson` |
| Jawa Barat | `/indonesia-district/id32_jawa_barat/id32_jawa_barat_district.geojson` |
| DKI Jakarta | `/indonesia-district/id31_dki_jakarta/id31_dki_jakarta_district.geojson` |

---

### 6. Regency Map (Districts within Regency)

Peta semua kecamatan dalam satu kabupaten/kota.

#### URL Pattern

```http
GET /indonesia-district/{province_folder}/{regency_folder}/{regency_folder}.geojson
```

#### Examples

| Kabupaten | URL |
|-----------|-----|
| Kab. Simeulue | `/indonesia-district/id11_aceh/id1101_simeulue/id1101_simeulue.geojson` |
| Kota Bandung | `/indonesia-district/id32_jawa_barat/id3273_kota_bandung/id3273_kota_bandung.geojson` |

---

### 7. District Map (Villages within District)

Peta semua desa/kelurahan dalam satu kecamatan.

#### URL Pattern

```http
GET /indonesia-district/{province_folder}/{regency_folder}/{district_id}_{district_name}.geojson
```

#### Examples

| Kecamatan | URL |
|-----------|-----|
| Teupah Selatan | `/indonesia-district/id11_aceh/id1101_simeulue/id1101010_teupah_selatan.geojson` |

---

## GeoJSON Format

### Standard GeoJSON Structure

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Nama Wilayah",
                "prov_id": "11",
                "regency": "Nama Kabupaten",
                "district": "Nama Kecamatan",
                "village": "Nama Desa"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [longitude, latitude],
                        [longitude, latitude],
                        ...
                    ]
                ]
            }
        }
    ]
}
```

### Geometry Types

| Level | Geometry Type |
|-------|---------------|
| Provinsi | MultiPolygon |
| Kabupaten/Kota | Polygon / MultiPolygon |
| Kecamatan | Polygon / MultiPolygon |
| Desa/Kelurahan | Polygon |

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | File not found |
| 403 | Access forbidden |
| 500 | Server error |

### Error Response Example

Jika file tidak ditemukan, jsDelivr akan mengembalikan halaman HTML 404.

**Best Practice:** Selalu gunakan try-catch saat fetching data.

```javascript
async function fetchGeoJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching GeoJSON:', error);
        return null;
    }
}
```

---

## Rate Limiting

jsDelivr tidak memiliki rate limiting ketat, tetapi untuk penggunaan yang sangat intensif, pertimbangkan:

1. Caching di sisi client
2. Menggunakan service worker
3. Lazy loading data

---

## Caching

jsDelivr memiliki caching global dengan CDN nodes di seluruh dunia. Default cache time adalah 7 hari untuk file statis.

### Cache Headers

```
Cache-Control: public, max-age=604800
```

### Force Cache Refresh

Gunakan specific commit hash untuk memaksa refresh:

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@{commit-hash}/map_index.json
```

---

## CORS

jsDelivr mendukung CORS untuk semua origins, sehingga dapat diakses dari browser manapun.

```
Access-Control-Allow-Origin: *
```

---

## Versioning

### Latest Version (Master Branch)

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/
```

### Specific Commit

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@abc123/
```

### Specific Tag (if available)

```
https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@v1.0.0/
```

---

## Data Quality

### Coordinate System

- **CRS:** WGS 84 (EPSG:4326)
- **Format:** [longitude, latitude]

### Data Source

Data berdasarkan pembagian administratif resmi Indonesia dari Badan Pusat Statistik (BPS).

### Update Frequency

Data diperbarui secara berkala mengikuti perubahan administratif resmi.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/mohdlabib/leafletMAP/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mohdlabib/leafletMAP/discussions)

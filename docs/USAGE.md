# 🚀 Panduan Penggunaan Indonesia GeoJSON API

## Daftar Isi

1. [Instalasi & Setup](#instalasi--setup)
2. [Penggunaan Dasar](#penggunaan-dasar)
3. [Integrasi dengan Leaflet.js](#integrasi-dengan-leafletjs)
4. [Integrasi dengan React](#integrasi-dengan-react)
5. [Integrasi dengan Vue.js](#integrasi-dengan-vuejs)
6. [Integrasi dengan Next.js](#integrasi-dengan-nextjs)
7. [Penggunaan dengan Python](#penggunaan-dengan-python)
8. [Best Practices](#best-practices)

---

## Instalasi & Setup

### Tidak Perlu Instalasi!

API ini berbasis CDN, jadi tidak perlu instalasi apapun. Cukup gunakan URL berikut:

```javascript
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
```

---

## Penggunaan Dasar

### Fetch Data dengan JavaScript

```javascript
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

// Helper function
async function fetchData(path) {
    const response = await fetch(`${CDN_BASE}/${path}`);
    if (!response.ok) throw new Error(`Failed to fetch: ${path}`);
    return response.json();
}

// Ambil semua data provinsi
async function getProvinces() {
    return await fetchData('map_index.json');
}

// Ambil peta provinsi
async function getProvincesMap() {
    return await fetchData('indonesia-district/prov%2037%20simplified.geojson');
}

// Contoh penggunaan
getProvinces().then(data => {
    data.forEach(prov => {
        console.log(`${prov.id}: ${prov.name}`);
    });
});
```

---

## Integrasi dengan Leaflet.js

### Setup Dasar

```html
<!DOCTYPE html>
<html>
<head>
    <title>Peta Indonesia</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
        .info {
            padding: 10px 15px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }
        .info h4 { margin: 0 0 5px; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <script>
        const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
        
        // Inisialisasi peta
        const map = L.map('map').setView([-2.5489, 118.0149], 5);
        
        // Tambahkan tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            maxZoom: 20
        }).addTo(map);
        
        // Info control
        const info = L.control();
        info.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        info.update = function(props) {
            this._div.innerHTML = '<h4>Indonesia</h4>' + 
                (props ? '<b>' + props.name + '</b>' : 'Hover over a province');
        };
        info.addTo(map);
        
        // Style function
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.name),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        
        // Random color based on name
        function getColor(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const hue = Math.abs(hash % 360);
            return `hsl(${hue}, 70%, 60%)`;
        }
        
        // Highlight feature
        function highlightFeature(e) {
            const layer = e.target;
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            layer.bringToFront();
            info.update(layer.feature.properties);
        }
        
        // Reset highlight
        function resetHighlight(e) {
            geojsonLayer.resetStyle(e.target);
            info.update();
        }
        
        // Zoom to feature
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }
        
        // On each feature
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
        
        // Load GeoJSON
        let geojsonLayer;
        fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`)
            .then(res => res.json())
            .then(data => {
                geojsonLayer = L.geoJSON(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
    </script>
</body>
</html>
```

### Drill-Down Navigation (Provinsi → Kabupaten → Kecamatan)

```javascript
class IndonesiaMap {
    constructor(mapId) {
        this.CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
        this.map = L.map(mapId).setView([-2.5489, 118.0149], 5);
        this.currentLayer = null;
        this.mapIndex = null;
        this.currentLevel = 'province';
        
        this.init();
    }
    
    async init() {
        // Add tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO'
        }).addTo(this.map);
        
        // Load index
        this.mapIndex = await this.fetchData('map_index.json');
        
        // Load provinces
        await this.loadProvinces();
    }
    
    async fetchData(path) {
        const response = await fetch(`${this.CDN_BASE}/${path}`);
        return response.json();
    }
    
    async loadProvinces() {
        this.currentLevel = 'province';
        const data = await this.fetchData('indonesia-district/prov%2037%20simplified.geojson');
        this.updateLayer(data, this.onProvinceClick.bind(this));
        this.map.setView([-2.5489, 118.0149], 5);
    }
    
    async loadProvince(provinceId) {
        this.currentLevel = 'regency';
        const province = this.mapIndex.find(p => p.id === provinceId);
        if (!province) return;
        
        const path = `indonesia-district/${province.folder}/${province.folder}_district.geojson`;
        const data = await this.fetchData(path);
        this.updateLayer(data, this.onRegencyClick.bind(this));
    }
    
    async loadRegency(provinceId, regencyId) {
        this.currentLevel = 'district';
        const province = this.mapIndex.find(p => p.id === provinceId);
        if (!province) return;
        
        const regency = province.regencies.find(r => r.id === regencyId);
        if (!regency || !regency.file) return;
        
        const data = await this.fetchData(regency.file);
        this.updateLayer(data);
    }
    
    updateLayer(data, clickHandler) {
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }
        
        this.currentLayer = L.geoJSON(data, {
            style: this.getStyle.bind(this),
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: this.highlightFeature.bind(this),
                    mouseout: (e) => this.currentLayer.resetStyle(e.target),
                    click: clickHandler
                });
            }
        }).addTo(this.map);
        
        this.map.fitBounds(this.currentLayer.getBounds());
    }
    
    getStyle(feature) {
        const name = feature.properties.name || '';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        
        return {
            fillColor: `hsl(${hue}, 60%, 70%)`,
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }
    
    highlightFeature(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#f59e0b',
            fillOpacity: 0.9
        });
        layer.bringToFront();
    }
    
    onProvinceClick(e) {
        const provId = e.target.feature.properties.prov_id;
        this.loadProvince(provId);
    }
    
    onRegencyClick(e) {
        // Implement regency click logic
        console.log('Regency clicked:', e.target.feature.properties);
    }
}

// Usage
const indonesiaMap = new IndonesiaMap('map');
```

---

## Integrasi dengan React

### Menggunakan react-leaflet

```bash
npm install leaflet react-leaflet
```

```jsx
// IndonesiaMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

const IndonesiaMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [mapIndex, setMapIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${CDN_BASE}/map_index.json`).then(r => r.json()),
            fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`).then(r => r.json())
        ]).then(([index, geo]) => {
            setMapIndex(index);
            setGeoData(geo);
            setLoading(false);
        });
    }, []);

    const getColor = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${Math.abs(hash % 360)}, 60%, 70%)`;
    };

    const style = (feature) => ({
        fillColor: getColor(feature.properties.name || ''),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    });

    const onEachFeature = (feature, layer) => {
        layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
        
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({
                    weight: 3,
                    color: '#f59e0b',
                    fillOpacity: 0.9
                });
            },
            mouseout: (e) => {
                e.target.setStyle(style(feature));
            }
        });
    };

    if (loading) return <div>Loading map...</div>;

    return (
        <MapContainer
            center={[-2.5489, 118.0149]}
            zoom={5}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='© OpenStreetMap © CARTO'
            />
            {geoData && (
                <GeoJSON
                    data={geoData}
                    style={style}
                    onEachFeature={onEachFeature}
                />
            )}
        </MapContainer>
    );
};

export default IndonesiaMap;
```

### Custom Hook untuk Data

```jsx
// useIndonesiaGeoJSON.js
import { useState, useEffect } from 'react';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

export function useIndonesiaGeoJSON() {
    const [mapIndex, setMapIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${CDN_BASE}/map_index.json`)
            .then(res => res.json())
            .then(data => {
                setMapIndex(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const getProvinceMap = async (provinceFolder) => {
        const response = await fetch(
            `${CDN_BASE}/indonesia-district/${provinceFolder}/${provinceFolder}_district.geojson`
        );
        return response.json();
    };

    const getRegencyMap = async (provinceFolder, regencyFolder) => {
        const response = await fetch(
            `${CDN_BASE}/indonesia-district/${provinceFolder}/${regencyFolder}/${regencyFolder}.geojson`
        );
        return response.json();
    };

    return {
        mapIndex,
        loading,
        error,
        getProvinceMap,
        getRegencyMap,
        CDN_BASE
    };
}
```

---

## Integrasi dengan Vue.js

### Vue 3 Composition API

```vue
<!-- IndonesiaMap.vue -->
<template>
    <div id="map" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
const mapContainer = ref(null);
let map = null;
let currentLayer = null;

const getColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash % 360)}, 60%, 70%)`;
};

const style = (feature) => ({
    fillColor: getColor(feature.properties.name || ''),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
});

const loadGeoJSON = async (url) => {
    const response = await fetch(url);
    return response.json();
};

onMounted(async () => {
    // Initialize map
    map = L.map(mapContainer.value).setView([-2.5489, 118.0149], 5);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);
    
    // Load provinces
    const data = await loadGeoJSON(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`);
    
    currentLayer = L.geoJSON(data, {
        style: style,
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
            
            layer.on({
                mouseover: (e) => {
                    e.target.setStyle({
                        weight: 3,
                        color: '#f59e0b',
                        fillOpacity: 0.9
                    });
                },
                mouseout: (e) => {
                    currentLayer.resetStyle(e.target);
                }
            });
        }
    }).addTo(map);
});
</script>

<style scoped>
#map {
    height: 100vh;
    width: 100%;
}
</style>
```

---

## Integrasi dengan Next.js

### Dynamic Import (SSR Compatible)

```jsx
// pages/map.js
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(
    () => import('../components/IndonesiaMap'),
    { ssr: false }
);

export default function MapPage() {
    return (
        <div style={{ height: '100vh' }}>
            <MapWithNoSSR />
        </div>
    );
}
```

```jsx
// components/IndonesiaMap.js
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';

export default function IndonesiaMap() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch(`${CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson`)
            .then(res => res.json())
            .then(setGeoData);
    }, []);

    return (
        <MapContainer
            center={[-2.5489, 118.0149]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
    );
}
```

---

## Penggunaan dengan Python

### Menggunakan requests dan geopandas

```python
import requests
import geopandas as gpd
import matplotlib.pyplot as plt
from io import StringIO
import json

CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master'

def get_provinces_index():
    """Ambil index provinsi"""
    response = requests.get(f'{CDN_BASE}/map_index.json')
    return response.json()

def get_geojson(path):
    """Ambil GeoJSON sebagai GeoDataFrame"""
    url = f'{CDN_BASE}/{path}'
    response = requests.get(url)
    data = response.json()
    return gpd.GeoDataFrame.from_features(data['features'])

# Contoh: Load peta provinsi
gdf = get_geojson('indonesia-district/prov%2037%20simplified.geojson')

# Plot
fig, ax = plt.subplots(figsize=(15, 10))
gdf.plot(ax=ax, edgecolor='white', linewidth=0.5)
ax.set_title('Peta Indonesia')
plt.show()

# Export ke format lain
gdf.to_file('indonesia.shp')  # Shapefile
gdf.to_file('indonesia.gpkg', driver='GPKG')  # GeoPackage
```

### Dengan Folium

```python
import folium
import requests

CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master'

# Create map
m = folium.Map(location=[-2.5489, 118.0149], zoom_start=5)

# Get GeoJSON
response = requests.get(f'{CDN_BASE}/indonesia-district/prov%2037%20simplified.geojson')
geojson_data = response.json()

# Add GeoJSON layer
folium.GeoJson(
    geojson_data,
    name='Indonesia',
    style_function=lambda x: {
        'fillColor': '#3388ff',
        'color': 'white',
        'weight': 1,
        'fillOpacity': 0.5
    }
).add_to(m)

# Save
m.save('indonesia_map.html')
```

---

## Best Practices

### 1. Caching Data

```javascript
// Implementasi simple cache
const cache = new Map();

async function fetchWithCache(url, ttl = 3600000) { // 1 hour default
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    cache.set(url, {
        data,
        timestamp: Date.now()
    });
    
    return data;
}
```

### 2. Lazy Loading

```javascript
// Load data saat diperlukan
async function loadProvinceOnDemand(provinceId) {
    const province = mapIndex.find(p => p.id === provinceId);
    if (!province._loaded) {
        const data = await fetchData(province.folder);
        province._loaded = true;
        province._geoData = data;
    }
    return province._geoData;
}
```

### 3. Error Handling

```javascript
async function safeLoadGeoJSON(path) {
    try {
        const response = await fetch(`${CDN_BASE}/${path}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${path}:`, error);
        // Return empty feature collection as fallback
        return { type: 'FeatureCollection', features: [] };
    }
}
```

### 4. Progressive Loading

```javascript
// Load simplified first, then full detail
async function progressiveLoad(path) {
    // Show simplified first
    const simplified = await fetchData(path.replace('.geojson', '_simplified.geojson'));
    updateMap(simplified);
    
    // Then load full in background
    const full = await fetchData(path);
    updateMap(full);
}
```

// Global Variables
let map;
let mapData = []; // The index data
let baseRegencyData = null; // kab 37.geojson content
let baseProvinceData = null; // prov 37 simplified.geojson content
let currentGeoJSONLayer = null;
let markerLayerGroup = L.layerGroup(); // Combined markers
let currentLevel = 'province'; // province, regency, district, village
let selectedProvince = null;
let selectedRegency = null;
let selectedDistrict = null;

// UI Elements
const wizardTitle = document.getElementById('wizard-title');
const wizardContent = document.getElementById('wizard-content');
const backBtn = document.getElementById('back-btn');
const info = document.getElementById('info');

// Initialize Map
function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([-2.5489, 118.0149], 5); // Center of Indonesia

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    markerLayerGroup.addTo(map);

    // Load Index and Base Map Data
    Promise.all([
        fetch('map_index.json').then(res => res.json()),
        fetch('indonesia-district/kab 37.geojson').then(res => res.json()),
        fetch('indonesia-district/prov 37 simplified.geojson').then(res => res.json())
    ]).then(([indexData, regencyData, provinceData]) => {
        mapData = indexData;
        baseRegencyData = regencyData;
        baseProvinceData = provinceData;

        enrichMapDataWithCounts(); // Simulate data
        renderProvinces();
    }).catch(err => {
        console.error('Error loading data:', err);
        wizardContent.innerHTML = '<div class="p-4 text-red-500">Gagal memuat data.</div>';
    });
}

// --- Data Simulation ---

function enrichMapDataWithCounts() {
    mapData.forEach(prov => {
        let provCount = 0;
        if (prov.regencies) {
            prov.regencies.forEach(reg => {
                let regCount = 0;
                if (reg.districts) {
                    reg.districts.forEach(dist => {
                        const distCount = Math.floor(Math.random() * 4500) + 500;
                        dist.customerCount = distCount;
                        dist.topProducts = generateTopProducts();
                        regCount += distCount;
                    });
                } else {
                    regCount = Math.floor(Math.random() * 20000) + 5000;
                }
                reg.customerCount = regCount;
                provCount += regCount;
            });
        } else {
            provCount = Math.floor(Math.random() * 100000) + 20000;
        }
        prov.customerCount = provCount;
        prov.topProducts = generateTopProducts(); // Also for province
    });
}

function generateTopProducts() {
    const products = [
        "Kopi Gayo", "Beras Premium", "Minyak Goreng", "Gula Pasir",
        "Telur Ayam", "Mie Instan", "Sabun Mandi", "Shampoo",
        "Deterjen", "Pakaian Anak", "Sepatu Sekolah", "Tas Wanita",
        "Elektronik Rumah", "Smartphone", "Pulsa & Data"
    ];

    const numProducts = Math.floor(Math.random() * 3) + 3;
    const shuffled = products.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numProducts);

    return selected.map(name => ({
        name: name,
        count: Math.floor(Math.random() * 500) + 50
    })).sort((a, b) => b.count - a.count);
}

// --- Wizard / UI Logic ---

function renderProvinces() {
    currentLevel = 'province';
    selectedProvince = null;
    selectedRegency = null;
    selectedDistrict = null;

    wizardTitle.textContent = 'Pilih Provinsi';
    backBtn.style.display = 'none';
    wizardContent.innerHTML = '';

    mapData.sort((a, b) => a.name.localeCompare(b.name));

    mapData.forEach(prov => {
        const item = createLocationItem(prov.name, prov.customerCount, () => {
            highlightRegionOnMap(prov.name, 'province');
            showRegionDetails(prov, 'province');
        });
        wizardContent.appendChild(item);
    });

    loadCountryMap();
}

function selectProvince(prov) {
    currentLevel = 'regency';
    selectedProvince = prov;
    selectedRegency = null;
    selectedDistrict = null;

    wizardTitle.textContent = prov.name;
    backBtn.style.display = 'flex';
    backBtn.onclick = renderProvinces;
    wizardContent.innerHTML = '';

    prov.regencies.sort((a, b) => a.name.localeCompare(b.name));

    prov.regencies.forEach(reg => {
        const item = createLocationItem(reg.name, reg.customerCount, () => {
            highlightRegionOnMap(reg.name, 'regency');
            showRegionDetails(reg, 'regency');
        });
        wizardContent.appendChild(item);
    });

    loadProvinceMap(prov);
}

function selectRegency(reg) {
    currentLevel = 'district';
    selectedRegency = reg;
    selectedDistrict = null;

    wizardTitle.textContent = reg.name;
    backBtn.onclick = () => selectProvince(selectedProvince);
    wizardContent.innerHTML = '';

    if (reg.districts) {
        reg.districts.sort((a, b) => a.name.localeCompare(b.name));
        reg.districts.forEach(dist => {
            const item = createLocationItem(dist.name, dist.customerCount, () => {
                highlightRegionOnMap(dist.name, 'district');
                showRegionDetails(dist, 'district');
            });
            wizardContent.appendChild(item);
        });
    }

    loadRegencyMap(reg);
}

function showRegionDetails(data, level) {
    // Universal details view for Prov, Reg, Dist
    let nextLevelName = '';
    let nextAction = null;
    let buttonText = '';

    if (level === 'province') {
        nextLevelName = 'Kabupaten/Kota';
        buttonText = 'Lihat Kabupaten';
        nextAction = () => selectProvince(data);
    } else if (level === 'regency') {
        nextLevelName = 'Kecamatan';
        buttonText = 'Lihat Kecamatan';
        nextAction = () => selectRegency(data);
    } else if (level === 'district') {
        nextLevelName = 'Desa/Kelurahan';
        buttonText = 'Lihat Desa';
        nextAction = () => loadDistrictMap(data);
    } else if (level === 'village') {
        // Village is the lowest level, no next action
        buttonText = null;
    }

    // Generate Product List HTML
    let productsHtml = '';
    if (data.topProducts) {
        productsHtml = `<div class="product-list">`;
        data.topProducts.forEach((prod, index) => {
            const percent = Math.min(100, (prod.count / data.topProducts[0].count) * 100);
            productsHtml += `
                <div class="product-item">
                    <div class="product-info">
                        <span class="product-rank">#${index + 1}</span>
                        <span class="product-name">${prod.name}</span>
                        <span class="product-count">${prod.count}</span>
                    </div>
                    <div class="product-bar-bg">
                        <div class="product-bar-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        });
        productsHtml += `</div>`;
    }

    wizardContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px; color: var(--text-primary); font-size: 20px;">${data.name}</h3>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary-color); line-height: 1;">
                    ${data.customerCount ? data.customerCount.toLocaleString() : '-'}
                </div>
                <span style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">Total Customers</span>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Top Produk Terlaris</h4>
                ${productsHtml}
            </div>
            
            ${buttonText ? `
            <button id="next-level-btn" style="
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 14px 24px;
                border-radius: 16px;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 600;
                font-size: 15px;
                cursor: pointer;
                width: 100%;
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <span>${buttonText}</span>
                <span style="font-size: 18px;">→</span>
            </button>
            ` : ''}
        </div>
    `;

    if (buttonText) {
        document.getElementById('next-level-btn').onclick = nextAction;
    }
}

function createLocationItem(text, count, onClick) {
    const item = document.createElement('div');
    item.className = 'location-item';
    item.innerHTML = `
        <span>${text}</span>
        <span style="font-size: 12px; color: #64748b; background: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 12px;">
            ${count ? formatCompactNumber(count) : '-'}
        </span>
    `;
    item.onclick = onClick;
    return item;
}

// --- Map Logic ---

function loadCountryMap() {
    if (!baseProvinceData) return;
    updateMapLayer(baseProvinceData, onProvinceFeatureClick, 'province');
    map.setView([-2.5489, 118.0149], 5);
}

function loadProvinceMap(prov) {
    if (!baseRegencyData) return;
    const features = baseRegencyData.features.filter(f => f.properties.prov_id === prov.id);
    if (features.length === 0) return;
    const geoJsonData = { type: "FeatureCollection", features: features };
    updateMapLayer(geoJsonData, onRegencyFeatureClick, 'regency');
}

function loadRegencyMap(reg) {
    if (!reg.file) return;
    fetch(reg.file)
        .then(res => res.json())
        .then(data => {
            // Check if data is actually villages (has 'village' property)
            // If so, we need to render it as Districts (aggregated)
            const isVillageData = data.features.length > 0 && data.features[0].properties.village;

            if (isVillageData) {
                renderDistrictView(data, reg);
            } else {
                updateMapLayer(data, onDistrictFeatureClick, 'district');
            }
        })
        .catch(err => console.error('Error loading regency map:', err));
}

function renderDistrictView(data, reg) {
    // 1. Group features by District
    const districtGroups = {};
    data.features.forEach(f => {
        const dName = f.properties.district;
        if (!dName) return;
        if (!districtGroups[dName]) districtGroups[dName] = [];
        districtGroups[dName].push(f);
    });

    // 2. Calculate District Centers and Counts
    const districtMarkers = [];
    Object.keys(districtGroups).forEach(dName => {
        const features = districtGroups[dName];
        let latSum = 0, lngSum = 0, count = 0;

        features.forEach(f => {
            // Calculate centroid of each village polygon
            const layer = L.geoJSON(f);
            const center = layer.getBounds().getCenter();
            latSum += center.lat;
            lngSum += center.lng;
            count++;
        });

        // Find district object in reg.districts to get the simulated customer count
        // Try exact match then fuzzy
        let distObj = null;
        if (reg.districts) {
            distObj = reg.districts.find(d => d.name.toUpperCase() === dName.toUpperCase());
        }

        const customerCount = distObj ? distObj.customerCount : 0;

        if (count > 0) {
            districtMarkers.push({
                lat: latSum / count,
                lng: lngSum / count,
                name: dName,
                count: customerCount,
                data: distObj
            });
        }
    });

    // 3. Clear Layers
    if (currentGeoJSONLayer) map.removeLayer(currentGeoJSONLayer);
    markerLayerGroup.clearLayers();

    // 4. Add Polygons (Villages styled by District)
    // We display all villages, but colored by District to look like merged districts
    currentGeoJSONLayer = L.geoJSON(data, {
        style: (feature) => {
            const dName = feature.properties.district;
            const color = getRegionColor({ properties: { name: dName } }); // Use district name for color
            return {
                fillColor: color,
                weight: 1,
                opacity: 1,
                color: color, // Same as fill to hide borders
                dashArray: '',
                fillOpacity: 0.6
            };
        },
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: (e) => {
                    // Highlight ALL villages in this district
                    highlightRegionOnMap(feature.properties.district, 'district');

                    // Show tooltip/info
                    const dName = feature.properties.district;
                    const distObj = reg.districts ? reg.districts.find(d => d.name.toUpperCase() === dName.toUpperCase()) : null;
                    const count = distObj ? distObj.customerCount : 0;
                    info.innerHTML = `<h4>${dName}</h4>${count ? `<div class="info-stat"><span class="info-label">Customers</span><span class="info-value">${count.toLocaleString()}</span></div>` : ''}`;
                },
                mouseout: (e) => {
                    resetHighlight(e);
                },
                click: (e) => {
                    const dName = feature.properties.district;
                    const distObj = reg.districts ? reg.districts.find(d => d.name.toUpperCase() === dName.toUpperCase()) : null;
                    if (distObj) {
                        selectDistrict(distObj);
                    } else {
                        // Fallback if not found in index but exists in map
                        console.warn('District not found in index:', dName);
                    }
                }
            });
        }
    }).addTo(map);

    // 5. Add District Markers Manually
    districtMarkers.forEach(m => {
        addMarkerToLayer(m.lat, m.lng, m.name, m.count, 'district', () => {
            if (m.data) selectDistrict(m.data);
        });
    });

    if (currentGeoJSONLayer.getBounds().isValid()) {
        map.fitBounds(currentGeoJSONLayer.getBounds(), { padding: [50, 50] });
    }
}

function selectDistrict(dist) {
    selectedDistrict = dist;
    loadDistrictMap(dist);
}

function loadDistrictMap(dist) {
    currentLevel = 'village';
    wizardTitle.textContent = dist.name;
    backBtn.onclick = () => selectRegency(selectedRegency);

    if (!dist.file) {
        wizardContent.innerHTML = '<div class="p-4 text-gray-500">Data peta desa belum tersedia.</div>';
        return;
    }

    fetch(dist.file)
        .then(res => res.json())
        .then(data => {
            // STRICT FILTERING: Only show villages belonging to this district
            // Normalize names for comparison
            const targetDistrict = dist.name.trim().toUpperCase();

            const filteredFeatures = data.features.filter(feature => {
                const fDist = (feature.properties.district || '').trim().toUpperCase();
                return fDist === targetDistrict;
            });

            data.features = filteredFeatures;

            if (data.features.length === 0) {
                console.warn('No villages found for district:', dist.name);
                wizardContent.innerHTML = '<div class="p-4 text-gray-500">Data desa tidak ditemukan untuk kecamatan ini.</div>';
                if (currentGeoJSONLayer) map.removeLayer(currentGeoJSONLayer);
                markerLayerGroup.clearLayers();
                return;
            }

            data.features.forEach(feature => {
                if (!feature.properties.customerCount) {
                    feature.properties.customerCount = Math.floor(Math.random() * 950) + 50;
                }
                // Generate Top Products for Village
                feature.properties.topProducts = generateTopProducts();
            });

            populateVillageList(data.features);
            updateMapLayer(data, onVillageFeatureClick, 'village');
        })
        .catch(err => console.error('Error loading district map:', err));
}

function populateVillageList(features) {
    wizardContent.innerHTML = '';
    features.sort((a, b) => {
        const nameA = a.properties.village || a.properties.name || '';
        const nameB = b.properties.village || b.properties.name || '';
        return nameA.localeCompare(nameB);
    });

    features.forEach(feature => {
        const name = feature.properties.village || feature.properties.name;
        const customers = feature.properties.customerCount;
        const item = createLocationItem(name, customers, () => highlightVillageOnMap(name));
        wizardContent.appendChild(item);
    });
}

function updateMapLayer(geoJsonData, clickHandler, level) {
    if (currentGeoJSONLayer) {
        map.removeLayer(currentGeoJSONLayer);
    }
    markerLayerGroup.clearLayers();

    currentGeoJSONLayer = L.geoJson(geoJsonData, {
        style: (feature) => style(feature, level),
        onEachFeature: (feature, layer) => {
            onEachFeature(feature, layer, clickHandler, level);
            createMarker(feature, layer, level);
        }
    }).addTo(map);

    if (currentGeoJSONLayer.getBounds().isValid()) {
        map.fitBounds(currentGeoJSONLayer.getBounds(), { padding: [50, 50] });
    }
}

// --- Styling & Colors ---

function style(feature, level) {
    let fillColor;
    let fillOpacity = 0.6;
    let weight = 1;
    let color = 'white';

    if (level === 'village') {
        const count = feature.properties.customerCount || 0;
        fillColor = getCustomerColor(count);
        fillOpacity = 0.8;
    } else {
        fillColor = getRegionColor(feature);
    }

    return {
        fillColor: fillColor,
        weight: weight,
        opacity: 1,
        color: color,
        dashArray: (level === 'province' || level === 'village') ? '' : '3',
        fillOpacity: fillOpacity
    };
}

function getCustomerColor(d) {
    return d > 800 ? '#1e3a8a' : d > 600 ? '#1d4ed8' : d > 400 ? '#3b82f6' : d > 200 ? '#60a5fa' : d > 100 ? '#93c5fd' : '#dbeafe';
}

function getRegionColor(feature) {
    const str = feature.properties.name || feature.properties.district || feature.properties.regency || '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 60%, 85%)`;
}

function onEachFeature(feature, layer, clickHandler, level) {
    layer.on({
        mouseover: (e) => highlightFeature(e, level),
        mouseout: resetHighlight,
        click: (e) => clickHandler(e, feature)
    });
}

function highlightFeature(e, level) {
    var layer = e.target;

    // Interaction Lock Check
    if (isLocked(level, layer)) return;

    layer.setStyle({
        weight: 3,
        color: '#f59e0b',
        dashArray: '',
        fillOpacity: 0.9
    });
    layer.bringToFront();

    const props = layer.feature.properties;
    let name = props.name || props.district || props.regency || props.village;
    let count = props.customerCount;

    if (!count && level !== 'village') {
        const dataObj = findDataObject(name, level);
        if (dataObj) count = dataObj.customerCount;
    }

    info.innerHTML = `<h4>${name}</h4>${count ? `<div class="info-stat"><span class="info-label">Customers</span><span class="info-value">${count.toLocaleString()}</span></div>` : ''}`;
}

function isLocked(level, layer) {
    // If we have a selection at the current level, and this layer isn't it, it's locked.
    const props = layer.feature.properties;
    const name = props.name || props.district || props.regency;

    if (level === 'province' && selectedProvince && selectedProvince.name.toUpperCase() !== name.toUpperCase()) return true;
    if (level === 'regency' && selectedRegency && selectedRegency.name.toUpperCase() !== name.toUpperCase()) return true;
    if (level === 'district' && selectedDistrict && selectedDistrict.name.toUpperCase() !== name.toUpperCase()) return true;

    return false;
}

function findDataObject(name, level) {
    if (!name) return null;
    name = name.toUpperCase();
    if (level === 'province') return mapData.find(p => p.name.toUpperCase() === name);
    if (level === 'regency' && selectedProvince) return selectedProvince.regencies.find(r => r.name.toUpperCase().includes(name) || name.includes(r.name.toUpperCase()));
    if (level === 'district' && selectedRegency && selectedRegency.districts) return selectedRegency.districts.find(d => d.name.toUpperCase() === name);
    return null;
}

function resetHighlight(e) {
    // If locked, restore the locked state (highlight selected, dim others)
    const layer = e.target;
    const level = currentLevel;

    if (level === 'province' && selectedProvince) {
        highlightRegionOnMap(selectedProvince.name, level);
    } else if (level === 'regency' && selectedRegency) {
        highlightRegionOnMap(selectedRegency.name, level);
    } else if (level === 'district' && selectedDistrict) {
        highlightRegionOnMap(selectedDistrict.name, level);
    } else {
        currentGeoJSONLayer.resetStyle(layer);
    }
    info.innerHTML = '<h4>Info Wilayah</h4><div class="info-label">Hover peta untuk detail</div>';
}

// --- Interaction Handlers ---

function onProvinceFeatureClick(e, feature) {
    if (selectedProvince) return; // Locked

    const provId = feature.properties.prov_id;
    if (!provId) return;
    const prov = mapData.find(p => p.id === provId);
    if (prov) {
        highlightRegionOnMap(prov.name, 'province');
        showRegionDetails(prov, 'province');
        selectedProvince = prov; // Set selection to lock map
        map.fitBounds(e.target.getBounds());
    }
}

function onRegencyFeatureClick(e, feature) {
    if (selectedRegency) return; // Locked

    const regencyName = feature.properties.name;
    if (!selectedProvince) return;
    const reg = selectedProvince.regencies.find(r => r.name.toUpperCase() === regencyName.toUpperCase() || regencyName.toUpperCase().includes(r.name.toUpperCase()));
    if (reg) {
        highlightRegionOnMap(reg.name, 'regency');
        showRegionDetails(reg, 'regency');
        selectedRegency = reg; // Set selection to lock map
        map.fitBounds(e.target.getBounds());
    }
}

function onDistrictFeatureClick(e, feature) {
    if (selectedDistrict) return; // Locked

    const districtName = feature.properties.district || feature.properties.name;
    if (!selectedRegency || !selectedRegency.districts) return;
    const dist = selectedRegency.districts.find(d => d.name.toUpperCase() === districtName.toUpperCase() || districtName.toUpperCase().includes(d.name.toUpperCase()));
    if (dist) {
        // highlightRegionOnMap(dist.name, 'district');
        // showRegionDetails(dist, 'district');
        // selectedDistrict = dist; // Set selection to lock map
        // map.fitBounds(e.target.getBounds());

        // Direct navigation to Village view
        loadDistrictMap(dist);
    }
}

function onVillageFeatureClick(e, feature) {
    const name = feature.properties.village || feature.properties.name;
    highlightVillageOnMap(name);
    map.fitBounds(e.target.getBounds());
}

function highlightRegionOnMap(regionName, level) {
    if (!currentGeoJSONLayer) return;

    currentGeoJSONLayer.eachLayer(layer => {
        const props = layer.feature.properties;
        const name = props.name || props.district || props.regency;

        if (name && name.toUpperCase() === regionName.toUpperCase()) {
            layer.setStyle({
                fillColor: '#f59e0b',
                fillOpacity: 0.9,
                weight: 3,
                color: 'white'
            });
            layer.bringToFront();
            // map.fitBounds(layer.getBounds()); // Removed to prevent zoom on hover
        } else {
            layer.setStyle({
                fillColor: '#cbd5e1',
                fillOpacity: 0.1,
                weight: 1,
                color: '#e2e8f0'
            });
        }
    });
}

function highlightVillageOnMap(villageName) {
    if (!currentGeoJSONLayer) return;
    currentGeoJSONLayer.eachLayer(layer => {
        const props = layer.feature.properties;
        const name = props.village || props.name;
        if (name && name.toUpperCase() === villageName.toUpperCase()) {
            layer.setStyle({ weight: 3, color: '#f59e0b', fillOpacity: 0.9 });
            layer.bringToFront();
            // map.fitBounds(layer.getBounds()); // Removed to prevent zoom on hover
            info.innerHTML = `<h4>${name}</h4><div class="info-stat"><span class="info-label">Customers</span><span class="info-value">${props.customerCount}</span></div>`;

            // Show details in sidebar
            // Ensure props has name for showRegionDetails
            const displayProps = { ...props, name: name };
            showRegionDetails(displayProps, 'village');
        } else {
            currentGeoJSONLayer.resetStyle(layer);
        }
    });
}

// --- Combined Markers ---

function createMarker(feature, layer, level) {
    const props = feature.properties;
    let name;

    if (level === 'village') {
        name = props.village || props.name;
    } else {
        name = props.name || props.district || props.regency;
    }

    // Determine count
    let count = props.customerCount;
    if (!count && level !== 'village') {
        const dataObj = findDataObject(name, level);
        if (dataObj) count = dataObj.customerCount;
    }

    if (!name) return;

    const center = layer.getBounds().getCenter();
    addMarkerToLayer(center.lat, center.lng, name, count, level);
}

function addMarkerToLayer(lat, lng, name, count, level, onClick) {
    // Bubble HTML
    let bubbleHtml = '';
    if (count && level !== 'village') { // Only show bubbles for Prov/Reg/Dist
        const size = Math.max(30, Math.min(80, Math.log(count) * 6));
        bubbleHtml = `
            <div class="marker-bubble" style="width: ${size}px; height: ${size}px;">
                ${formatCompactNumber(count)}
            </div>
        `;
    }

    // Label HTML
    const labelHtml = `<div class="marker-label">${name}</div>`;

    const markerIcon = L.divIcon({
        className: 'map-marker-container',
        html: `
            ${bubbleHtml}
            ${labelHtml}
        `,
        iconSize: [100, 100], // Large enough container
        iconAnchor: [50, 50] // Center it
    });

    const marker = L.marker([lat, lng], { icon: markerIcon, interactive: !!onClick });

    if (onClick) {
        marker.on('click', onClick);
    }

    marker.addTo(markerLayerGroup);
}

function formatCompactNumber(number) {
    if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
}

// Start
initMap();

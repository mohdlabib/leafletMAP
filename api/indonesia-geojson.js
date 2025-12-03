/**
 * Indonesia GeoJSON API Client
 * 
 * Klien JavaScript untuk mengakses Indonesia GeoJSON API melalui CDN jsDelivr
 * 
 * @author mohdlabib
 * @license MIT
 * @version 1.0.0
 * 
 * CDN Usage:
 * <script src="https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master/api/indonesia-geojson.js"></script>
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.IndonesiaGeoJSON = factory());
})(this, (function () {
    'use strict';

    const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mohdlabib/leafletMAP@master';
    
    // Cache for storing fetched data
    const cache = new Map();
    
    /**
     * Fetch data with optional caching
     * @param {string} url - URL to fetch
     * @param {boolean} useCache - Whether to use cache
     * @returns {Promise<any>} - Fetched data
     */
    async function fetchData(url, useCache = true) {
        if (useCache && cache.has(url)) {
            return cache.get(url);
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
        }
        
        const data = await response.json();
        
        if (useCache) {
            cache.set(url, data);
        }
        
        return data;
    }

    /**
     * Indonesia GeoJSON API Client
     */
    const IndonesiaGeoJSON = {
        /**
         * CDN Base URL
         */
        CDN_BASE,

        /**
         * Clear cache
         */
        clearCache() {
            cache.clear();
        },

        // ========== URL Builders ==========

        /**
         * Get URL for master index
         * @returns {string}
         */
        getMasterIndexUrl() {
            return `${CDN_BASE}/map_index.json`;
        },

        /**
         * Get URL for provinces list
         * @returns {string}
         */
        getProvincesListUrl() {
            return `${CDN_BASE}/provinces.json`;
        },

        /**
         * Get URL for all provinces map
         * @param {boolean} simplified - Use simplified version
         * @returns {string}
         */
        getAllProvincesUrl(simplified = true) {
            const file = simplified ? 'prov%2037%20simplified.geojson' : 'prov%2037.geojson';
            return `${CDN_BASE}/indonesia-district/${file}`;
        },

        /**
         * Get URL for all regencies map
         * @returns {string}
         */
        getAllRegenciesUrl() {
            return `${CDN_BASE}/indonesia-district/kab%2037.geojson`;
        },

        /**
         * Get URL for province districts
         * @param {string} provinceFolder - Province folder name (e.g., 'id11_aceh')
         * @returns {string}
         */
        getProvinceDistrictsUrl(provinceFolder) {
            return `${CDN_BASE}/indonesia-district/${provinceFolder}/${provinceFolder}_district.geojson`;
        },

        /**
         * Get URL for regency map
         * @param {string} provinceFolder - Province folder name
         * @param {string} regencyFolder - Regency folder name
         * @returns {string}
         */
        getRegencyMapUrl(provinceFolder, regencyFolder) {
            return `${CDN_BASE}/indonesia-district/${provinceFolder}/${regencyFolder}/${regencyFolder}.geojson`;
        },

        /**
         * Get URL for district map
         * @param {string} filePath - Full file path from map_index.json
         * @returns {string}
         */
        getDistrictMapUrl(filePath) {
            return `${CDN_BASE}/${filePath}`;
        },

        // ========== Data Fetchers ==========

        /**
         * Get master index with full hierarchy
         * @returns {Promise<Array>}
         */
        async getMasterIndex() {
            return fetchData(this.getMasterIndexUrl());
        },

        /**
         * Get simple provinces list
         * @returns {Promise<Array>}
         */
        async getProvincesList() {
            return fetchData(this.getProvincesListUrl());
        },

        /**
         * Get all provinces GeoJSON
         * @param {boolean} simplified - Use simplified version
         * @returns {Promise<GeoJSON>}
         */
        async getAllProvinces(simplified = true) {
            return fetchData(this.getAllProvincesUrl(simplified));
        },

        /**
         * Get all regencies GeoJSON
         * @returns {Promise<GeoJSON>}
         */
        async getAllRegencies() {
            return fetchData(this.getAllRegenciesUrl());
        },

        /**
         * Get province by ID
         * @param {string} provinceId - Province ID (e.g., '11' for Aceh)
         * @returns {Promise<Object|null>}
         */
        async getProvinceById(provinceId) {
            const index = await this.getMasterIndex();
            return index.find(p => p.id === provinceId) || null;
        },

        /**
         * Get province by name
         * @param {string} provinceName - Province name (e.g., 'Aceh')
         * @returns {Promise<Object|null>}
         */
        async getProvinceByName(provinceName) {
            const index = await this.getMasterIndex();
            const search = provinceName.toLowerCase();
            return index.find(p => p.name.toLowerCase().includes(search)) || null;
        },

        /**
         * Get province districts GeoJSON
         * @param {string} provinceFolder - Province folder name
         * @returns {Promise<GeoJSON>}
         */
        async getProvinceDistricts(provinceFolder) {
            return fetchData(this.getProvinceDistrictsUrl(provinceFolder));
        },

        /**
         * Get regency map GeoJSON
         * @param {string} provinceFolder - Province folder name
         * @param {string} regencyFolder - Regency folder name
         * @returns {Promise<GeoJSON>}
         */
        async getRegencyMap(provinceFolder, regencyFolder) {
            return fetchData(this.getRegencyMapUrl(provinceFolder, regencyFolder));
        },

        /**
         * Get district map GeoJSON
         * @param {string} filePath - Full file path
         * @returns {Promise<GeoJSON>}
         */
        async getDistrictMap(filePath) {
            return fetchData(this.getDistrictMapUrl(filePath));
        },

        /**
         * Get regencies in a province
         * @param {string} provinceId - Province ID
         * @returns {Promise<Array>}
         */
        async getRegenciesByProvinceId(provinceId) {
            const province = await this.getProvinceById(provinceId);
            return province ? province.regencies : [];
        },

        /**
         * Get districts in a regency
         * @param {string} provinceId - Province ID
         * @param {string} regencyId - Regency ID
         * @returns {Promise<Array>}
         */
        async getDistrictsByRegencyId(provinceId, regencyId) {
            const regencies = await this.getRegenciesByProvinceId(provinceId);
            const regency = regencies.find(r => r.id === regencyId);
            return regency ? regency.districts : [];
        },

        // ========== Search Functions ==========

        /**
         * Search provinces by name
         * @param {string} query - Search query
         * @returns {Promise<Array>}
         */
        async searchProvinces(query) {
            const index = await this.getMasterIndex();
            const search = query.toLowerCase();
            return index.filter(p => p.name.toLowerCase().includes(search));
        },

        /**
         * Search regencies by name across all provinces
         * @param {string} query - Search query
         * @returns {Promise<Array>}
         */
        async searchRegencies(query) {
            const index = await this.getMasterIndex();
            const search = query.toLowerCase();
            const results = [];
            
            for (const province of index) {
                if (province.regencies) {
                    for (const regency of province.regencies) {
                        if (regency.name.toLowerCase().includes(search)) {
                            results.push({
                                ...regency,
                                provinceName: province.name,
                                provinceId: province.id,
                                provinceFolder: province.folder
                            });
                        }
                    }
                }
            }
            
            return results;
        },

        /**
         * Search districts by name across all regencies
         * @param {string} query - Search query
         * @returns {Promise<Array>}
         */
        async searchDistricts(query) {
            const index = await this.getMasterIndex();
            const search = query.toLowerCase();
            const results = [];
            
            for (const province of index) {
                if (province.regencies) {
                    for (const regency of province.regencies) {
                        if (regency.districts) {
                            for (const district of regency.districts) {
                                if (district.name.toLowerCase().includes(search)) {
                                    results.push({
                                        ...district,
                                        provinceName: province.name,
                                        provinceId: province.id,
                                        provinceFolder: province.folder,
                                        regencyName: regency.name,
                                        regencyId: regency.id,
                                        regencyFolder: regency.folder
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            return results;
        },

        // ========== Statistics ==========

        /**
         * Get statistics about the data
         * @returns {Promise<Object>}
         */
        async getStatistics() {
            const index = await this.getMasterIndex();
            
            let totalProvinces = index.length;
            let totalRegencies = 0;
            let totalDistricts = 0;
            
            for (const province of index) {
                if (province.regencies) {
                    totalRegencies += province.regencies.length;
                    for (const regency of province.regencies) {
                        if (regency.districts) {
                            totalDistricts += regency.districts.length;
                        }
                    }
                }
            }
            
            return {
                totalProvinces,
                totalRegencies,
                totalDistricts,
                lastUpdated: new Date().toISOString()
            };
        },

        // ========== Utility Functions ==========

        /**
         * Convert province name to folder name
         * @param {string} name - Province name
         * @param {string} id - Province ID
         * @returns {string}
         */
        toFolderName(name, id) {
            const safeName = name.toLowerCase().replace(/ /g, '_');
            return `id${id}_${safeName}`;
        },

        /**
         * Get all available province IDs
         * @returns {Promise<Array<string>>}
         */
        async getAllProvinceIds() {
            const index = await this.getMasterIndex();
            return index.map(p => p.id);
        },

        /**
         * Check if a province exists
         * @param {string} provinceId - Province ID
         * @returns {Promise<boolean>}
         */
        async provinceExists(provinceId) {
            const province = await this.getProvinceById(provinceId);
            return province !== null;
        }
    };

    return IndonesiaGeoJSON;
}));

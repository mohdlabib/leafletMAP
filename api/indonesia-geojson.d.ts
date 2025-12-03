/**
 * Indonesia GeoJSON API - TypeScript Definitions
 * 
 * @author mohdlabib
 * @license MIT
 * @version 1.0.0
 */

declare module 'indonesia-geojson' {
    /**
     * GeoJSON Feature
     */
    interface GeoJSONFeature {
        type: 'Feature';
        properties: {
            prov_id?: string;
            name?: string;
            regency?: string;
            district?: string;
            village?: string;
            [key: string]: any;
        };
        geometry: {
            type: 'Polygon' | 'MultiPolygon';
            coordinates: number[][][] | number[][][][];
        };
    }

    /**
     * GeoJSON FeatureCollection
     */
    interface GeoJSONFeatureCollection {
        type: 'FeatureCollection';
        features: GeoJSONFeature[];
    }

    /**
     * District data structure
     */
    interface District {
        id: string;
        name: string;
        file: string;
    }

    /**
     * Regency data structure
     */
    interface Regency {
        id: string;
        name: string;
        folder: string;
        file: string | null;
        districts: District[];
    }

    /**
     * Province data structure
     */
    interface Province {
        id: string;
        name: string;
        folder: string;
        regencies: Regency[];
    }

    /**
     * Simple province item
     */
    interface ProvinceListItem {
        file: string;
        name: string;
    }

    /**
     * Search result for regency
     */
    interface RegencySearchResult extends Regency {
        provinceName: string;
        provinceId: string;
        provinceFolder: string;
    }

    /**
     * Search result for district
     */
    interface DistrictSearchResult extends District {
        provinceName: string;
        provinceId: string;
        provinceFolder: string;
        regencyName: string;
        regencyId: string;
        regencyFolder: string;
    }

    /**
     * Statistics data
     */
    interface Statistics {
        totalProvinces: number;
        totalRegencies: number;
        totalDistricts: number;
        lastUpdated: string;
    }

    /**
     * Indonesia GeoJSON API Client
     */
    interface IndonesiaGeoJSON {
        /**
         * CDN Base URL
         */
        CDN_BASE: string;

        /**
         * Clear all cached data
         */
        clearCache(): void;

        // URL Builders
        getMasterIndexUrl(): string;
        getProvincesListUrl(): string;
        getAllProvincesUrl(simplified?: boolean): string;
        getAllRegenciesUrl(): string;
        getProvinceDistrictsUrl(provinceFolder: string): string;
        getRegencyMapUrl(provinceFolder: string, regencyFolder: string): string;
        getDistrictMapUrl(filePath: string): string;

        // Data Fetchers
        getMasterIndex(): Promise<Province[]>;
        getProvincesList(): Promise<ProvinceListItem[]>;
        getAllProvinces(simplified?: boolean): Promise<GeoJSONFeatureCollection>;
        getAllRegencies(): Promise<GeoJSONFeatureCollection>;
        getProvinceById(provinceId: string): Promise<Province | null>;
        getProvinceByName(provinceName: string): Promise<Province | null>;
        getProvinceDistricts(provinceFolder: string): Promise<GeoJSONFeatureCollection>;
        getRegencyMap(provinceFolder: string, regencyFolder: string): Promise<GeoJSONFeatureCollection>;
        getDistrictMap(filePath: string): Promise<GeoJSONFeatureCollection>;
        getRegenciesByProvinceId(provinceId: string): Promise<Regency[]>;
        getDistrictsByRegencyId(provinceId: string, regencyId: string): Promise<District[]>;

        // Search Functions
        searchProvinces(query: string): Promise<Province[]>;
        searchRegencies(query: string): Promise<RegencySearchResult[]>;
        searchDistricts(query: string): Promise<DistrictSearchResult[]>;

        // Statistics
        getStatistics(): Promise<Statistics>;

        // Utility Functions
        toFolderName(name: string, id: string): string;
        getAllProvinceIds(): Promise<string[]>;
        provinceExists(provinceId: string): Promise<boolean>;
    }

    const IndonesiaGeoJSON: IndonesiaGeoJSON;
    export = IndonesiaGeoJSON;
}

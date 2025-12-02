const fs = require('fs');
const path = require('path');

const rootDir = 'indonesia-district';
const outputFile = 'map_index.json';

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

function getFiles(srcPath, extension) {
    return fs.readdirSync(srcPath).filter(file => file.endsWith(extension));
}

const mapIndex = [];

// 1. Get Provinces
const provinceDirs = getDirectories(rootDir).filter(d => d.startsWith('id'));

provinceDirs.forEach(provDir => {
    const provPath = path.join(rootDir, provDir);
    // provDir format: id11_aceh
    const provId = provDir.match(/^id(\d+)_/)?.[1];
    const provNameRaw = provDir.replace(/^id\d+_/, '').replace(/_/g, ' ');
    const provName = provNameRaw.replace(/\b\w/g, l => l.toUpperCase()); // Title Case

    const provinceObj = {
        id: provId,
        name: provName,
        folder: provDir,
        regencies: []
    };

    // 2. Get Regencies
    const regencyDirs = getDirectories(provPath).filter(d => d.startsWith('id'));

    regencyDirs.forEach(regDir => {
        const regPath = path.join(provPath, regDir);
        // regDir format: id1101_simeulue
        const regId = regDir.match(/^id(\d+)_/)?.[1];
        const regNameRaw = regDir.replace(/^id\d+_/, '').replace(/_/g, ' ');
        const regName = regNameRaw.replace(/\b\w/g, l => l.toUpperCase());

        // Find Regency GeoJSON
        // Usually id1101_simeulue.geojson inside the folder, OR sometimes district files.
        // Based on previous exploration, regency folder contains district geojsons.
        // But wait, is there a combined regency file?
        // Let's look for a file that matches the folder name + .geojson
        let regFile = null;
        const potentialRegFile = path.join(regPath, `${regDir}.geojson`);
        if (fs.existsSync(potentialRegFile)) {
            regFile = potentialRegFile.replace(/\\/g, '/');
        } else {
            // Try searching for any .geojson that looks like the regency file
            const geojsons = getFiles(regPath, '.geojson');
            // If there's a file with 'district' in name, it might be the one?
            // Actually, the user wants to load "Regency" map.
            // If individual district files exist, we might list them.
        }

        const regencyObj = {
            id: regId,
            name: regName,
            folder: regDir,
            file: regFile, // Might be null if only district files exist
            districts: []
        };

        // 3. Get Districts (GeoJSON files)
        const districtFiles = getFiles(regPath, '.geojson');
        districtFiles.forEach(distFile => {
            if (distFile === `${regDir}.geojson`) return; // Skip the regency combined file if it exists

            const distPath = path.join(regPath, distFile);
            // distFile format: id1101010_teupah_selatan.geojson
            const distId = distFile.match(/^id(\d+)_/)?.[1];
            let distName = distFile.replace(/^id\d+_/, '').replace('.geojson', '').replace(/_/g, ' ');
            distName = distName.replace(/\b\w/g, l => l.toUpperCase());

            regencyObj.districts.push({
                id: distId,
                name: distName,
                file: distPath.replace(/\\/g, '/')
            });
        });

        provinceObj.regencies.push(regencyObj);
    });

    mapIndex.push(provinceObj);
});

fs.writeFileSync(outputFile, JSON.stringify(mapIndex, null, 4));
console.log(`Generated ${outputFile} with ${mapIndex.length} provinces.`);

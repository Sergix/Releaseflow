"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const archiver = require("archiver");
const config = require("./config");
const colors = require("colors");
function release() {
    // TODO
    // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
    // add custom export filename in config
    let filename;
    let archive;
    if (config.data.source.compression === 'zip') {
        filename = config.data.source.dist + 'src-' + config.projectPackage.version + '.zip';
        archive = archiver('zip', {
            zlib: { level: 9 }
        });
    }
    else if (config.data.source.compression === 'tar') {
        filename = config.data.source.dist + 'src-' + config.projectPackage.version + '.tar.gz';
        archive = archiver('tar', {
            gzip: true,
            gzipOptions: { level: 9 }
        });
    }
    const output = fs.createWriteStream(filename);
    output.on('close', function () {
        console.info(colors.green('Finished packaging source to '), colors.bgGreen.white(`${filename}`));
    });
    output.on('end', function () {
        console.warn('Issue with data.');
    });
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.warn(err);
        }
        else {
            throw err;
        }
    });
    archive.on('error', function (err) {
        throw err;
    });
    archive.pipe(output);
    config.data.source.dir.forEach((dir) => {
        dir.trim();
        archive.glob(dir);
    });
    archive.finalize();
}
exports.default = release;
//# sourceMappingURL=source.js.map
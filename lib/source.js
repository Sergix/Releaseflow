"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const archiver = require("archiver");
const util_1 = require("./util");
const colors = require("colors");
const config_1 = require("./config");
function release() {
    // TODO
    // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
    let archive;
    let filename;
    config_1.rfconfig.source.compression.forEach((type) => {
        if (type === 'zip') {
            filename = util_1.replacer(config_1.rfconfig.source.dist, { interpolate: true, ext: 'zip' });
            filename = util_1.filenameHandler(filename, 'zip', 'src', 'source package');
            archive = archiver('zip', {
                zlib: { level: 9 }
            });
        }
        else if (type === 'tar') {
            filename = util_1.replacer(config_1.rfconfig.source.dist, { interpolate: true, ext: 'tar.gz' });
            filename = util_1.filenameHandler(filename, 'tar.gz', 'src', 'source package');
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
        config_1.rfconfig.source.dir.forEach((dir) => {
            dir.trim();
            archive.glob(dir);
        });
        archive.finalize();
    });
}
exports.default = release;
//# sourceMappingURL=source.js.map
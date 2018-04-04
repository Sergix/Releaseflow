"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const fs = require("fs");
const colors = require("colors");
const util = require("./util");
const util_1 = require("util");
const config_1 = require("./config");
exports.toc = '';
let bIndex = 1;
let tIndex = 1;
const contents = [];
function title(text) {
    let output = '';
    if (config_1.rfconfig.markdown) {
        for (let i = 0; i < bIndex; i++) {
            output += '#';
        }
    }
    output += ` ${util.replacer(text, { interpolate: true })}` + util.nl;
    contents.push(output);
}
function build(x) {
    bIndex++;
    for (const y in x) {
        if (util_1.isObject(x[y])) {
            title(y);
            build(x[y]);
            bIndex--;
        }
        else {
            title(y);
            if (!config_1.rfconfig.markdown)
                contents.push('----------------------');
            contents.push(util.replacer(x[y], { interpolate: true }));
            contents.push(util.nl);
        }
    }
}
function buildToc(x) {
    let t = 1;
    for (const y in x) {
        if (util_1.isObject(x[y])) {
            tIndex++;
            buildToc(x[y]);
            tIndex--;
        }
        else {
            for (let i = 0; i < tIndex - 1; i++) {
                exports.toc += '\t';
            }
            exports.toc += `${t}. ${y}  ` + util.nl;
            t++;
        }
    }
}
function release() {
    const ext = config_1.rfconfig.markdown ? 'md' : 'txt';
    let filename = util.replacer(config_1.rfconfig.docs.dist, { interpolate: true });
    let isDir = false;
    title(config_1.rfconfig.docs.title + util.nl);
    buildToc(config_1.rfconfig.docs.template);
    build(config_1.rfconfig.docs.template);
    // check if the file exists
    try {
        fs.accessSync(filename, fs.constants.F_OK);
        isDir = false;
    }
    catch (err) {
        // check if its a directory
        try {
            fs.statSync(filename).isDirectory();
            isDir = true;
        }
        catch (err) {
            isDir = false;
        }
    }
    // if it's a directory, use the default changelog filename
    if (isDir) {
        if (!filename.endsWith('/') && !filename.endsWith('\\')) {
            filename += '/';
        }
        filename += 'docs-' +
            (config.projectPackage.version !== undefined && config.projectPackage.version !== null ?
                config.projectPackage.version :
                (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the documentation filename.')), Date.now().toString())) + '.' + ext;
    }
    // Write the doc contents to the file!
    fs.writeFile(filename, util.stringify(contents), (err) => {
        if (!err) {
            console.info(colors.green('Finished writing documentation. Wrote to'), colors.bgGreen.white(`${filename}`));
        }
        else {
            console.error(colors.red('ERROR: Failed to create documentation at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'));
        }
    });
}
exports.default = release;
//# sourceMappingURL=docs.js.map
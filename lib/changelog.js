"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const regexp = require("./regexp");
const util = require("./util");
const colors = require("colors");
const fs = require("fs");
exports.current = [];
function get() {
    const data = [];
    const fileContents = fs.readFileSync(config.data.changelog.path).toString();
    let line = '';
    for (let i = 0; i < fileContents.length; i++) {
        if (fileContents[i] === '\n') {
            config.data.changelog.ignore.forEach((x) => {
                if (x !== line.trim())
                    data[data.length] = line.trim();
            });
            line = '';
            continue;
        }
        if (fileContents[i] !== '\r') {
            line += fileContents[i];
        }
    }
    data[data.length] = line.trim();
    return data;
}
exports.get = get;
function match(x) {
    const data = [];
    const testString = regexp.replacer(config.data.changelog.header_format);
    const regex = new RegExp(testString);
    let flag = false;
    for (let i = 0; i < x.length; i++) {
        if (!flag) {
            if (regex.test(x[i])) {
                flag = true;
            }
            continue;
        }
        if (x[i] === '\n' || x[i] === '') {
            flag = false;
            continue;
        }
        data[data.length] = (!x[i].trim().startsWith('-') ? '- ' : '') + (config.data.changelog.replace_links ? util.replacer(x[i], { 'links': true }) : x[i]);
    }
    return data;
}
exports.match = match;
function release(file = true) {
    const ext = config.data.markdown ? 'md' : 'txt';
    let isDir = false;
    let filename = util.replacer(config.data.changelog.dist, { interpolate: true });
    exports.current = match(get());
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
        filename += 'changelog-' +
            (config.projectPackage.version !== undefined && config.projectPackage.version !== null ?
                config.projectPackage.version :
                (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the changelog filename.')), Date.now().toString())) + '.' + ext;
    }
    // Write the contents to the file!
    fs.writeFile(filename, util.stringify(exports.current), (err) => {
        if (!err) {
            console.info(colors.green('Finished writing changelog. Wrote to'), colors.bgGreen.white(`${filename}`));
        }
        else {
            console.error(colors.red('ERROR: Failed to create changelog at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'));
        }
    });
}
exports.release = release;
//# sourceMappingURL=changelog.js.map